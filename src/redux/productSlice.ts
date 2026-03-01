// src/redux/productSlice.ts
// Redux slice for product state

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
}

interface ProductState {
  items: Product[];
}

const initialState: ProductState = { items: [] };

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    clearProducts(state) {
      state.items = [];
    },
  },
});

export const { setProducts, clearProducts } = productSlice.actions;
export default productSlice.reducer;