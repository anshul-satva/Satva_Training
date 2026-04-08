import type { OrganizationRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const findOrganizationMembership = async (
  organizationId: string,
  userId: string,
) =>
  prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

export const ensureMemberHasRole = (
  currentRole: OrganizationRole,
  acceptedRoles: OrganizationRole[],
) => acceptedRoles.includes(currentRole);
