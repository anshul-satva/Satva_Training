import { Request, Response } from "express";
import { criticService } from "../services/critic.service";

export const criticController = {
  async getAll(req: Request, res: Response) {
    try {
      const critics = await criticService.getAllCritics();
      res.json(critics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch critics" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const critic = await criticService.getCriticById(req.params.id as string);
      res.json(critic);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const critic = await criticService.createCritic(req.body);
      res.status(201).json(critic);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const critic = await criticService.updateCritic(
        req.params.id as string,
        req.body,
      );
      res.json(critic);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await criticService.deleteCritic(req.params.id as string);
      res.json({ message: "Critic deleted successfully" });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },
};
