import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    collapsed: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;
export default layoutSlice.reducer;