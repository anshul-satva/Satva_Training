import { Request, Response } from "express";
import { genreService } from "../services/genre.service";

export const genreController = {
  async getAll(_req: Request, res: Response) {
    try {
      res.json(await genreService.getAllGenres());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      res.json(await genreService.getGenreById(req.params.id as string));
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      res.status(201).json(await genreService.createGenre(req.body));
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      res.json(
        await genreService.updateGenre(req.params.id as string, req.body),
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await genreService.deleteGenre(req.params.id as string);
      res.json({ message: "Genre deleted" });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },
};
