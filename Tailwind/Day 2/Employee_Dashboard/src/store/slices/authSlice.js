import { createSlice } from "@reduxjs/toolkit";

const MOCK_USERS = [
  { email: "anshul@gmail.com", password: "anshul123", name: "Admin User", role: "Admin" },
  { email: "hr@gmail.com",    password: "hr1234",   name: "Lea Mori",   role: "HR"    },
]

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    login(state, { payload }) {
      const { email, password } = payload
      const found = MOCK_USERS.find(
        u => u.email === email && u.password === password
      )
      if (found) {
        state.user = { name: found.name, email: found.email, role: found.role }
        state.isAuthenticated = true
        state.error = null
      } else {
        state.error = "Invalid email or password."
      }
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { login, logout, clearError } = authSlice.actions
export default authSlice.reducer