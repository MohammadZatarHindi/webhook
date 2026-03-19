import { Router } from "express";
import { listJobsHandler, getJobHandler } from "./jobs.controller";

const router = Router();

// GET /api/jobs?pipelineId=1&status=pending
router.get("/", listJobsHandler);
router.get("/:jobId", getJobHandler);    // GET /api/jobs/:jobId

export default router;