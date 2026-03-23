import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import layoutReducer from "../features/layoutSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    layout: layoutReducer,
  },
});