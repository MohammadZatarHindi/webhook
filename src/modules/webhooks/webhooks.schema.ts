import { z } from "zod";

export const webhookSchema = z.object({
  event: z.enum(['log', 'uppercase', 'reverse']),  // only these three allowed
  data: z.record(z.string(), z.any()),              // object with string keys
});

export type WebhookEvent = z.infer<typeof webhookSchema>;