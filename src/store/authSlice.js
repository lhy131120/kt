import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { plainApi, setToken, clearToken } from "@/services";

// Keep CheckAuth
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    await plainApi.post("/api/user/check");
    return true;
  } catch (error) {
    return rejectWithValue(false);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: null,
    isLoggingIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {

  }
});

export default authSlice.reducer;