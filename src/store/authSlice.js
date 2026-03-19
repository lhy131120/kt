import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { plainApi, setToken, clearToken, getTokenFromCookie } from "@/services";

// Keep CheckAuth
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  // 先檢查 token 是否存在就發請求 — 如果 cookie 裡根本沒有 token，可以直接跳過 API 呼叫，避免不必要的 401。
  const token = getTokenFromCookie();
  if (!token) {
    return rejectWithValue(false);
  }
  try {
    await plainApi.post("/api/user/check");
    return true;
  } catch (error) {
    return rejectWithValue(false);
  }
});

// Login Action
export const login = createAsyncThunk("auth/login", async (parameters, { rejectWithValue }) => {
  try {
    const response = await plainApi.post("/admin/signin", parameters)
    const { token, expired } = response.data;
    if (!token) {
      throw new Error("沒有有效的token");
    }
    setToken(token, expired);
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.message || error?.message || "登入失敗，請檢查帳號密碼或網路連線");
  }
});

// Logout Action
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await plainApi.post("/logout");
  } catch (error) {
    // If the error is not due to an invalid session, we should clear the token anyway
    if (!error?.response?.status === 400 && error?.response?.data?.message === "No active session") {
      clearToken();
      throw error;
    }
    return rejectWithValue(false);
  }
  clearToken();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: null,
    isLoggingIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── checkAuth ── 
      .addCase(checkAuth.fulfilled, (state) => { state.isAuthenticated = true })
      .addCase(checkAuth.rejected, (state) => { state.isAuthenticated = false })
      // ── logout ──
      .addCase(logout.fulfilled, (state) => { state.isAuthenticated = false })
      .addCase(logout.rejected, (state) => { state.isAuthenticated = false })
      // ── login ──
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoggingIn = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
  }
});

export default authSlice.reducer;