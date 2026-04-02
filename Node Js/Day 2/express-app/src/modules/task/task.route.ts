import { Router } from "express";
import {
  completeTask,
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
} from "./task.controller.js";

const taskRouter = Router();

taskRouter.get("/get", getTasks);
taskRouter.get("/get/:id", getTaskById);
taskRouter.post("/create", createTask);
taskRouter.patch("/:id/complete", completeTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
