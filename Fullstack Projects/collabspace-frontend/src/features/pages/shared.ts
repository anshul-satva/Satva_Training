import type { OrganizationRole, TaskStatus } from '../../types/api';
import type { OrganizationMembership, TagEntity } from '../../types/entities';
import { useAuth } from '../../hooks/use-auth';

export const accentColors = [
  '#00685f',
  '#0c8d80',
  '#3755c3',
  '#5f7df0',
  '#825100',
  '#47514f',
  '#6ad5cb',
  '#aab6ff',
  '#ffb859',
  '#c61d1d',
] as const;

export const roleOptions: OrganizationRole[] = ['ADMIN', 'MANAGER', 'MEMBER'];
export const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const toLabel = (value: string) => value.replace(/_/g, ' ');
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const canManageMembers = (role?: OrganizationRole | null) => role === 'ADMIN';
export const canManageProjects = (role?: OrganizationRole | null) => role === 'ADMIN' || role === 'MANAGER';
export const canManageTags = (role?: OrganizationRole | null) => role === 'ADMIN' || role === 'MANAGER';
export const canEditOrganization = (role?: OrganizationRole | null) => role === 'ADMIN';
export const canCreateOrganizations = (role?: OrganizationRole | null) => role === 'ADMIN';

export function useSelectedOrganization() {
  const { activeOrganizationId, activeMembership } = useAuth();
  return { activeOrganizationId, activeMembership };
}

export function getMemberOptions(members: OrganizationMembership[]) {
  return members
    .filter((member) => member.userId)
    .map((member) => ({
      label: `${member.user?.name ?? member.user?.email ?? 'Member'} (${member.role ?? 'MEMBER'})`,
      value: member.userId as string,
    }));
}

export function getTagOptions(tags: TagEntity[]) {
  return tags
    .filter((tag) => tag.id)
    .map((tag) => ({
      label: tag.name ?? 'Tag',
      value: tag.id,
    }));
}
