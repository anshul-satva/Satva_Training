import { ENV } from "./../../config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { RegisterInput, LoginInput } from "./auth.schema";

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw { status: 409, message: "Email already exists" };
  }

  const hasedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hasedPassword,
    },
  });
  const token = jwt.sign(
    { userId: user.id, Name: user.name, Email: user.email },
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
    throw { status: 401, message: "Invalid Credentials" };
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid Credentials" };
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
