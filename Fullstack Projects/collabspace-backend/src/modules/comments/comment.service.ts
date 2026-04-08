import type { Request } from "express";
import { commentRepository } from "./comment.repository.js";

export const commentService = {
  listComments(taskId: string) {
    return commentRepository.findCommentsByTask(taskId);
  },

  async createComment(payload: {
    task: NonNullable<Request["currentTask"]>;
    userId: string;
    content: string;
  }) {
    const comment = await commentRepository.createComment({
      organizationId: payload.task.organizationId,
      taskId: payload.task.id,
      userId: payload.userId,
      content: payload.content,
    });

    await commentRepository.createCommentActivity({
      organizationId: payload.task.organizationId,
      projectId: payload.task.projectId,
      taskId: payload.task.id,
      userId: payload.userId,
    });

    return comment;
  },
};
