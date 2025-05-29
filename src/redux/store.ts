import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    orders: orderReducer,
  },
});

// Infer types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;