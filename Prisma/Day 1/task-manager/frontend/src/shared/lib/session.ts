import type { SessionUser } from "../../features/auth/types/auth.types";

const TOKEN_KEY = "task-manager-token";
const USER_KEY = "task-manager-user";

export const storeSession = (token: string, user: SessionUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (!token || !user) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(user) as SessionUser,
    };
  } catch {
    clearSession();
    return null;
  }
};
