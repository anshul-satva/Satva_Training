import { prisma } from "../../config/prisma.js";

export const projectRepository = {
  findProjectsByOrganization(organizationId: string) {
    return prisma.project.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  createProject(data: {
    organizationId: string;
    name?: string;
    description?: string;
  }) {
    return prisma.project.create({
      data: {
        organizationId: data.organizationId,
        name: data.name ?? "Untitled Project",
        description: data.description,
      },
    });
  },

  updateProject(projectId: string, data: { name?: string; description?: string }) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  },

  archiveProjectAndTasks(projectId: string) {
    const now = new Date();

    return prisma.$transaction(async (transaction) => {
      const project = await transaction.project.update({
        where: { id: projectId },
        data: { deletedAt: now },
      });

      await transaction.task.updateMany({
        where: {
          projectId,
          archivedAt: null,
        },
        data: {
          archivedAt: now,
        },
      });

      return project;
    });
  },
};
