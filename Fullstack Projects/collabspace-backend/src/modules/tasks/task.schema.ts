import { TaskStatus } from "@prisma/client";
import { z } from "zod";

export const projectTaskParamsSchema = z.object({
  projectId: z.string().min(1),
});

export const taskParamsSchema = z.object({
  taskId: z.string().min(1),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  assignedUserId: z.string().min(1).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  tagIds: z.array(z.string().min(1)).optional(),
});

export const updateTaskSchema = createTaskSchema;
