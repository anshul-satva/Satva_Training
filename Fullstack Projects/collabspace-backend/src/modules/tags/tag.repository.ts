import { prisma } from "../../config/prisma.js";

export const tagRepository = {
  findTagsByOrganization(organizationId: string) {
    return prisma.tag.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  },

  createTag(data: {
    organizationId: string;
    name?: string;
    color?: string;
  }) {
    return prisma.tag.create({
      data: {
        organizationId: data.organizationId,
        name: data.name ?? "General",
        color: data.color,
      },
    });
  },

  updateTag(tagId: string, data: { name?: string; color?: string }) {
    return prisma.tag.update({
      where: { id: tagId },
      data,
    });
  },

  deleteTag(tagId: string) {
    return prisma.tag.delete({
      where: { id: tagId },
    });
  },
};
