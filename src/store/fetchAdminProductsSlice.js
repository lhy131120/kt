import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const fetchAdminProductsSlice = createSlice({
  name: "getchAdminProducts",
  initialState: {
    products: [],
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {

  }
});

export default fetchAdminProductsSlice.reducer;