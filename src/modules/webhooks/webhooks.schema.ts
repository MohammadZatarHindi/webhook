import { z } from "zod";

/**
 * Zod schema to validate incoming webhook requests
 * Ensures that the payload has:
 * - 'event' as a string
 * - 'data' as a record of any type
 */
export const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
});