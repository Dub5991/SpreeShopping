// src/redux/orderSlice.ts
// Redux slice for order state

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  items: OrderItem[];
  createdAt?: string;
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = { orders: [] };

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
    },
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;