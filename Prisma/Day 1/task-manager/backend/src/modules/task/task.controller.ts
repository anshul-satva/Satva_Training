import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
import { BadRequestError, ValidationError } from "../../shared/errors/HttpErrors";
import {
  validateCommentInput,
  validateCommentReactionInput,
  validateCreateTaskInput,
  validateTaskFilters,
  validateUpdateTaskInput,
} from "./task.validation";
import {
  addAttachmentToTask,
  addCommentToTask,
  assignTagsToTask,
  createTask,
  deleteAttachmentFromTask,
  deleteTask,
  getTaskById,
  getUserTasks,
  listTaskAttachments,
  listTaskComments,
  reactToComment,
  removeCommentReaction,
  removeTagFromTask,
  updateTask,
} from "./task.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateCreateTaskInput(req.body);
  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }

  const task = await createTask(req.userId!, parsed.data);
  sendSuccess(res, 201, "Task created successfully.", task);
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateTaskFilters(req.query);
  if (!parsed.success || !parsed.data) {
    throw new ValidationError(parsed.errors ?? {});
  }

  const tasks = await getUserTasks(req.userId!, parsed.data);
  sendSuccess(res, 200, "Tasks fetched successfully.", tasks);
});

export const getOne = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const task = await getTaskById(req.userId!, req.params.id);
    sendSuccess(res, 200, "Task fetched successfully.", task);
  },
);

export const update = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const parsed = validateUpdateTaskInput(req.body);
    if (!parsed.success || !parsed.data) {
      throw new ValidationError(parsed.errors ?? {});
    }

    const task = await updateTask(req.userId!, req.params.id, parsed.data);
    sendSuccess(res, 200, "Task updated successfully.", task);
  },
);

export const remove = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const result = await deleteTask(req.userId!, req.params.id);
    sendSuccess(res, 200, result.message);
  },
);

export const assignTags = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const tagIds = req.body?.tagIds;

    if (!Array.isArray(tagIds) || tagIds.some((tagId) => typeof tagId !== "string")) {
      throw new BadRequestError("tagIds must be an array of tag ids");
    }

    const task = await assignTagsToTask(req.userId!, req.params.id, tagIds);
    sendSuccess(res, 200, "Tags assigned successfully.", task);
  },
);

export const removeTag = asyncHandler(
  async (req: Request<{ id: string; tagId: string }>, res: Response) => {
    const result = await removeTagFromTask(req.userId!, req.params.id, req.params.tagId);
    sendSuccess(res, 200, result.message);
  },
);

export const addAttachment = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Please upload a file");
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const attachment = await addAttachmentToTask(req.userId!, req.params.id, {
      url: fileUrl,
      filename: req.file.originalname,
      fileSize: req.file.size,
    });

    sendSuccess(res, 201, "Attachment added successfully.", attachment);
  },
);

export const getAttachments = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const attachments = await listTaskAttachments(req.userId!, req.params.id);
    sendSuccess(res, 200, "Attachments fetched successfully.", attachments);
  },
);

export const removeAttachment = asyncHandler(
  async (req: Request<{ id: string; attachmentId: string }>, res: Response) => {
    const deletedAttachment = await deleteAttachmentFromTask(
      req.userId!,
      req.params.id,
      req.params.attachmentId,
    );

    const attachmentPath = new URL(deletedAttachment.url).pathname;
    const resolvedAttachmentPath = path.join(process.cwd(), attachmentPath.replace(/^\/+/, ""));

    if (resolvedAttachmentPath.startsWith(path.join(process.cwd(), "uploads"))) {
      await fs.unlink(resolvedAttachmentPath).catch(() => undefined);
    }

    sendSuccess(res, 200, "Attachment deleted successfully.");
  },
);

export const addComment = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const parsed = validateCommentInput(req.body);

    if (!parsed.success || !parsed.data) {
      throw new ValidationError(parsed.errors ?? {});
    }

    const comment = await addCommentToTask(req.userId!, req.params.id, parsed.data);
    sendSuccess(res, 201, "Comment added successfully.", comment);
  },
);

export const getComments = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const comments = await listTaskComments(req.userId!, req.params.id);
    sendSuccess(res, 200, "Comments fetched successfully.", comments);
  },
);

export const addReaction = asyncHandler(
  async (req: Request<{ commentId: string }>, res: Response) => {
    const parsed = validateCommentReactionInput(req.body);

    if (!parsed.success || !parsed.data) {
      throw new ValidationError(parsed.errors ?? {});
    }

    const reaction = await reactToComment(req.userId!, req.params.commentId, parsed.data);
    sendSuccess(res, 201, "Reaction added successfully.", reaction);
  },
);

export const removeReaction = asyncHandler(
  async (req: Request<{ commentId: string }>, res: Response) => {
    const result = await removeCommentReaction(req.userId!, req.params.commentId);
    sendSuccess(res, 200, result.message);
  },
);
