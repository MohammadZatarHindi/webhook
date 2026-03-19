import { Request, Response } from "express";
import * as jobsService from "./jobs.service";
import { JobStatus } from "./jobs.types";

// Safely extract number from query or params
const parseQueryNumber = (param: any, paramName: string): number | undefined => {
  if (!param) return undefined;

  // If it's an array, take the first element
  const str = Array.isArray(param) ? param[0] : param;

  // If it's still an object, cannot parse
  if (typeof str !== "string") throw new Error(`${paramName} must be a valid string`);

  const num = parseInt(str, 10);
  if (isNaN(num)) throw new Error(`${paramName} must be a valid number`);
  return num;
};

// GET /api/jobs?pipelineId=1&status=pending
export const listJobsHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseQueryNumber(req.query.pipelineId, "pipelineId");

    let status: JobStatus | undefined;
    const s = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    if (typeof s === "string") status = s as JobStatus;

    const jobs = await jobsService.getJobs({ pipelineId, status });

    res.json(jobs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// GET /api/jobs/:jobId
export const getJobHandler = async (req: Request, res: Response) => {
  try {
    const jobId = parseQueryNumber(req.params.jobId, "jobId");
    if (!jobId) return res.status(400).json({ error: "Job ID is required" });

    const job = await jobsService.getJobById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};