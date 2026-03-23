import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../redux/slices/themeSlice";
import layoutReducer from "../redux/slices/layoutSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    layout: layoutReducer,
  },
});