import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { commentService } from "./comment.service.js";

export const listComments = async (request: Request, response: Response) => {
  const comments = await commentService.listComments(request.params.taskId);

  return sendResponse(response, 200, "Comments fetched successfully", comments);
};

export const createComment = async (request: Request, response: Response) => {
  const comment = await commentService.createComment({
    task: request.currentTask as NonNullable<Request["currentTask"]>,
    userId: request.currentUser?.id as string,
    content: request.body.content,
  });

  return sendResponse(response, 201, "Comment added successfully", comment);
};
