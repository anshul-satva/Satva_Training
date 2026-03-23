import { createSlice } from "@reduxjs/toolkit";
import { userData } from "../data/usersData";

export const userSlice = createSlice({
  name: "users",
  initialState: userData,
  reducers: {
    deleteUser: (state, action) =>
      state.filter((user) => user.id !== action.payload),
  },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;
