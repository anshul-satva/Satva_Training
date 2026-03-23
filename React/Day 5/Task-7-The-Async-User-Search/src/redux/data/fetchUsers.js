import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
