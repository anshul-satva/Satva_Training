import type { OrganizationRole, TaskStatus } from "./api";

export type User = {
  id: string;
  name?: string | null;
  email?: string;
};

export type Organization = {
  id: string;
  name?: string;
  description?: string | null;
};

export type OrganizationMembership = {
  id: string;
  organizationId?: string;
  userId?: string;
  role?: OrganizationRole;
  createdAt?: string;
  updatedAt?: string;
  organization?: Organization;
  user?: User;
};

export type Project = {
  id: string;
  organizationId?: string;
  name?: string;
  description?: string | null;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TagEntity = {
  id: string;
  organizationId?: string;
  name?: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskTag = {
  tag?: TagEntity;
};

export type CommentEntity = {
  id: string;
  organizationId?: string;
  taskId?: string;
  userId?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
};

export type TaskEntity = {
  id: string;
  organizationId?: string;
  projectId?: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  assignedUserId?: string | null;
  createdById?: string | null;
  archivedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User | null;
  assignedUser?: User | null;
  comments?: CommentEntity[];
  taskTags?: TaskTag[];
};

export type ActivityEntity = {
  id: string;
  organizationId?: string;
  projectId?: string;
  taskId?: string;
  userId?: string;
  action?: string;
  previousStatus?: TaskStatus | null;
  newStatus?: TaskStatus | null;
  createdAt?: string;
  user?: User;
};

export type AssignmentHistoryEntity = {
  id: string;
  organizationId?: string;
  projectId?: string;
  taskId?: string;
  previousAssignedUserId?: string | null;
  newAssignedUserId?: string | null;
  changedById?: string;
  changedAt?: string;
  previousAssignedUser?: User | null;
  newAssignedUser?: User | null;
  changedBy?: User;
};

export type OrganizationDetail = Organization & {
  members?: OrganizationMembership[];
  projects?: Project[];
  tags?: TagEntity[];
};

export type AuthUser = User & {
  organizationMembers?: OrganizationMembership[];
};

export type BoardResponse = Record<TaskStatus, TaskEntity[]>;
