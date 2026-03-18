import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services";

export const fetchProducts = createAsyncThunk("fetchProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/products/all");
    return response.data.products;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failure fetching products");
  }
});

const fetchProductsSlice = createSlice({
  name: "fetchProducts",
  initialState: {
    products: [],
    selectedCategory: "all",
  },
  reducers: {
    setProducts: (state, action) => {
      console.log(state, action);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = Object.keys(action.payload).map(id => ({ id, ...action.payload[id] }));
      })
  }
});

export const { setProducts } = fetchProductsSlice.actions;
export default fetchProductsSlice.reducer;