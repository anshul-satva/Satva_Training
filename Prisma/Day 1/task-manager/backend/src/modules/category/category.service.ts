import prisma from "../../shared/config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/HttpErrors";
import { CreateCategoryInput } from "./category.types";

export const createCategory = async (data: CreateCategoryInput) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new ConflictError("Category already exists");
  }

  return prisma.category.create({
    data,
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

export const getCategoryTasks = async (categoryId: string, userId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const tasks = await prisma.task.findMany({
    where: {
      categoryId,
      userId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((task) => ({
    ...task,
    tagNames: task.tags.map((taskTag) => taskTag.tag.name),
  }));
};
