import { OrganizationRole } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware.js";
import { hashPassword } from "../../utils/bcrypt.util.js";
import { organizationRepository } from "./organization.repository.js";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const organizationService = {
  listOrganizations(userId: string) {
    return organizationRepository.findOrganizationsByUser(userId);
  },

  createOrganization(payload: {
    userId: string;
    name?: string;
    description?: string;
  }) {
    return organizationRepository.createOrganization(payload);
  },

  getOrganization(organizationId: string) {
    return organizationRepository.findOrganizationById(organizationId);
  },

  updateOrganization(organizationId: string, data: { name?: string; description?: string }) {
    return organizationRepository.updateOrganization(organizationId, data);
  },

  listMembers(organizationId: string) {
    return organizationRepository.findMembers(organizationId);
  },

  async addMember(payload: {
    organizationId: string;
    name?: string;
    email: string;
    password?: string;
    role?: OrganizationRole;
  }) {
    const normalizedEmail = normalizeEmail(payload.email);
    let user = await organizationRepository.findUserByEmail(
      normalizedEmail,
    );

    if (user) {
      const existingMember = await organizationRepository.findMemberByOrganizationAndUserId(
        payload.organizationId,
        user.id
      );
      if (existingMember) {
        throw new AppError("User is already a member of this organization", 409);
      }
    } else {
      if (!payload.password) {
        throw new AppError("Password is required for new users", 400);
      }
      const passwordHash = await hashPassword(payload.password);
      user = await organizationRepository.createUser({
        email: normalizedEmail,
        name: payload.name,
        passwordHash,
      });
    }

    return organizationRepository.upsertMember({
      organizationId: payload.organizationId,
      userId: user.id,
      role: payload.role,
    });
  },

  async updateMemberRole(payload: {
    organizationId: string;
    memberId: string;
    role: OrganizationRole;
  }) {
    const existingMember = await organizationRepository.findMemberById(payload.memberId);

    if (!existingMember || existingMember.organizationId !== payload.organizationId) {
      throw new AppError("Member not found", 404);
    }

    if (
      existingMember.role === OrganizationRole.ADMIN &&
      payload.role !== OrganizationRole.ADMIN
    ) {
      throw new AppError("Admin role cannot be changed", 403);
    }

    return organizationRepository.updateMemberRole(payload.memberId, payload.role);
  },

  async removeMember(payload: {
    organizationId: string;
    memberId: string;
    currentUserId: string;
  }) {
    const existingMember = await organizationRepository.findMemberById(payload.memberId);

    if (!existingMember || existingMember.organizationId !== payload.organizationId) {
      throw new AppError("Member not found", 404);
    }

    if (existingMember.userId === payload.currentUserId) {
      throw new AppError("You cannot delete yourself", 403);
    }

    if (existingMember.role === OrganizationRole.ADMIN) {
      throw new AppError("Admin members cannot be deleted", 403);
    }

    await organizationRepository.deleteMember(payload.memberId);
    return null;
  },
};
