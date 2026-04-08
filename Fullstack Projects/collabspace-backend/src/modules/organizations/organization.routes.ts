import { OrganizationRole } from "@prisma/client";
import { Router } from "express";
import {
  requireOrganizationAccess,
  requireOrganizationRole,
} from "../../middlewares/access.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import {
  addMember,
  createOrganization,
  getOrganization,
  listMembers,
  listOrganizations,
  removeMember,
  updateMemberRole,
  updateOrganization,
} from "./organization.controller.js";
import {
  addMemberSchema,
  createOrganizationSchema,
  memberParamsSchema,
  organizationParamsSchema,
  updateMemberSchema,
  updateOrganizationSchema,
} from "./organization.schema.js";

const organizationRoutes = Router();

organizationRoutes.use(asyncHandler(requireAuth));

organizationRoutes.get("/", asyncHandler(listOrganizations));
organizationRoutes.post(
  "/",
  validateRequest({ body: createOrganizationSchema }),
  asyncHandler(createOrganization),
);
organizationRoutes.get(
  "/:organizationId",
  validateRequest({ params: organizationParamsSchema }),
  asyncHandler(requireOrganizationAccess()),
  asyncHandler(getOrganization),
);
organizationRoutes.patch(
  "/:organizationId",
  validateRequest({
    params: organizationParamsSchema,
    body: updateOrganizationSchema,
  }),
  asyncHandler(
    requireOrganizationRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(updateOrganization),
);
organizationRoutes.get(
  "/:organizationId/members",
  validateRequest({ params: organizationParamsSchema }),
  asyncHandler(requireOrganizationAccess()),
  asyncHandler(listMembers),
);
organizationRoutes.post(
  "/:organizationId/members",
  validateRequest({ params: organizationParamsSchema, body: addMemberSchema }),
  asyncHandler(
    requireOrganizationRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(addMember),
);
organizationRoutes.patch(
  "/:organizationId/members/:memberId",
  validateRequest({ params: memberParamsSchema, body: updateMemberSchema }),
  asyncHandler(requireOrganizationRole([OrganizationRole.ADMIN])),
  asyncHandler(updateMemberRole),
);
organizationRoutes.delete(
  "/:organizationId/members/:memberId",
  validateRequest({ params: memberParamsSchema }),
  asyncHandler(requireOrganizationRole([OrganizationRole.ADMIN])),
  asyncHandler(removeMember),
);

export default organizationRoutes;
