import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
    locked: false,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
    toggleLock: (state) => {
      state.locked = !state.locked;
    },
  },
});

export const { increment, decrement, reset, toggleLock } = counterSlice.actions;
export default counterSlice.reducer;
