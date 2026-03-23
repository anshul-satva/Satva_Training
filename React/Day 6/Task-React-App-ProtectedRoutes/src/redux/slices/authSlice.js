import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authUser",
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.name;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.setItem("logout-event", Date.now());
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
