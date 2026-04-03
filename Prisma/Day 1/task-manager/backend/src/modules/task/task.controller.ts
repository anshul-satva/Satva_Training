import { Request, Response, NextFunction } from "express";
import { createTaskSchema, updateTaskSchema } from "./task.schema";
import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const task = await createTask(req.userId!, parsed.data);
    res.status(201).json(task);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    next(err);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tasks = await getUserTasks(req.userId!, req.query as any);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await getTaskById(req.userId!, req.params.id);
    res.status(200).json(task);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    next(err);
  }
};

export const update = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const task = await updateTask(req.userId!, req.params.id, parsed.data);
    res.status(200).json(task);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    next(err);
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await deleteTask(req.userId!, req.params.id);
    res.status(200).json(result);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    next(err);
  }
};
