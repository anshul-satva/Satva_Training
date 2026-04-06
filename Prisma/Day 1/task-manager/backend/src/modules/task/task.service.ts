import prisma from "../../shared/config/database";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors/HttpErrors";
import {
  AddAttachmentInput,
  CreateCommentInput,
  CreateTaskInput,
  ReactToCommentInput,
  TaskFilters,
  UpdateTaskInput,
} from "./task.types";

const taskInclude = {
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
  attachments: true,
  comments: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  },
  _count: {
    select: {
      attachments: true,
      comments: true,
    },
  },
};

const getTaskOrThrow = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: taskInclude,
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
};

const ensureCategoryExists = async (categoryId?: string | null) => {
  if (!categoryId) {
    return;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }
};

const ensureTagsExist = async (tagIds?: string[]) => {
  if (!tagIds || tagIds.length === 0) {
    return;
  }

  const existingTags = await prisma.tag.findMany({
    where: { id: { in: tagIds } },
    select: { id: true },
  });

  if (existingTags.length !== new Set(tagIds).size) {
    throw new NotFoundError("One or more tags were not found");
  }
};

const mapCommentWithReactionCounts = <T extends { reactions: { reactionType: string }[] }>(
  comment: T,
) => {
  const reactionCounts = comment.reactions.reduce<Record<string, number>>(
    (acc, reaction) => {
      acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
      return acc;
    },
    {},
  );

  return {
    ...comment,
    reactionCounts,
  };
};

const mapTaskDetail = (task: Awaited<ReturnType<typeof getTaskOrThrow>>) => {
  return {
    ...task,
    tagNames: task.tags.map((taskTag) => taskTag.tag.name),
    attachmentCount: task._count.attachments,
    comments: task.comments.map(mapCommentWithReactionCounts),
  };
};

export const createTask = async (userId: string, data: CreateTaskInput) => {
  await ensureCategoryExists(data.categoryId);
  await ensureTagsExist(data.tagIds);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      ...(data.description ? { description: data.description } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.priority ? { priority: data.priority } : {}),
      ...(data.dueDate ? { dueDate: data.dueDate } : {}),
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      userId,
      ...(data.tagIds && data.tagIds.length > 0
        ? {
            tags: {
              create: data.tagIds.map((tagId) => ({
                tagId,
              })),
            },
          }
        : {}),
    },
    include: taskInclude,
  });

  return mapTaskDetail(task);
};

export const getUserTasks = async (userId: string, filters: TaskFilters) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.tagId
        ? {
            tags: {
              some: {
                tagId: filters.tagId,
              },
            },
          }
        : {}),
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          attachments: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((task) => ({
    ...task,
    tagNames: task.tags.map((taskTag) => taskTag.tag.name),
    attachmentCount: task._count.attachments,
    commentCount: task._count.comments,
  }));
};

export const getRecentTasks = async (userId: string, limit = 5) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await getTaskOrThrow(taskId, userId);
  return mapTaskDetail(task);
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) => {
  await getTaskOrThrow(taskId, userId);
  await ensureCategoryExists(data.categoryId === undefined ? undefined : data.categoryId);
  await ensureTagsExist(data.tagIds);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.tagIds !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: data.tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {}),
    },
    include: taskInclude,
  });

  return mapTaskDetail(task);
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskOrThrow(taskId, userId);
  await prisma.task.delete({ where: { id: taskId } });
  return { message: "Task deleted successfully" };
};

export const assignTagsToTask = async (userId: string, taskId: string, tagIds: string[]) => {
  if (tagIds.length === 0) {
    throw new BadRequestError("Provide at least one tag id");
  }

  await getTaskOrThrow(taskId, userId);
  await ensureTagsExist(tagIds);

  await prisma.taskTag.createMany({
    data: tagIds.map((tagId) => ({
      taskId,
      tagId,
    })),
    skipDuplicates: true,
  });

  return getTaskById(userId, taskId);
};

export const removeTagFromTask = async (userId: string, taskId: string, tagId: string) => {
  await getTaskOrThrow(taskId, userId);

  const existing = await prisma.taskTag.findUnique({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });

  if (!existing) {
    throw new NotFoundError("Tag assignment not found");
  }

  await prisma.taskTag.delete({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });

  return { message: "Tag removed from task successfully" };
};

export const addAttachmentToTask = async (
  userId: string,
  taskId: string,
  data: AddAttachmentInput,
) => {
  await getTaskOrThrow(taskId, userId);

  return prisma.attachment.create({
    data: {
      ...data,
      taskId,
      userId,
    },
  });
};

export const listTaskAttachments = async (userId: string, taskId: string) => {
  await getTaskOrThrow(taskId, userId);

  return prisma.attachment.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteAttachmentFromTask = async (
  userId: string,
  taskId: string,
  attachmentId: string,
) => {
  const task = await getTaskOrThrow(taskId, userId);

  const attachment = await prisma.attachment.findFirst({
    where: {
      id: attachmentId,
      taskId,
    },
  });

  if (!attachment) {
    throw new NotFoundError("Attachment not found");
  }

  if (attachment.userId !== userId && task.userId !== userId) {
    throw new UnauthorizedError("Only the uploader or task owner can delete this attachment");
  }

  await prisma.attachment.delete({
    where: { id: attachmentId },
  });

  return attachment;
};

export const addCommentToTask = async (
  userId: string,
  taskId: string,
  data: CreateCommentInput,
) => {
  await getTaskOrThrow(taskId, userId);

  return prisma.comment.create({
    data: {
      content: data.content,
      taskId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: true,
    },
  });
};

export const listTaskComments = async (userId: string, taskId: string) => {
  await getTaskOrThrow(taskId, userId);

  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments.map(mapCommentWithReactionCounts);
};

export const reactToComment = async (
  userId: string,
  commentId: string,
  data: ReactToCommentInput,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      task: true,
    },
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: comment.taskId,
      userId,
    },
  });

  if (!task) {
    throw new NotFoundError("Comment not found");
  }

  const existingReaction = await prisma.commentReaction.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  if (existingReaction) {
    throw new ConflictError("You have already reacted to this comment");
  }

  return prisma.commentReaction.create({
    data: {
      commentId,
      userId,
      reactionType: data.reactionType,
    },
  });
};

export const removeCommentReaction = async (userId: string, commentId: string) => {
  const reaction = await prisma.commentReaction.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  if (!reaction) {
    throw new NotFoundError("Reaction not found");
  }

  await prisma.commentReaction.delete({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  return { message: "Reaction removed successfully" };
};

export const getUserActivitySummary = async (userId: string) => {
  const [taskCount, commentCount, attachmentCount, reactionCount, overdueCount] =
    await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
      prisma.attachment.count({ where: { userId } }),
      prisma.commentReaction.count({ where: { userId } }),
      prisma.task.count({
        where: {
          userId,
          dueDate: { lt: new Date() },
          status: { not: "DONE" },
        },
      }),
    ]);

  return {
    taskCount,
    commentCount,
    attachmentCount,
    reactionCount,
    overdueCount,
  };
};
