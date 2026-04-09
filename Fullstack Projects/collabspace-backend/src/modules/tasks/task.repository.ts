import { TaskStatus, type Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const taskRepository = {
  findOrganizationMember(organizationId: string, userId: string) {
    return prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  },

  findTagsForOrganization(organizationId: string, tagIds: string[]) {
    return prisma.tag.findMany({
      where: {
        organizationId,
        id: {
          in: tagIds,
        },
      },
    });
  },

  findTasksByProject(projectId: string, includeArchived = false) {
    return prisma.task.findMany({
      where: {
        projectId,
        archivedAt: includeArchived ? undefined : null,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findTaskById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },

  createTask(data: {
    organizationId: string;
    projectId: string;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string | null;
    createdById?: string;
    tagIds: string[];
    changedById: string;
  }) {
    return prisma.$transaction(async (transaction) => {
      const createdTask = await transaction.task.create({
        data: {
          organizationId: data.organizationId,
          projectId: data.projectId,
          title: data.title ?? "Untitled Task",
          description: data.description,
          status: data.status ?? TaskStatus.TODO,
          assignedUserId: data.assignedUserId,
          createdById: data.createdById,
          taskTags: data.tagIds.length
            ? {
                create: data.tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        },
        include: {
          taskTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (data.assignedUserId) {
        await transaction.assignmentHistory.create({
          data: {
            organizationId: data.organizationId,
            projectId: data.projectId,
            taskId: createdTask.id,
            previousAssignedUserId: null,
            newAssignedUserId: data.assignedUserId,
            changedById: data.changedById,
          },
        });
      }

      return createdTask;
    });
  },

  updateTask(data: {
    taskId: string;
    organizationId: string;
    projectId: string;
    previousStatus: TaskStatus;
    previousAssignedUserId?: string | null;
    title?: string;
    description?: string;
    status: TaskStatus;
    assignedUserId?: string | null;
    shouldUpdateAssignedUser: boolean;
    tagIds?: string[];
    changedById: string;
  }) {
    return prisma.$transaction(async (transaction) => {
      if (Array.isArray(data.tagIds)) {
        await transaction.taskTag.deleteMany({
          where: {
            taskId: data.taskId,
          },
        });
      }

      const updateData: Prisma.TaskUpdateInput = {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        status: data.status,
        taskTags: Array.isArray(data.tagIds)
          ? {
              create: data.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      };

      if (data.shouldUpdateAssignedUser) {
        updateData.assignedUser = data.assignedUserId
          ? { connect: { id: data.assignedUserId } }
          : { disconnect: true };
      }

      const updatedTask = await transaction.task.update({
        where: { id: data.taskId },
        data: updateData,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          taskTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (data.status !== data.previousStatus) {
        await transaction.activityLog.create({
          data: {
            organizationId: data.organizationId,
            projectId: data.projectId,
            taskId: data.taskId,
            userId: data.changedById,
            action: "TASK_STATUS_CHANGED",
            previousStatus: data.previousStatus,
            newStatus: data.status,
          },
        });
      }

      if (data.shouldUpdateAssignedUser && data.previousAssignedUserId !== data.assignedUserId) {
        await transaction.assignmentHistory.create({
          data: {
            organizationId: data.organizationId,
            projectId: data.projectId,
            taskId: data.taskId,
            previousAssignedUserId: data.previousAssignedUserId,
            newAssignedUserId: data.assignedUserId,
            changedById: data.changedById,
          },
        });
      }

      return updatedTask;
    });
  },

  archiveTask(taskId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        archivedAt: new Date(),
      },
    });
  },
};
