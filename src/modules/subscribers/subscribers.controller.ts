import { Request, Response } from "express";
import * as subscriberService from "./subscribers.service";
import { createSubscriberSchema } from "./subscribers.schema";

// Add subscriber
export const addSubscriberHandler = async (req: Request, res: Response) => {
  try {
    const parsed = createSubscriberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    // Use the correct field name from schema
    const pipelineId = Number(parsed.data.pipeline_id); 
    if (isNaN(pipelineId)) {
      return res.status(400).json({ error: "pipeline_id must be a number" });
    }

    const subscriber = await subscriberService.addSubscriber(
      pipelineId,
      String(parsed.data.url) // ensure it's a string
    );

    res.status(201).json(subscriber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List subscribers
export const listSubscribersHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseInt(String(req.params.pipelineId));
    if (isNaN(pipelineId)) return res.status(400).json({ error: "Invalid pipelineId" });

    const subscribers = await subscriberService.listSubscribers(pipelineId);
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove subscriber
export const removeSubscriberHandler = async (req: Request, res: Response) => {
  try {
    const pipelineId = parseInt(String(req.params.pipelineId));
    const subscriberId = parseInt(String(req.params.subscriberId));
    if (isNaN(pipelineId) || isNaN(subscriberId)) {
      return res.status(400).json({ error: "Invalid pipelineId or subscriberId" });
    }

    await subscriberService.removeSubscriber(pipelineId, subscriberId);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};