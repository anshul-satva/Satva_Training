import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (searchTerm, thunkAPI) => {
    try {
      const response = await fetch(
        "https://jsonplffffaceholder.typicode.com/posts",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const filteredMovies = data.filter((movie) => {
        return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return filteredMovies;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const movieSLice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSLice.reducer;
