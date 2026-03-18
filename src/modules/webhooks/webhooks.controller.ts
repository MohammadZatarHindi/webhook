import { Request, Response } from "express";
import { webhookSchema } from "./webhooks.schema";
import * as webhookService from "./webhooks.service";

/**
 * Controller to handle incoming webhook requests
 * - Validates request body using Zod
 * - Calls service layer to process webhook
 * - Returns status and triggered pipelines
 */
export const receiveWebhookHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsed = webhookSchema.safeParse(req.body);

    if (!parsed.success) {
      // Invalid request body, return errors
      return res.status(400).json({ error: parsed.error.errors });
    }

    // Process webhook event
    const result = await webhookService.processWebhook(parsed.data);

    // Respond with triggered pipelines
    res.status(200).json({ status: "success", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};