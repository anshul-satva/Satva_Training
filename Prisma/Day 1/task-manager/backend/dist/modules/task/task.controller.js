"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const task_schema_1 = require("./task.schema");
const task_service_1 = require("./task.service");
const create = async (req, res, next) => {
    try {
        const parsed = task_schema_1.createTaskSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
            return;
        }
        const task = await (0, task_service_1.createTask)(req.userId, parsed.data);
        res.status(201).json(task);
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        next(err);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const tasks = await (0, task_service_1.getUserTasks)(req.userId, req.query);
        res.status(200).json(tasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const task = await (0, task_service_1.getTaskById)(req.userId, req.params.id);
        res.status(200).json(task);
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        next(err);
    }
};
exports.getOne = getOne;
const update = async (req, res, next) => {
    try {
        const parsed = task_schema_1.updateTaskSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
            return;
        }
        const task = await (0, task_service_1.updateTask)(req.userId, req.params.id, parsed.data);
        res.status(200).json(task);
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const result = await (0, task_service_1.deleteTask)(req.userId, req.params.id);
        res.status(200).json(result);
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        next(err);
    }
};
exports.remove = remove;
