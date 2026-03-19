import 'dotenv/config';
import { pool } from "../config/db";
import fetch from "node-fetch";

// ----------------------
// Pipeline Actions
// ----------------------
const ACTIONS: Record<string, (data: any) => any> = {
  log: (data: any) => data,
  uppercase: (data: any) => {
    if (data.text) data.text = String(data.text).toUpperCase();
    return data;
  },
  reverse: (data: any) => {
    if (data.text) data.text = String(data.text).split("").reverse().join("");
    return data;
  },
};

// ----------------------
// Config
// ----------------------
const PROCESS_INTERVAL = 2000;      // 2 seconds
const MAX_JOB_RETRIES = 3;          // max job attempts
const MAX_SUBSCRIBER_RETRIES = 3;   // max retries per subscriber
const RETRY_DELAY_MS = 1000;        // wait between subscriber retries

// ----------------------
// Helpers
// ----------------------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ----------------------
// Worker Function
// ----------------------
export const processJobs = async () => {
  const client = await pool.connect();

  try {
    // Atomically fetch a pending job
    const { rows } = await client.query(
      `UPDATE events
       SET status = 'processing'
       WHERE id = (
         SELECT id FROM events
         WHERE status = 'pending' AND attempts < $1
         ORDER BY created_at ASC
         LIMIT 1
         FOR UPDATE SKIP LOCKED
       )
       RETURNING *`,
      [MAX_JOB_RETRIES]
    );

    const job = rows[0];
    if (!job) return; // no pending jobs

    console.log(`\nProcessing Job ${job.id} (Pipeline ${job.pipeline_id})`);

    // ----------------------
    // Determine action_type
    // ----------------------
    let actionType = job.action_type;

    // fallback to pipeline action_type if missing
    if (!actionType) {
      const res = await client.query(
        `SELECT action_type FROM pipelines WHERE id = $1`,
        [job.pipeline_id]
      );
      actionType = res.rows[0]?.action_type;
    }

    const actionFn = actionType ? ACTIONS[actionType.toLowerCase()] : undefined;

    if (!actionFn) {
      const errMsg = `Unknown action_type "${actionType}" for job ${job.id}`;
      console.error(errMsg);

      await client.query(
        `UPDATE events
         SET status = 'failed',
             attempts = attempts + 1,
             last_attempt = NOW(),
             error = $1
         WHERE id = $2`,
        [errMsg, job.id]
      );
      return; // stop processing
    }

    // ----------------------
    // Execute action
    // ----------------------
    const result = actionFn(job.payload);
    console.log(`[Job ${job.id}] Action: ${actionType.toUpperCase()}, Result:`, result);

    // ----------------------
    // Deliver to subscribers
    // ----------------------
    const { rows: subs } = await client.query(
      `SELECT id, url FROM subscribers WHERE pipeline_id = $1`,
      [job.pipeline_id]
    );

    let allDelivered = true;
    let lastError: string | null = null;

    for (const sub of subs) {
      let delivered = false;

      for (let attempt = 1; attempt <= MAX_SUBSCRIBER_RETRIES; attempt++) {
        try {
          const res = await fetch(sub.url, {
            method: 'POST',
            body: JSON.stringify(result),
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
          delivered = true;
          console.log(`Delivered to ${sub.url}`);
          break;

        } catch (err: unknown) {
          lastError = err instanceof Error ? err.message : String(err);
          console.error(`Attempt ${attempt} failed for ${sub.url}: ${lastError}`);
          await sleep(RETRY_DELAY_MS);
        }
      }

      if (!delivered) {
        allDelivered = false;
        console.error(`Failed to deliver to ${sub.url} after ${MAX_SUBSCRIBER_RETRIES} attempts`);
      }
    }

    // ----------------------
    // Update job status
    // ----------------------
    const newAttempts = job.attempts + 1;
    const newStatus = allDelivered
      ? 'success'
      : newAttempts >= MAX_JOB_RETRIES
      ? 'failed'
      : 'pending';

    await client.query(
      `UPDATE events
       SET status = $1,
           attempts = $2,
           last_attempt = NOW(),
           error = $3
       WHERE id = $4`,
      [newStatus, newAttempts, allDelivered ? null : lastError, job.id]
    );

    console.log(`Job ${job.id} ${newStatus.toUpperCase()}`);

  } finally {
    client.release();
  }
};

// ----------------------
// Worker Loop
// ----------------------
setInterval(processJobs, PROCESS_INTERVAL);