import { z } from "zod";

export const commentParamsSchema = z.object({
  taskId: z.string().min(1),
});

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});
