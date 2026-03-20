import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services";

export const fetchAllProducts = createAsyncThunk("fetchProducts/fetchAllProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/products/all");
    console.log(response.data)
    return response.data.products;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failure fetching products");
  }
});

export const fetchProducts = createAsyncThunk("fetchProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get("/products");
    const response = await api.get("/products/232");
    console.log(response.data)
    // return response.data;
    return {
      products: response.data.products || [],
      pagination: response.data.pagination,
    }
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "取得管理員產品列表失敗");
    // console.log(error)
  }
});

const fetchProductsSlice = createSlice({
  name: "fetchProducts",
  initialState: {
    products: [],
    selectedCategory: "all",
    pagination: {
      total_pages: 1,
      current_page: 1,
      has_pre: false,
      has_next: false,
      category: ""
    }
  },
  reducers: {
    setProducts: (state, action) => {
      console.log(state, action);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = Object.keys(action.payload).map(id => ({ id, ...action.payload[id] }));
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // state.products = Object.keys(action.payload).map(id => ({ id, ...action.payload[id] }));
        // state.pagination
        state.products = action.payload.products;
        console.log(state)
        console.log(action)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.log("Error", action.payload);
      })
  }
});

export const { setProducts } = fetchProductsSlice.actions;
export default fetchProductsSlice.reducer;