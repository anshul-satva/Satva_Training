import { criticRepository } from "../repositories/critic.repository";

export const criticService = {
  async getAllCritics() {
    return criticRepository.findAll();
  },

  async getCriticById(id: string) {
    const critic = await criticRepository.findById(id);
    if (!critic) throw new Error("Critic not found");
    return critic;
  },

  async createCritic(data: { name: string; email: string; bio?: string }) {
    const existing = await criticRepository.findByEmail(data.email);
    if (existing) throw new Error("A critic with this email already exists");
    return criticRepository.create(data);
  },

  async updateCritic(
    id: string,
    data: { name?: string; email?: string; bio?: string },
  ) {
    await criticService.getCriticById(id); // throws if not found
    return criticRepository.update(id, data);
  },

  async deleteCritic(id: string) {
    await criticService.getCriticById(id);
    return criticRepository.delete(id);
  },
};
