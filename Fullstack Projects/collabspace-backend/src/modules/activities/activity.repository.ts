import { prisma } from "../../config/prisma.js";

export const activityRepository = {
  findActivitiesByTask(taskId: string) {
    return prisma.activityLog.findMany({
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
      orderBy: { createdAt: "desc" },
    });
  },

  findAssignmentHistoryByTask(taskId: string) {
    return prisma.assignmentHistory.findMany({
      where: { taskId },
      include: {
        previousAssignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        newAssignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { changedAt: "desc" },
    });
  },
};
