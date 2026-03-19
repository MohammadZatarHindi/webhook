import { z } from "zod";

export const createSubscriberSchema = z.object({
  pipeline_id: z.number(),
  url: z.string().url("Invalid URL"),
});

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;