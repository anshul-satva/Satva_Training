import { z } from "zod";

export const organizationProjectParamsSchema = z.object({
  organizationId: z.string().min(1),
});

export const projectParamsSchema = z.object({
  projectId: z.string().min(1),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).optional(),
});

export const updateProjectSchema = createProjectSchema;
