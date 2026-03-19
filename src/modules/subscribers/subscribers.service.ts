import { pool } from "../../config/db";
import { Subscriber } from "./subscribers.types";

// Add a new subscriber to a pipeline
export const addSubscriber = async (pipelineId: number, url: string): Promise<Subscriber> => {
  const result = await pool.query(
    `INSERT INTO subscribers (pipeline_id, url) VALUES ($1, $2) RETURNING *`,
    [pipelineId, url]
  );
  return result.rows[0];
};

// List all subscribers for a pipeline
export const listSubscribers = async (pipelineId: number): Promise<Subscriber[]> => {
  const result = await pool.query(
    `SELECT * FROM subscribers WHERE pipeline_id = $1 ORDER BY id`,
    [pipelineId]
  );
  return result.rows;
};

// Remove a subscriber
export const removeSubscriber = async (pipelineId: number, subscriberId: number): Promise<void> => {
  await pool.query(
    `DELETE FROM subscribers WHERE pipeline_id = $1 AND id = $2`,
    [pipelineId, subscriberId]
  );
};