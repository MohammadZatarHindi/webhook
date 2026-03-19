import { pool } from "../../config/db";
import { Pipeline, ActionType } from "./pipelines.types";

export const listPipelines = async (): Promise<Pipeline[]> => {
  const result = await pool.query(`SELECT * FROM pipelines ORDER BY created_at DESC`);
  return result.rows;
};

export const getPipelineById = async (pipelineId: number): Promise<Pipeline | null> => {
  const result = await pool.query(`SELECT * FROM pipelines WHERE id = $1`, [pipelineId]);
  return result.rows[0] || null;
};

export const createPipeline = async (name: string, action: ActionType): Promise<Pipeline> => {
  const result = await pool.query(
    `INSERT INTO pipelines (name, action_type) VALUES ($1, $2) RETURNING *`,
    [name, action]
  );
  return result.rows[0];
};

export const updatePipeline = async (
  pipelineId: number,
  data: { name?: string; action_type?: ActionType }
): Promise<Pipeline | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.name) {
    fields.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.action_type) {
    fields.push(`action_type = $${idx++}`);
    values.push(data.action_type);
  }
  if (fields.length === 0) return getPipelineById(pipelineId);

  values.push(pipelineId);
  const result = await pool.query(
    `UPDATE pipelines SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const deletePipeline = async (pipelineId: number): Promise<void> => {
  await pool.query(`DELETE FROM pipelines WHERE id = $1`, [pipelineId]);
};