import { TaskStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { taskService } from "./task.service.js";

export const listTasks = async (request: Request, response: Response) => {
  const tasks = await taskService.listTasks(request.params.projectId);

  return sendResponse(response, 200, "Tasks fetched successfully", tasks);
};

export const getProjectBoard = async (request: Request, response: Response) => {
  const board = await taskService.getProjectBoard(request.params.projectId);

  return sendResponse(response, 200, "Project board fetched successfully", board);
};

export const createTask = async (request: Request, response: Response) => {
  const task = await taskService.createTask({
    project: request.currentProject,
    title: request.body.title,
    description: request.body.description,
    status: request.body.status as TaskStatus | undefined,
    assignedUserId: request.body.assignedUserId,
    tagIds: request.body.tagIds,
    currentUserId: request.currentUser?.id as string,
  });

  return sendResponse(response, 201, "Task created successfully", task);
};

export const getTask = async (request: Request, response: Response) => {
  const task = await taskService.getTask(request.params.taskId);

  return sendResponse(response, 200, "Task fetched successfully", task);
};

export const updateTask = async (request: Request, response: Response) => {
  const updatedTask = await taskService.updateTask({
    task: request.currentTask,
    title: request.body.title,
    description: request.body.description,
    status: request.body.status as TaskStatus | undefined,
    assignedUserId: request.body.assignedUserId,
    tagIds: request.body.tagIds,
    currentUserId: request.currentUser?.id as string,
  });

  return sendResponse(response, 200, "Task updated successfully", updatedTask);
};

export const archiveTask = async (request: Request, response: Response) => {
  const task = await taskService.archiveTask(request.params.taskId);

  return sendResponse(response, 200, "Task archived successfully", task);
};
