import { body, oneOf, param, query } from "express-validator";
import { Priority, ReactionType, TaskStatus } from "../../generated/prisma/client";

const taskStatuses = Object.values(TaskStatus);
const priorities = Object.values(Priority);
const reactionTypes = Object.values(ReactionType);

const optionalTrimmedString = (field: string) =>
  body(field)
    .optional()
    .isString()
    .withMessage(`${field} must be a string`)
    .bail()
    .trim();

export const taskIdParamValidators = [
  param("id").trim().notEmpty().withMessage("Task id is required"),
];

export const taskTagParamValidators = [
  ...taskIdParamValidators,
  param("tagId").trim().notEmpty().withMessage("Tag id is required"),
];

export const taskAttachmentParamValidators = [
  ...taskIdParamValidators,
  param("attachmentId").trim().notEmpty().withMessage("Attachment id is required"),
];

export const taskCommentParamValidators = [...taskIdParamValidators];

export const commentIdParamValidators = [
  param("commentId").trim().notEmpty().withMessage("Comment id is required"),
];

export const createTaskValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  optionalTrimmedString("description"),
  body("status")
    .optional()
    .isIn(taskStatuses)
    .withMessage(`Invalid status. Expected one of: ${taskStatuses.join(", ")}`),
  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage(`Invalid priority. Expected one of: ${priorities.join(", ")}`),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("dueDate must be a valid date string")
    .bail()
    .toDate(),
  body("categoryId")
    .optional()
    .isString()
    .withMessage("categoryId must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("categoryId must be a non-empty string"),
  body("tagIds")
    .optional()
    .isArray()
    .withMessage("tagIds must be an array of tag ids"),
  body("tagIds.*").optional().isString().withMessage("tagIds must contain only strings").trim(),
];

export const updateTaskValidators = [
  optionalTrimmedString("title")
    .if(body("title").exists())
    .notEmpty()
    .withMessage("Title must be a non-empty string"),
  optionalTrimmedString("description"),
  body("status")
    .optional()
    .isIn(taskStatuses)
    .withMessage(`Invalid status. Expected one of: ${taskStatuses.join(", ")}`),
  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage(`Invalid priority. Expected one of: ${priorities.join(", ")}`),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("dueDate must be a valid date string")
    .bail()
    .toDate(),
  body("categoryId")
    .optional({ values: "null" })
    .custom((value) => value === null || typeof value === "string")
    .withMessage("categoryId must be a string or null")
    .bail()
    .customSanitizer((value) => (typeof value === "string" ? value.trim() : value)),
  body("tagIds")
    .optional()
    .isArray()
    .withMessage("tagIds must be an array of tag ids"),
  body("tagIds.*").optional().isString().withMessage("tagIds must contain only strings").trim(),
  oneOf(
    [
      body("title").exists(),
      body("description").exists(),
      body("status").exists(),
      body("priority").exists(),
      body("dueDate").exists(),
      body("categoryId").exists(),
      body("tagIds").exists(),
    ],
    { message: "Provide at least one field to update" },
  ),
];

export const taskFilterValidators = [
  query("status")
    .optional()
    .isIn(taskStatuses)
    .withMessage(`Invalid status. Expected one of: ${taskStatuses.join(", ")}`),
  query("priority")
    .optional()
    .isIn(priorities)
    .withMessage(`Invalid priority. Expected one of: ${priorities.join(", ")}`),
  query("tagId").optional().isString().withMessage("tagId must be a string").trim(),
  query("categoryId")
    .optional()
    .isString()
    .withMessage("categoryId must be a string")
    .trim(),
];

export const assignTaskTagsValidators = [
  ...taskIdParamValidators,
  body("tagIds")
    .isArray({ min: 1 })
    .withMessage("tagIds must be an array of tag ids"),
  body("tagIds.*").isString().withMessage("tagIds must contain only strings").trim(),
];

export const createTaskCommentValidators = [
  ...taskCommentParamValidators,
  body("content").trim().notEmpty().withMessage("content is required"),
];

export const createCommentReactionValidators = [
  ...commentIdParamValidators,
  body("reactionType")
    .isIn(reactionTypes)
    .withMessage(`Invalid reactionType. Expected one of: ${reactionTypes.join(", ")}`),
];
