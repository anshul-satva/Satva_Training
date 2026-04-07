import fs from "fs/promises";
import { Router } from "express";
import { matchedData } from "express-validator";
import { BadRequestError } from "../../shared/errors/HttpErrors";
import protect from "../../shared/middlewares/auth.middleware";
import { uploadAttachment } from "../../shared/middlewares/upload.middleware";
import { validateRequest } from "../../shared/middlewares/validateRequest.middleware";
import {
  buildAttachmentUrl,
  resolveUploadPathFromUrl,
  uploadsDirectory,
} from "../../shared/utils/file";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/response";
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
import {
  assignTaskTagsValidators,
  commentIdParamValidators,
  createCommentReactionValidators,
  createTaskCommentValidators,
  createTaskValidators,
  taskAttachmentParamValidators,
  taskCommentParamValidators,
  taskFilterValidators,
  taskIdParamValidators,
  taskTagParamValidators,
  updateTaskValidators,
} from "./task.validation";
import {
  CreateCommentInput,
  CreateTaskInput,
  ReactToCommentInput,
  TaskFilters,
  UpdateTaskInput,
} from "./task.types";

const router = Router();

router.use(protect);

router.post(
  "/",
  createTaskValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as CreateTaskInput;

    const task = await createTask(req.userId!, data);
    sendSuccess(res, 201, "Task created successfully.", task);
  }),
);

router.get(
  "/",
  taskFilterValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const filters = matchedData(req, {
      locations: ["query"],
      includeOptionals: true,
    }) as TaskFilters;

    const tasks = await getUserTasks(req.userId!, filters);
    sendSuccess(res, 200, "Tasks fetched successfully.", tasks);
  }),
);

router.get(
  "/:id",
  taskIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const task = await getTaskById(req.userId!, id);
    sendSuccess(res, 200, "Task fetched successfully.", task);
  }),
);

router.put(
  "/:id",
  taskIdParamValidators,
  updateTaskValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as UpdateTaskInput;

    const task = await updateTask(req.userId!, id, data);
    sendSuccess(res, 200, "Task updated successfully.", task);
  }),
);

router.delete(
  "/:id",
  taskIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const result = await deleteTask(req.userId!, id);
    sendSuccess(res, 200, result.message);
  }),
);

router.post(
  "/:id/tags",
  assignTaskTagsValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };
    const { tagIds } = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as { tagIds: string[] };

    const task = await assignTagsToTask(req.userId!, id, tagIds);
    sendSuccess(res, 200, "Tags assigned successfully.", task);
  }),
);

router.delete(
  "/:id/tags/:tagId",
  taskTagParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id, tagId } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string; tagId: string };

    const result = await removeTagFromTask(req.userId!, id, tagId);
    sendSuccess(res, 200, result.message);
  }),
);

router.post(
  "/:id/attachments",
  taskIdParamValidators,
  validateRequest,
  uploadAttachment.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("Please upload a file");
    }

    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };
    const fileUrl = buildAttachmentUrl(req.protocol, req.get("host") ?? "", req.file.filename);
    const attachment = await addAttachmentToTask(req.userId!, id, {
      url: fileUrl,
      filename: req.file.originalname,
      fileSize: req.file.size,
    });

    sendSuccess(res, 201, "Attachment added successfully.", attachment);
  }),
);

router.get(
  "/:id/attachments",
  taskIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const attachments = await listTaskAttachments(req.userId!, id);
    sendSuccess(res, 200, "Attachments fetched successfully.", attachments);
  }),
);

router.delete(
  "/:id/attachments/:attachmentId",
  taskAttachmentParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id, attachmentId } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string; attachmentId: string };

    const deletedAttachment = await deleteAttachmentFromTask(req.userId!, id, attachmentId);
    const resolvedAttachmentPath = resolveUploadPathFromUrl(deletedAttachment.url);

    if (resolvedAttachmentPath.startsWith(uploadsDirectory)) {
      await fs.unlink(resolvedAttachmentPath).catch(() => undefined);
    }

    sendSuccess(res, 200, "Attachment deleted successfully.");
  }),
);

router.post(
  "/:id/comments",
  createTaskCommentValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as CreateCommentInput;

    const comment = await addCommentToTask(req.userId!, id, data);
    sendSuccess(res, 201, "Comment added successfully.", comment);
  }),
);

router.get(
  "/:id/comments",
  taskCommentParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { id: string };

    const comments = await listTaskComments(req.userId!, id);
    sendSuccess(res, 200, "Comments fetched successfully.", comments);
  }),
);

router.post(
  "/comments/:commentId/reactions",
  createCommentReactionValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { commentId } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { commentId: string };
    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    }) as ReactToCommentInput;

    const reaction = await reactToComment(req.userId!, commentId, data);
    sendSuccess(res, 201, "Reaction added successfully.", reaction);
  }),
);

router.delete(
  "/comments/:commentId/reactions",
  commentIdParamValidators,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { commentId } = matchedData(req, {
      locations: ["params"],
      includeOptionals: true,
    }) as { commentId: string };

    const result = await removeCommentReaction(req.userId!, commentId);
    sendSuccess(res, 200, result.message);
  }),
);

export default router;
