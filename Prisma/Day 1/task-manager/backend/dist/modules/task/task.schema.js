"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    priority: zod_1.z.nativeEnum(client_1.Priority).optional(),
    dueDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
