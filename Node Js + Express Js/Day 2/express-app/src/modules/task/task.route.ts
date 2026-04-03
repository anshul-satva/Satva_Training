import { Router } from "express";
import {
  completeTask,
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
} from "./task.controller.js";

const taskRouter = Router();

taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.post("/", createTask);
taskRouter.patch("/:id/complete", completeTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
