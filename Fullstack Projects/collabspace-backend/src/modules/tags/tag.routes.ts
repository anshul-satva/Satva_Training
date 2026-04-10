import { OrganizationRole } from "@prisma/client";
import { Router } from "express";
import {
  requireOrganizationAccess,
  requireOrganizationRole,
  requireTagRole,
} from "../../middlewares/access.middleware.js";

import { validateRequest } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.util.js";
import {
  createTag,
  deleteTag,
  listTags,
  updateTag,
} from "./tag.controller.js";
import {
  createTagSchema,
  organizationTagParamsSchema,
  tagParamsSchema,
  updateTagSchema,
} from "./tag.schema.js";

const tagRoutes = Router();



tagRoutes.get(
  "/organizations/:organizationId/tags",
  validateRequest({ params: organizationTagParamsSchema }),
  asyncHandler(requireOrganizationAccess()),
  asyncHandler(listTags),
);

tagRoutes.post(
  "/organizations/:organizationId/tags",
  validateRequest({
    params: organizationTagParamsSchema,
    body: createTagSchema,
  }),
  asyncHandler(
    requireOrganizationRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER]),
  ),
  asyncHandler(createTag),
);

tagRoutes.patch(
  "/tags/:tagId",
  validateRequest({ params: tagParamsSchema, body: updateTagSchema }),
  asyncHandler(requireTagRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER])),
  asyncHandler(updateTag),
);

tagRoutes.delete(
  "/tags/:tagId",
  validateRequest({ params: tagParamsSchema }),
  asyncHandler(requireTagRole([OrganizationRole.ADMIN, OrganizationRole.MANAGER])),
  asyncHandler(deleteTag),
);

export default tagRoutes;
