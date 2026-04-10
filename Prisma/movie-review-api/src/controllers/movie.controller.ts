import { Request, Response } from "express";
import { movieService } from "../services/movie.service";

export const movieController = {
  async getAll(_req: Request, res: Response) {
    try {
      res.json(await movieService.getAllMovies());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      res.json(await movieService.getMovieById(req.params.id as string));
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const movie = await movieService.createMovie(req.body);
      res.status(201).json(movie);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      res.json(
        await movieService.updateMovie(req.params.id as string, req.body),
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async addGenres(req: Request, res: Response) {
    try {
      res.json(
        await movieService.addGenresToMovie(req.params.id as string, req.body),
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async removeGenre(req: Request, res: Response) {
    try {
      res.json(
        await movieService.removeGenreFromMovie(
          req.params.id as string,
          req.params.genreId as string,
        ),
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await movieService.deleteMovie(req.params.id as string);
      res.json({ message: "Movie deleted" });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },
};
