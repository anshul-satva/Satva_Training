import { z } from "zod";

export const activityParamsSchema = z.object({
  taskId: z.string().min(1),
});
