import { Priority, ReactionType, TaskStatus } from "../../generated/prisma/client";

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  categoryId?: string | null;
  tagIds?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  tagId?: string;
  categoryId?: string;
}

export interface AddAttachmentInput {
  url: string;
  filename: string;
  fileSize: number;
}

export interface CreateCommentInput {
  content: string;
}

export interface ReactToCommentInput {
  reactionType: ReactionType;
}
