import { genreRepository } from "../repositories/genre.repository";

export const genreService = {
  async getAllGenres() {
    return genreRepository.findAll();
  },

  async getGenreById(id: string) {
    const genre = await genreRepository.findById(id);
    if (!genre) throw new Error("Genre not found");
    return genre;
  },

  async createGenre(data: { name: string }) {
    const name = data.name?.trim();
    if (!name) throw new Error("Genre name is required");

    const existing = await genreRepository.findByName(name);
    if (existing) throw new Error("A genre with this name already exists");

    return genreRepository.create({ name });
  },

  async updateGenre(id: string, data: { name?: string }) {
    await genreService.getGenreById(id);

    const name = data.name?.trim();
    if (data.name !== undefined && !name) {
      throw new Error("Genre name cannot be empty");
    }

    if (name) {
      const existing = await genreRepository.findByName(name);
      if (existing && existing.id !== id) {
        throw new Error("A genre with this name already exists");
      }
    }

    return genreRepository.update(id, name ? { name } : {});
  },

  async deleteGenre(id: string) {
    await genreService.getGenreById(id);
    return genreRepository.delete(id);
  },
};
