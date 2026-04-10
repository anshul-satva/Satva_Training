import { OrganizationRole } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const organizationRepository = {
  findOrganizationsByUser(userId: string) {
    return prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "asc" },
    });
  },

  createOrganization(data: {
    userId: string;
    name?: string;
    description?: string;
  }) {
    return prisma.organization.create({
      data: {
        name: data.name ?? "Untitled Organization",
        description: data.description,
        members: {
          create: {
            userId: data.userId,
            role: OrganizationRole.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  findOrganizationById(organizationId: string) {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        projects: {
          where: { deletedAt: null },
        },
        tags: true,
      },
    });
  },

  updateOrganization(organizationId: string, data: { name?: string; description?: string }) {
    return prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  },

  findMembers(organizationId: string) {
    return prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
  },

  createUser(data: { email: string; name?: string; passwordHash: string }) {
    return prisma.user.create({
      data,
    });
  },

  upsertMember(data: {
    organizationId: string;
    userId: string;
    role?: OrganizationRole;
  }) {
    return prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: data.organizationId,
          userId: data.userId,
        },
      },
      create: {
        organizationId: data.organizationId,
        userId: data.userId,
        role: data.role ?? OrganizationRole.MEMBER,
      },
      update: {
        role: data.role ?? OrganizationRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  findMemberById(memberId: string) {
    return prisma.organizationMember.findUnique({
      where: { id: memberId },
    });
  },

  findMemberByOrganizationAndUserId(organizationId: string, userId: string) {
    return prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: { organizationId, userId },
      },
    });
  },

  updateMemberRole(memberId: string, role: OrganizationRole) {

    return prisma.organizationMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  deleteMember(memberId: string) {
    return prisma.organizationMember.delete({
      where: { id: memberId },
    });
  },
};
