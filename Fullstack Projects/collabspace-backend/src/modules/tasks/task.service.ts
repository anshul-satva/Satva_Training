import { TaskStatus, type Task } from "@prisma/client";
import { ResponseStatus } from "../../constants/app.constant.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { canMoveTaskStatus } from "../../utils/status-workflow.util.js";
import { taskRepository } from "./task.repository.js";

const ensureAssigneeBelongsToOrganization = async (
  organizationId: string,
  assignedUserId?: string | null,
) => {
  if (!assignedUserId) {
    return null;
  }

  const membership = await taskRepository.findOrganizationMember(organizationId, assignedUserId);

  if (!membership) {
    throw new AppError("Assigned user must belong to the organization", 400);
  }

  return assignedUserId;
};

const ensureTagsBelongToOrganization = async (
  organizationId: string,
  tagIds?: string[],
) => {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }

  const tags = await taskRepository.findTagsForOrganization(organizationId, tagIds);

  if (tags.length !== tagIds.length) {
    throw new AppError("One or more tags do not belong to the organization", 400);
  }

  return tagIds;
};

export const taskService = {
  listTasks(projectId: string, includeArchived = false) {
    return taskRepository.findTasksByProject(projectId, includeArchived);
  },

  async getProjectBoard(projectId: string) {
    const tasks = await taskRepository.findTasksByProject(projectId);

    return {
      TODO: tasks.filter((task) => task.status === TaskStatus.TODO),
      IN_PROGRESS: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
      DONE: tasks.filter((task) => task.status === TaskStatus.DONE),
    };
  },

  async createTask(payload: {
    project: { id: string; organizationId: string } | undefined;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string | null;
    tagIds?: string[];
    currentUserId: string;
  }) {
    if (!payload.project) {
      throw new AppError("Project not found", 404, ResponseStatus.NotFound);
    }

    const assignedUserId = await ensureAssigneeBelongsToOrganization(
      payload.project.organizationId,
      payload.assignedUserId,
    );

    const tagIds = await ensureTagsBelongToOrganization(
      payload.project.organizationId,
      payload.tagIds,
    );

    return taskRepository.createTask({
      organizationId: payload.project.organizationId,
      projectId: payload.project.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      assignedUserId,
      createdById: payload.currentUserId,
      tagIds,
      changedById: payload.currentUserId,
    });
  },

  getTask(taskId: string) {
    return taskRepository.findTaskById(taskId);
  },

  async updateTask(payload: {
    task: Task | undefined;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string | null;
    tagIds?: string[];
    currentUserId: string;
  }) {
    if (!payload.task) {
      throw new AppError("Task not found", 404, ResponseStatus.NotFound);
    }

    const nextStatus = payload.status ?? payload.task.status;

    if (
      nextStatus !== payload.task.status &&
      !canMoveTaskStatus(payload.task.status, nextStatus)
    ) {
      throw new AppError("Task cannot move directly from the first stage to the final stage", 400);
    }

    const assignedUserId = await ensureAssigneeBelongsToOrganization(
      payload.task.organizationId,
      payload.assignedUserId,
    );

    const tagIds = await ensureTagsBelongToOrganization(
      payload.task.organizationId,
      payload.tagIds,
    );

    return taskRepository.updateTask({
      taskId: payload.task.id,
      organizationId: payload.task.organizationId,
      projectId: payload.task.projectId,
      previousStatus: payload.task.status,
      previousAssignedUserId: payload.task.assignedUserId,
      title: payload.title,
      description: payload.description,
      status: nextStatus,
      assignedUserId,
      shouldUpdateAssignedUser: payload.assignedUserId !== undefined,
      tagIds: payload.tagIds === undefined ? undefined : tagIds,
      changedById: payload.currentUserId,
    });
  },

  archiveTask(taskId: string) {
    return taskRepository.archiveTask(taskId);
  },
};
