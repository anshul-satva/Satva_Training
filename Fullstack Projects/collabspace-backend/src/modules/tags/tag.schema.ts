import { z } from "zod";

export const organizationTagParamsSchema = z.object({
  organizationId: z.string().min(1),
});

export const tagParamsSchema = z.object({
  tagId: z.string().min(1),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  color: z.string().trim().max(20).optional(),
});

export const updateTagSchema = createTagSchema;
