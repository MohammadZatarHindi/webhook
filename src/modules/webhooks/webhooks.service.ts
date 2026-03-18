import { WebhookEvent } from "./webhooks.types";
import * as pipelineService from "../pipelines/pipelines.service";

/**
 * Processes a webhook event by triggering pipelines that match the event type
 * @param event - WebhookEvent object received from external system
 * @returns Object with names of triggered pipelines
 */
export const processWebhook = async (event: WebhookEvent) => {
  // Fetch all pipelines from the database
  const pipelines = await pipelineService.getPipelines();

  // Filter pipelines whose action_type matches the webhook event
  const triggered = pipelines.filter(p => p.action_type === event.event);

  for (const p of triggered) {
    // For now, just log the pipeline name and payload
    // Later, implement actual actions like log/uppercase/reverse
    console.log(`Triggered pipeline: ${p.name}`, event.data);
  }

  // Return a summary of triggered pipelines
  return { triggeredPipelines: triggered.map(p => p.name) };
};