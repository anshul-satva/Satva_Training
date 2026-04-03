"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const env_1 = require("./../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const registerUser = async (data) => {
    const existing = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        throw { status: 409, message: "Email already exists" };
    }
    const hasedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hasedPassword,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, Name: user.name, Email: user.email }, env_1.ENV.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw { status: 401, message: "Invalid Credentials" };
    }
    const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
    if (!isMatch) {
        throw { status: 401, message: "Invalid Credentials" };
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        name: user.name,
        email: user.email,
    }, env_1.ENV.JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
exports.loginUser = loginUser;
