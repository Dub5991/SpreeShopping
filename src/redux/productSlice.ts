// src/redux/productSlice.ts
// Redux slice for product state

import { createSlice } from "@reduxjs/toolkit";

type Product = { id: string; name: string; price: number; stock: number; category: string };
type ProductState = { items: Product[] };

const productSlice = createSlice({
  name: "products",
  initialState: { items: [] } as ProductState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
    clearProducts(state) {
      state.items = [];
    },
  },
});

export const { setProducts, clearProducts } = productSlice.actions;
export default productSlice.reducer;