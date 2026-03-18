import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fetchProductsReducer from "./fetchProductsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fetchProducts: fetchProductsReducer,
  }
});