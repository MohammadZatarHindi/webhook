import { pool } from "../../config/db";
import { WebhookEvent } from "./webhooks.schema";

// Queue webhook as events for each matching pipeline
export const createEvent = async (event: WebhookEvent) => {
  const pipelinesResult = await pool.query(
	  `SELECT id FROM pipelines WHERE action_type = $1`,
	  [event.event] // guaranteed to match one of your action_types
  );

  const pipelines = pipelinesResult.rows;

  if (pipelines.length === 0) return [];

  const createdEvents = [];

	for (const p of pipelines) {
		const result = await pool.query(
		`INSERT INTO events (pipeline_id, payload) VALUES ($1, $2) RETURNING *`,
		[p.id, event.data]
		);
		createdEvents.push(result.rows[0]);
	}

  return createdEvents;
};