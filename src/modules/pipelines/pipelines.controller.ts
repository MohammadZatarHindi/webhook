import { Request, Response } from "express";
import * as pipelineService from "./pipelines.service";
import { createPipelineSchema } from "./pipelines.schema";
import { ActionType } from "./pipelines.types";

// Create pipeline
export const createPipelineHandler = async (req: Request, res: Response) => {
  try {
    const validated = createPipelineSchema.parse(req.body);
    const pipeline = await pipelineService.createPipeline(validated.name, validated.action);
    res.status(201).json(pipeline);
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.errors });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List all pipelines
export const listPipelinesHandler = async (_req: Request, res: Response) => {
  try {
    const pipelines = await pipelineService.listPipelines();
    res.json(pipelines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get pipeline by ID
export const getPipelineByIdHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseInt(req.params.pipelineId as string);
    const pipeline = await pipelineService.getPipelineById(pipelineId);
    if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });
    res.json(pipeline);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update pipeline
export const updatePipelineHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseInt(req.params.pipelineId as string);
    const data: { name?: string; action_type?: ActionType } = req.body;
    const updated = await pipelineService.updatePipeline(pipelineId, data);
    if (!updated) return res.status(404).json({ error: "Pipeline not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete pipeline
export const deletePipelineHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseInt(req.params.pipelineId as string);
    await pipelineService.deletePipeline(pipelineId);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};