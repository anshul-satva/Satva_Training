import prisma from "../../lib/prisma";
import { TaskStatus, Priority, User } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput } from "./task.schema";
import { fi, ta } from "zod/locales";
import { start } from "node:repl";
import { userInfo } from "node:os";
import { DetailedPeerCertificate } from "node:tls";
import { measureMemory } from "node:vm";

export const createTask = async (userId: string, data: CreateTaskInput) => {
  return prisma.task.create({
    data: { ...data, userId },
  });
};
export const getUserTasks = async (
  userId: string,
  filters: { status?: string; priority?: string },
) => {
  return prisma.task.findMany({
    where: {
      userId,
      ...(filters.status ? { status: filters.status as TaskStatus } : {}),
      ...(filters.priority ? { priority: filters.priority as Priority } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) {
    throw { status: 404, message: "Task not found" };
  }
  return task;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) => {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
  if (!existing) throw { status: 404, message: "Task not found" };

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
  if (!existing) {
    throw { status: 404, message: "Task not found" };
  }
  await prisma.task.delete({ where: { id: taskId, userId } });
  return { message: "Task deleted successfully" };
};
