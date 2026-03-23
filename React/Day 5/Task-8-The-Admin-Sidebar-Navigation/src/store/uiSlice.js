import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    collapsed: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed =  !state.collapsed;
    },
  },
});
export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
