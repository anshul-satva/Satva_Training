import { prisma } from "../../config/prisma.js";

export const commentRepository = {
  findCommentsByTask(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  createComment(data: {
    organizationId: string;
    taskId: string;
    userId: string;
    content: string;
  }) {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  createCommentActivity(data: {
    organizationId: string;
    projectId: string;
    taskId: string;
    userId: string;
  }) {
    return prisma.activityLog.create({
      data: {
        ...data,
        action: "TASK_COMMENT_ADDED",
      },
    });
  },
};
