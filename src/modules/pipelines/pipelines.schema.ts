import { z } from "zod";

export const actionTypeEnum = z.enum(['log', 'uppercase', 'reverse']);

export const createPipelineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  action: actionTypeEnum,
});

export type CreatePipelineInput = z.infer<typeof createPipelineSchema>;