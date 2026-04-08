import { tagRepository } from "./tag.repository.js";

export const tagService = {
  listTags(organizationId: string) {
    return tagRepository.findTagsByOrganization(organizationId);
  },

  createTag(payload: {
    organizationId: string;
    name?: string;
    color?: string;
  }) {
    return tagRepository.createTag(payload);
  },

  updateTag(tagId: string, data: { name?: string; color?: string }) {
    return tagRepository.updateTag(tagId, data);
  },

  async deleteTag(tagId: string) {
    await tagRepository.deleteTag(tagId);
    return null;
  },
};
