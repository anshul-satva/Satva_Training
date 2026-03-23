import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    history: [],
  },
  reducers: {
    increment: (state) => {
      state.history.push(state.value);
      state.value = state.value + 1;
    },
    decrement: (state) => {
      state.history.push(state.value);
      state.value = state.value - 1;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    resetValue: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, setValue, resetValue } =
  counterSlice.actions;

export default counterSlice.reducer;
