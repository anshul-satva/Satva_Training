"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_schema_1 = require("./auth.schema");
const auth_service_1 = require("./auth.service");
const register = async (req, res, next) => {
    try {
        const parsed = auth_schema_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten().fieldErrors });
            return;
        }
        const result = await (0, auth_service_1.registerUser)(parsed.data);
        res.status(201).json({ message: "Registered successfully.", ...result });
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const parsed = auth_schema_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
            return;
        }
        const result = await (0, auth_service_1.loginUser)(parsed.data);
        res.status(200).json({ message: "Login successful.", ...result });
    }
    catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
            return;
        }
        next(error);
    }
};
exports.login = login;
