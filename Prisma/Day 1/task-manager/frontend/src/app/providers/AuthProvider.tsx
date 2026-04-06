import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "../../features/auth/api/auth.api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SessionUser,
} from "../../features/auth/types/auth.types";
import { clearSession, getStoredSession, storeSession } from "../../shared/lib/session";

interface AuthContextValue {
  token: string | null;
  user: SessionUser | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const applySession = (response: AuthResponse) => {
  storeSession(response.data.token, response.data.user);

  return {
    token: response.data.token,
    user: response.data.user,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setToken(session.token);
      setUser(session.user);
    }
    setIsHydrated(true);
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    const session = applySession(response);
    setToken(session.token);
    setUser(session.user);
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);
    clearSession();
    setToken(null);
    setUser(null);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isHydrated,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [isHydrated, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
