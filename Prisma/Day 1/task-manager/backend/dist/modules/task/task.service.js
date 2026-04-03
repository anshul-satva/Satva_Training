"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getUserTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const createTask = async (userId, data) => {
    return prisma_1.default.task.create({
        data: { ...data, userId },
    });
};
exports.createTask = createTask;
const getUserTasks = async (userId, filters) => {
    return prisma_1.default.task.findMany({
        where: {
            userId,
            ...(filters.status ? { status: filters.status } : {}),
            ...(filters.priority ? { priority: filters.priority } : {}),
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getUserTasks = getUserTasks;
const getTaskById = async (userId, taskId) => {
    const task = await prisma_1.default.task.findFirst({ where: { id: taskId, userId } });
    if (!task) {
        throw { status: 404, message: "Task not found" };
    }
    return task;
};
exports.getTaskById = getTaskById;
const updateTask = async (userId, taskId, data) => {
    const existing = await prisma_1.default.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!existing)
        throw { status: 404, message: "Task not found" };
    return prisma_1.default.task.update({
        where: { id: taskId },
        data,
    });
};
exports.updateTask = updateTask;
const deleteTask = async (userId, taskId) => {
    const existing = await prisma_1.default.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!existing) {
        throw { status: 404, message: "Task not found" };
    }
    await prisma_1.default.task.delete({ where: { id: taskId, userId } });
    return { message: "Task deleted successfully" };
};
exports.deleteTask = deleteTask;
