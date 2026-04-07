import prisma from "../../shared/config/database";
import { ConflictError, UnauthorizedError } from "../../shared/errors/HttpErrors";
import { hashPassword, verifyPassword } from "../../shared/utils/password";
import { signAuthToken } from "../../shared/utils/token";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
  const token = signAuthToken({
    userId: user.id,
    name: user.name,
    email: user.email,
  });

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

  const isMatch = await verifyPassword(data.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = signAuthToken({
    userId: user.id,
    name: user.name,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
