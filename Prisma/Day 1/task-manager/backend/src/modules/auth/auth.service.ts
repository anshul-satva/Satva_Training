import { ENV } from "../../shared/config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../shared/config/database";
import { ConflictError, UnauthorizedError } from "../../shared/errors/HttpErrors";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    ENV.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
