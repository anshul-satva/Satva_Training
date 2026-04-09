import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { storage } from "../lib/storage";
import { authService } from "../services/auth";
import type { AuthUser, OrganizationMembership } from "../types/entities";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const hasBootstrappedRef = useRef(false);
  const [activeOrganizationId, setActiveOrganizationIdState] = useState<
    string | null
  >(storage.getActiveOrganizationId());

  const syncActiveOrganization = (
    membershipsToUse: OrganizationMembership[],
  ) => {
    const stored = storage.getActiveOrganizationId();
    const fallback = membershipsToUse[0]?.organizationId ?? null;
    const next = membershipsToUse.some((item) => item.organizationId === stored)
      ? stored
      : fallback;

    if (next) {
      storage.setActiveOrganizationId(next);
    } else {
      storage.clearActiveOrganizationId();
    }

    setActiveOrganizationIdState(next);
  };

  const refreshMe = useCallback(async () => {
    const currentUser = await authService.me();
    setUser(currentUser);
    syncActiveOrganization(currentUser.organizationMembers ?? []);
  }, []);

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;

    const bootstrap = async () => {
      const token = storage.getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshMe();
      } catch {
        storage.clearToken();
        storage.clearActiveOrganizationId();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [refreshMe]);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const result = await authService.login(payload);
      storage.setToken(result.token);
      setUser(result.user);
      syncActiveOrganization(result.user.organizationMembers ?? []);
    },
    [],
  );

  const register = async (payload: {
    name?: string;
    email: string;
    password: string;
    organizationName: string;
  }) => {
    await authService.register(payload);
  };

  const logout = () => {
    storage.clearToken();
    storage.clearActiveOrganizationId();
    setUser(null);
    setActiveOrganizationIdState(null);
  };

  const setActiveOrganizationId = (organizationId: string) => {
    storage.setActiveOrganizationId(organizationId);
    setActiveOrganizationIdState(organizationId);
  };

  const value = useMemo<AuthContextValue>(() => {
    const currentMemberships = user?.organizationMembers ?? [];
    return {
      user,
      memberships: currentMemberships,
      activeOrganizationId,
      activeMembership:
        currentMemberships.find(
          (item) => item.organizationId === activeOrganizationId,
        ) ?? null,
      loading,
      login,
      register,
      logout,
      refreshMe,
      setActiveOrganizationId,
    };
  }, [activeOrganizationId, loading, login, refreshMe, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
