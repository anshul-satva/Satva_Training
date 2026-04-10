import { z } from "zod";

const currentYear = new Date().getFullYear();

const nonEmptyString = (field: string) =>
  z.string().trim().min(1, `${field} is required`);

const nonEmptyStringArray = (field: string) =>
  z
    .array(nonEmptyString(field))
    .min(1, `${field} must contain at least one value`);

const atLeastOneField = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  message: string,
) =>
  schema.refine((data) => Object.keys(data).length > 0, {
    message,
  });

export const idParamSchema = z
  .object({
    id: nonEmptyString("id"),
  })
  .strict();

export const movieIdParamSchema = z
  .object({
    movieId: nonEmptyString("movieId"),
  })
  .strict();

export const criticIdParamSchema = z
  .object({
    criticId: nonEmptyString("criticId"),
  })
  .strict();

export const movieGenreParamsSchema = z
  .object({
    id: nonEmptyString("id"),
    genreId: nonEmptyString("genreId"),
  })
  .strict();

export const createCriticSchema = z
  .object({
    name: nonEmptyString("name"),
    email: z.string().trim().email("A valid email is required"),
    bio: nonEmptyString("bio").optional(),
  })
  .strict();

export const updateCriticSchema = atLeastOneField(
  z
    .object({
      name: nonEmptyString("name").optional(),
      email: z.string().trim().email("A valid email is required").optional(),
      bio: nonEmptyString("bio").optional(),
    })
    .strict(),
  "At least one field is required",
);

export const createGenreSchema = z
  .object({
    name: nonEmptyString("name"),
  })
  .strict();

export const updateGenreSchema = atLeastOneField(
  z
    .object({
      name: nonEmptyString("name").optional(),
    })
    .strict(),
  "At least one field is required",
);

const movieDetailSchema = z
  .object({
    runtimeMinutes: z.coerce
      .number()
      .int("runtimeMinutes must be a whole number")
      .positive("runtimeMinutes must be greater than 0"),
    language: nonEmptyString("language"),
    plot: nonEmptyString("plot"),
  })
  .strict();

const movieDetailUpdateSchema = z
  .object({
    id: z.string().optional(),
    runtimeMinutes: z.coerce
      .number()
      .int("runtimeMinutes must be a whole number")
      .positive("runtimeMinutes must be greater than 0")
      .optional(),
    language: nonEmptyString("language").optional(),
    plot: nonEmptyString("plot").optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.runtimeMinutes !== undefined ||
      data.language !== undefined ||
      data.plot !== undefined,
    {
      message: "detail must include at least one updatable field",
    },
  );

export const createMovieSchema = z
  .object({
    title: nonEmptyString("title"),
    releaseYear: z.coerce
      .number()
      .int("releaseYear must be a whole number")
      .min(1888, "releaseYear must be 1888 or later")
      .max(
        currentYear + 5,
        `releaseYear must be ${currentYear + 5} or earlier`,
      ),
    detail: movieDetailSchema.optional(),
    genreIds: nonEmptyStringArray("genreIds").optional(),
    genreNames: nonEmptyStringArray("genreNames").optional(),
  })
  .strict();

export const updateMovieSchema = atLeastOneField(
  z
    .object({
      title: nonEmptyString("title").optional(),
      releaseYear: z.coerce
        .number()
        .int("releaseYear must be a whole number")
        .min(1888, "releaseYear must be 1888 or later")
        .max(
          currentYear + 5,
          `releaseYear must be ${currentYear + 5} or earlier`,
        )
        .optional(),
      detail: movieDetailUpdateSchema.optional(),
    })
    .strict(),
  "At least one field is required",
);

export const addMovieGenresSchema = z
  .object({
    genreIds: nonEmptyStringArray("genreIds").optional(),
    genreNames: nonEmptyStringArray("genreNames").optional(),
  })
  .strict()
  .refine((data) => Boolean(data.genreIds?.length || data.genreNames?.length), {
    message: "genreIds or genreNames must contain at least one value",
  });

export const createReviewSchema = z
  .object({
    rating: z.coerce
      .number()
      .min(1, "rating must be between 1 and 10")
      .max(10, "rating must be between 1 and 10"),
    content: nonEmptyString("content"),
    criticId: nonEmptyString("criticId"),
    movieId: nonEmptyString("movieId"),
  })
  .strict();

export const updateReviewSchema = atLeastOneField(
  z
    .object({
      rating: z.coerce
        .number()
        .min(1, "rating must be between 1 and 10")
        .max(10, "rating must be between 1 and 10")
        .optional(),
      content: nonEmptyString("content").optional(),
    })
    .strict(),
  "At least one field is required",
);
