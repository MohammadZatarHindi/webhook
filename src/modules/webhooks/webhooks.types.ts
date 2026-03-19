import { z } from "zod";
import { webhookSchema } from "./webhooks.schema";

// PROBLEM:
// You manually defined interface
// It can go out of sync with schema

// export interface WebhookEvent {
//   event: string;
//   data: Record<string, any>;
// }

// BETTER:
export type WebhookEvent = z.infer<typeof webhookSchema>;