import { pool } from "../config/db";

export const getNextEvent = async () => {
  const result = await pool.query(`
    WITH next_job AS (
      SELECT e.id, e.payload, e.pipeline_id, p.action_type
      FROM events e
      JOIN pipelines p ON e.pipeline_id = p.id
      WHERE e.status = 'pending'
      ORDER BY e.created_at
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE events
    SET status = 'processing', last_attempt = NOW()
    FROM next_job
    WHERE events.id = next_job.id
    RETURNING next_job.*;
  `);

  return result.rows[0]; // returns undefined if no pending jobs
};