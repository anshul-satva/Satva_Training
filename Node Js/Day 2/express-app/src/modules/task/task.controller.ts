import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/types/api-response.types.js";
import { ok } from "../../shared/utils/api-response.js";
import {
  CreateTaskBody,
  Task,
  TaskParams,
  UpdateTaskStatusBody,
} from "./task.types.js";
import { taskService } from "./task.service.js";

export const getTasks = async (
  _req: Request,
  res: Response<ApiResponse<Task[]>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(ok("Tasks fetched successfully", tasks));
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  _req: Request<TaskParams>,
  res: Response<ApiResponse<Task>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await taskService.getTaskById(_req.params);
    res.status(200).json(ok("Task fetched successfully", task));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response<ApiResponse<Task>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(ok("Task created successfully", newTask));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request<TaskParams>,
  res: Response<ApiResponse<Task>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const deletedTask = await taskService.deleteTask(req.params);
    res.status(200).json(ok("Task deleted successfully", deletedTask));
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (
  req: Request<TaskParams, {}, UpdateTaskStatusBody>,
  res: Response<ApiResponse<Task>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const updatedTask = await taskService.completeTask(req.params, req.body);
    res.status(200).json(ok("Task status updated successfully", updatedTask));
  } catch (error) {
    next(error);
  }
};
