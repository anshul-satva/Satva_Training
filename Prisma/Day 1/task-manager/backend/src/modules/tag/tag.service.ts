import prisma from "../../shared/config/database";
import { ConflictError } from "../../shared/errors/HttpErrors";
import { CreateTagInput } from "./tag.types";

export const createTag = async (data: CreateTagInput) => {
  const existing = await prisma.tag.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new ConflictError("Tag already exists");
  }

  return prisma.tag.create({
    data,
  });
};

export const getTags = async () => {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
};

export const getTasksByTag = async (tagId: string, userId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      tags: {
        some: {
          tagId,
        },
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((task) => ({
    ...task,
    tagNames: task.tags.map((taskTag) => taskTag.tag.name),
  }));
};
