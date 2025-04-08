/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/signup", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      await apiClient.post("/signin", credentials);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/check-user");

      return true;
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.get("/logout"); 
      return true;
    } catch (error) {
      console.error(
        "Backend logout failed, proceeding with frontend logout:",
        error
      );
      return rejectWithValue(
        "Logout failed on backend, logged out on frontend"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    authCheckCompleted: false,
    loading: false,
    authCheckLoading: true,
    error: null,
    signupLoading: false,
    signupError: null,
    signupSuccess: null,
  },
  reducers: {
    logoutClientOnly: (state) => {
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearSignupStatus: (state) => {
      state.signupError = null;
      state.signupSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(checkAuthStatus.pending, (state) => {
        state.authCheckLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.authCheckCompleted = true;
        state.authCheckLoading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.authCheckCompleted = true;
        state.authCheckLoading = false;
      })

      .addCase(logoutUser.pending, (state) => {})
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
        state.signupSuccess = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.signupLoading = false;
        state.signupError = null;

        state.signupSuccess = "Signup successful! Please log in.";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload;
        state.signupSuccess = null;
      });
  },
});

export const { logoutClientOnly, clearAuthError, clearSignupStatus } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
