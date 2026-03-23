import { createSlice } from "@reduxjs/toolkit";
import { products } from "../data/products";

export const inventortySlice = createSlice({
  name: "inventory",
  initialState: {
    products:products,
  },
  reducers: {
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    },
  },
});

export const { deleteProduct } = inventortySlice.actions;
export default inventortySlice.reducer;