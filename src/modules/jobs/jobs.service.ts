import { pool } from "../../config/db";
import { Job, JobStatus } from "./jobs.types";

interface GetJobsOptions {
  pipelineId?: number;
  status?: JobStatus;
}

export const getJobs = async (options?: GetJobsOptions): Promise<Job[]> => {
  const params: any[] = [];
  const conditions: string[] = [];

  if (options?.pipelineId) {
    params.push(options.pipelineId);
    conditions.push(`pipeline_id = $${params.length}`);
  }

  if (options?.status) {
    params.push(options.status);
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT * FROM events ${whereClause} ORDER BY created_at DESC`,
    params
  );

  return result.rows;
};

export const getJobById = async (jobId: number): Promise<Job | null> => {
  const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [jobId]);
  return result.rows[0] || null;
};