import { createContext } from 'react';
import type { AuthUser, OrganizationMembership } from '../types/entities';

export type AuthContextValue = {
  user: AuthUser | null;
  memberships: OrganizationMembership[];
  activeOrganizationId: string | null;
  activeMembership: OrganizationMembership | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name?: string;
    email: string;
    password: string;
    organizationName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  setActiveOrganizationId: (organizationId: string) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
