import { Request, Response } from "express";
import { webhookSchema } from "./webhooks.schema";
import * as webhookService from "./webhooks.service";

export const receiveWebhookHandler = async (req: Request, res: Response) => {
  try {
    const parsed = webhookSchema.safeParse(req.body);

    if (!parsed.success) {
      // Correct way to get errors
      const errors = parsed.error.flatten();
      return res.status(400).json({ error: errors.fieldErrors });
    }

    const events = await webhookService.createEvent(parsed.data);

    res.status(202).json({
      status: "accepted",
      eventIds: events.map(e => e.id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};