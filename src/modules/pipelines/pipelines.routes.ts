import { Router } from "express";
import * as pipelineController from "./pipelines.controller";

const router = Router();

// Correct route handlers
router.get("/", pipelineController.listPipelinesHandler);
router.post("/", pipelineController.createPipelineHandler);
router.get("/:pipelineId", pipelineController.getPipelineByIdHandler);
router.put("/:pipelineId", pipelineController.updatePipelineHandler);
router.delete("/:pipelineId", pipelineController.deletePipelineHandler);

export default router;