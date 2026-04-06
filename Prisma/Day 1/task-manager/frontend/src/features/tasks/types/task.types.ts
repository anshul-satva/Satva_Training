export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type ReactionType = "LIKE" | "HELPFUL" | "QUESTION";

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  fileSize: number;
  taskId: string;
  userId: string;
  createdAt: string;
}

export interface CommentReaction {
  id: string;
  reactionType: ReactionType;
  commentId: string;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  reactions: CommentReaction[];
  reactionCounts?: Record<string, number>;
}

export interface TaskSummary {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  categoryId?: string | null;
  category?: Category | null;
  tagNames?: string[];
  attachmentCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetail extends TaskSummary {
  tags: Array<{
    tagId: string;
    tag: Tag;
  }>;
  attachments: Attachment[];
  comments: Comment[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  categoryId?: string | null;
  tagIds?: string[];
}

export interface TaskFilters {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  categoryId?: string | "";
  tagId?: string | "";
}
