// src/redux/orderSlice.ts
// Redux slice for order state

import { createSlice } from "@reduxjs/toolkit";

type Order = { id: string; [key: string]: unknown };
type OrderState = { orders: Order[] };

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [] } as OrderState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
    },
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;