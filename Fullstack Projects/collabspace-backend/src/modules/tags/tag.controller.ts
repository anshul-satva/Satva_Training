import type { Request, Response } from "express";
import { sendResponse } from "../../utils/response.util.js";
import { tagService } from "./tag.service.js";

export const listTags = async (request: Request, response: Response) => {
  const tags = await tagService.listTags(request.params.organizationId);

  return sendResponse(response, 200, "Tags fetched successfully", tags);
};

export const createTag = async (request: Request, response: Response) => {
  const tag = await tagService.createTag({
    organizationId: request.params.organizationId,
    ...request.body,
  });

  return sendResponse(response, 201, "Tag created successfully", tag);
};

export const updateTag = async (request: Request, response: Response) => {
  const updatedTag = await tagService.updateTag(request.params.tagId, request.body);

  return sendResponse(response, 200, "Tag updated successfully", updatedTag);
};

export const deleteTag = async (request: Request, response: Response) => {
  await tagService.deleteTag(request.params.tagId);

  return sendResponse(response, 200, "Tag deleted successfully", null);
};
