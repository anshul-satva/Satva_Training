import { AppError } from "../../middlewares/error.middleware.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util.js";
import { signAccessToken } from "../../utils/jwt.util.js";
import { authRepository } from "./auth.repository.js";

export const authService = {
  async register(payload: {
    email: string;
    name?: string;
    password: string;
    organizationName?: string;
  }) {
    const existingUser = await authRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }
    const passwordHash = await hashPassword(payload.password);

    const user = await authRepository.createUser({
      email: payload.email,
      name: payload.name,
      passwordHash,
      organizationName: payload.organizationName,
    });

    return user;
  },

  async login(payload: { email: string; password: string }) {
    const user = await authRepository.findUserByEmail(payload.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await comparePassword(
      payload.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      token: signAccessToken({ userId: user.id, email: user.email }),
      user,
    };
  },

  getMe(userId: string) {
    return authRepository.findUserById(userId);
  },
};
