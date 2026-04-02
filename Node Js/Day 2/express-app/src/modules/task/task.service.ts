import { createAppError } from "../../shared/utils/api-response.js";
import {
  CreateTaskBody,
  TaskParams,
  Task,
  UpdateTaskStatusBody,
} from "./task.types.js";
import { taskRepository } from "./task.repository.js";

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    return taskRepository.findAll();
  },

  async getTaskById(payload: TaskParams): Promise<Task> {
    const id = Number(payload.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw createAppError(400, "Task id must be a positive integer");
    }
    const taskById = await taskRepository.findById(id);
    if (!taskById) {
      throw createAppError(404, "Task not found");
    }
    return taskById;
  },

  async createTask(payload: CreateTaskBody): Promise<Task> {
    const title = payload?.title?.trim();
    if (!title) {
      throw createAppError(400, "Title is required");
    }

    return taskRepository.create(title);
  },

  async deleteTask(payload: TaskParams): Promise<Task> {
    const id = Number(payload.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw createAppError(400, "Task id must be a positive integer");
    }

    const deletedTask = await taskRepository.delete(id);
    if (!deletedTask) {
      throw createAppError(404, "Task not found");
    }

    return deletedTask;
  },

  async completeTask(
    payload: TaskParams,
    body: UpdateTaskStatusBody,
  ): Promise<Task> {
    const id = Number(payload.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw createAppError(400, "Task id must be a positive integer");
    }

    const completed = body.completed ?? true;
    if (typeof completed !== "boolean") {
      throw createAppError(400, "completed must be a boolean");
    }

    const updatedTask = await taskRepository.updateStatus(id, completed);
    if (!updatedTask) {
      throw createAppError(404, "Task not found");
    }

    return updatedTask;
  },
};
