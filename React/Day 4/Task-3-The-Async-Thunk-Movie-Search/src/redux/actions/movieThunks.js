import {createAsyncThunk} from '@reduxjs/toolkit'

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (searchTerm, thunkAPI) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
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