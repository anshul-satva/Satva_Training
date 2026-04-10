import { movieRepository } from "../repositories/movie.repository";

export const movieService = {
  async getAllMovies() {
    return movieRepository.findAll();
  },

  async getMovieById(id: string) {
    const movie = await movieRepository.findById(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  },

  async createMovie(data: {
    title: string;
    releaseYear: number;
    detail?: { runtimeMinutes: number; language: string; plot: string };
    genreIds?: string[];
    genreNames?: string[];
  }) {
    if (!data.title || !data.releaseYear)
      throw new Error("title and releaseYear are required");
    return movieRepository.create(data as any);
  },

  async updateMovie(
    id: string,
    data: { title?: string; releaseYear?: number },
  ) {
    await movieService.getMovieById(id);
    return movieRepository.update(id, data);
  },

  async addGenresToMovie(
    movieId: string,
    data: { genreIds?: string[]; genreNames?: string[] },
  ) {
    await movieService.getMovieById(movieId);

    const genreIds = data.genreIds?.filter(Boolean) ?? [];
    const genreNames =
      data.genreNames
        ?.map((name) => name?.trim())
        .filter((name): name is string => Boolean(name)) ?? [];

    if (!genreIds.length && !genreNames.length) {
      throw new Error("At least one genreId or genreName is required");
    }

    return movieRepository.addGenres(movieId, { genreIds, genreNames });
  },

  async removeGenreFromMovie(movieId: string, genreId: string) {
    await movieService.getMovieById(movieId);
    return movieRepository.removeGenre(movieId, genreId);
  },

  async deleteMovie(id: string) {
    await movieService.getMovieById(id);
    return movieRepository.delete(id);
  },
};
