import { Priority, ReactionType, TaskStatus } from "@prisma/client";
import { ValidationResult } from "../../shared/types/api.types";
import {
  AddAttachmentInput,
  CreateCommentInput,
  CreateTaskInput,
  ReactToCommentInput,
  TaskFilters,
  UpdateTaskInput,
} from "./task.types";

const taskStatuses = Object.values(TaskStatus);
const priorities = Object.values(Priority);
const reactionTypes = Object.values(ReactionType);

const isValidDateString = (value: string): boolean => {
  return !Number.isNaN(Date.parse(value));
};

const isValidStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

export const validateCreateTaskInput = (
  body: unknown,
): ValidationResult<CreateTaskInput> => {
  const input = (body ?? {}) as Partial<Record<keyof CreateTaskInput, unknown>>;
  const errors: Record<string, string[]> = {};
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : undefined;

  if (!title) {
    errors.title = ["Title is required"];
  }

  if (input.status !== undefined && !taskStatuses.includes(input.status as TaskStatus)) {
    errors.status = [`Invalid status. Expected one of: ${taskStatuses.join(", ")}`];
  }

  if (input.priority !== undefined && !priorities.includes(input.priority as Priority)) {
    errors.priority = [`Invalid priority. Expected one of: ${priorities.join(", ")}`];
  }

  if (input.dueDate !== undefined) {
    if (typeof input.dueDate !== "string" || !isValidDateString(input.dueDate)) {
      errors.dueDate = ["dueDate must be a valid date string"];
    }
  }

  if (input.categoryId !== undefined && typeof input.categoryId !== "string") {
    errors.categoryId = ["categoryId must be a string"];
  }

  if (input.tagIds !== undefined && !isValidStringArray(input.tagIds)) {
    errors.tagIds = ["tagIds must be an array of tag ids"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      ...(description ? { description } : {}),
      ...(input.status ? { status: input.status as TaskStatus } : {}),
      ...(input.priority ? { priority: input.priority as Priority } : {}),
      ...(typeof input.dueDate === "string" ? { dueDate: new Date(input.dueDate) } : {}),
      ...(typeof input.categoryId === "string" && input.categoryId.trim()
        ? { categoryId: input.categoryId }
        : {}),
      ...(isValidStringArray(input.tagIds) ? { tagIds: input.tagIds } : {}),
    },
  };
};

export const validateUpdateTaskInput = (
  body: unknown,
): ValidationResult<UpdateTaskInput> => {
  const input = (body ?? {}) as Partial<Record<keyof UpdateTaskInput, unknown>>;
  const errors: Record<string, string[]> = {};
  const data: UpdateTaskInput = {};

  if (input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      errors.title = ["Title must be a non-empty string"];
    } else {
      data.title = input.title.trim();
    }
  }

  if (input.description !== undefined) {
    if (typeof input.description !== "string") {
      errors.description = ["Description must be a string"];
    } else {
      data.description = input.description.trim();
    }
  }

  if (input.status !== undefined) {
    if (!taskStatuses.includes(input.status as TaskStatus)) {
      errors.status = [`Invalid status. Expected one of: ${taskStatuses.join(", ")}`];
    } else {
      data.status = input.status as TaskStatus;
    }
  }

  if (input.priority !== undefined) {
    if (!priorities.includes(input.priority as Priority)) {
      errors.priority = [`Invalid priority. Expected one of: ${priorities.join(", ")}`];
    } else {
      data.priority = input.priority as Priority;
    }
  }

  if (input.dueDate !== undefined) {
    if (typeof input.dueDate !== "string" || !isValidDateString(input.dueDate)) {
      errors.dueDate = ["dueDate must be a valid date string"];
    } else {
      data.dueDate = new Date(input.dueDate);
    }
  }

  if (input.categoryId !== undefined) {
    if (input.categoryId !== null && typeof input.categoryId !== "string") {
      errors.categoryId = ["categoryId must be a string or null"];
    } else {
      data.categoryId = input.categoryId as string | null;
    }
  }

  if (input.tagIds !== undefined) {
    if (!isValidStringArray(input.tagIds)) {
      errors.tagIds = ["tagIds must be an array of tag ids"];
    } else {
      data.tagIds = input.tagIds;
    }
  }

  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.body = ["Provide at least one field to update"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
};

export const validateTaskFilters = (
  query: unknown,
): ValidationResult<TaskFilters> => {
  const input = (query ?? {}) as Record<string, unknown>;
  const errors: Record<string, string[]> = {};
  const filters: TaskFilters = {};

  if (input.status !== undefined) {
    if (typeof input.status !== "string" || !taskStatuses.includes(input.status as TaskStatus)) {
      errors.status = [`Invalid status. Expected one of: ${taskStatuses.join(", ")}`];
    } else {
      filters.status = input.status as TaskStatus;
    }
  }

  if (input.priority !== undefined) {
    if (typeof input.priority !== "string" || !priorities.includes(input.priority as Priority)) {
      errors.priority = [`Invalid priority. Expected one of: ${priorities.join(", ")}`];
    } else {
      filters.priority = input.priority as Priority;
    }
  }

  if (input.tagId !== undefined) {
    if (typeof input.tagId !== "string") {
      errors.tagId = ["tagId must be a string"];
    } else {
      filters.tagId = input.tagId;
    }
  }

  if (input.categoryId !== undefined) {
    if (typeof input.categoryId !== "string") {
      errors.categoryId = ["categoryId must be a string"];
    } else {
      filters.categoryId = input.categoryId;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: filters };
};

export const validateAttachmentInput = (
  body: unknown,
): ValidationResult<AddAttachmentInput> => {
  const input = (body ?? {}) as Partial<Record<keyof AddAttachmentInput, unknown>>;
  const errors: Record<string, string[]> = {};
  const url = typeof input.url === "string" ? input.url.trim() : "";
  const filename = typeof input.filename === "string" ? input.filename.trim() : "";
  const fileSize = typeof input.fileSize === "number" ? input.fileSize : undefined;

  if (!url) {
    errors.url = ["url is required"];
  }

  if (!filename) {
    errors.filename = ["filename is required"];
  }

  if (fileSize === undefined || Number.isNaN(fileSize) || fileSize < 0) {
    errors.fileSize = ["fileSize must be a positive number"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      url,
      filename,
      fileSize: fileSize as number,
    },
  };
};

export const validateCommentInput = (
  body: unknown,
): ValidationResult<CreateCommentInput> => {
  const input = (body ?? {}) as Partial<Record<keyof CreateCommentInput, unknown>>;
  const errors: Record<string, string[]> = {};
  const content = typeof input.content === "string" ? input.content.trim() : "";

  if (!content) {
    errors.content = ["content is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      content,
    },
  };
};

export const validateCommentReactionInput = (
  body: unknown,
): ValidationResult<ReactToCommentInput> => {
  const input = (body ?? {}) as Partial<Record<keyof ReactToCommentInput, unknown>>;
  const errors: Record<string, string[]> = {};

  if (
    input.reactionType === undefined ||
    !reactionTypes.includes(input.reactionType as ReactionType)
  ) {
    errors.reactionType = [`Invalid reactionType. Expected one of: ${reactionTypes.join(", ")}`];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      reactionType: input.reactionType as ReactionType,
    },
  };
};
