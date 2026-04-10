import { OrganizationRole } from "@prisma/client";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { organizationService } from "./organization.service.js";

export const listOrganizations = async (
  request: Request,
  response: Response,
) => {
  const organizations = await organizationService.listOrganizations(
    request.currentUser?.id as string,
  );

  return sendResponse(
    response,
    200,
    "Organizations fetched successfully",
    organizations,
  );
};

export const createOrganization = async (
  request: Request,
  response: Response,
) => {
  const organization = await organizationService.createOrganization({
    userId: request.currentUser?.id as string,
    ...request.body,
  });

  return sendResponse(
    response,
    201,
    "Organization created successfully",
    organization,
  );
};

export const getOrganization = async (request: Request, response: Response) => {
  const organization = await organizationService.getOrganization(
    request.params.organizationId,
  );

  return sendResponse(
    response,
    200,
    "Organization fetched successfully",
    organization,
  );
};

export const updateOrganization = async (
  request: Request,
  response: Response,
) => {
  const organization = await organizationService.updateOrganization(
    request.params.organizationId,
    request.body,
  );

  return sendResponse(
    response,
    200,
    "Organization updated successfully",
    organization,
  );
};

export const listMembers = async (request: Request, response: Response) => {
  const members = await organizationService.listMembers(
    request.params.organizationId,
  );

  return sendResponse(
    response,
    200,
    "Organization members fetched successfully",
    members,
  );
};

export const addMember = async (request: Request, response: Response) => {
  const membership = await organizationService.addMember({
    organizationId: request.params.organizationId,
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    role: request.body.role as OrganizationRole | undefined,
  });

  return sendResponse(response, 200, "Member added successfully", membership);
};

export const updateMemberRole = async (
  request: Request,
  response: Response,
) => {
  const membership = await organizationService.updateMemberRole({
    organizationId: request.params.organizationId,
    memberId: request.params.memberId,
    role: request.body.role as OrganizationRole,
  });

  return sendResponse(
    response,
    200,
    "Member role updated successfully",
    membership,
  );
};

export const removeMember = async (request: Request, response: Response) => {
  await organizationService.removeMember({
    organizationId: request.params.organizationId,
    memberId: request.params.memberId,
    currentUserId: request.currentUser?.id as string,
  });

  return sendResponse(response, 200, "Member removed successfully", null);
};
