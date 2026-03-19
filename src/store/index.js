import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fetchProductsReducer from "./fetchProductsSlice";
import fetchAdminProductsReducer from "./fetchAdminProductsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fetchProducts: fetchProductsReducer,
    fetchAdminProducts: fetchAdminProductsReducer,
  }
});