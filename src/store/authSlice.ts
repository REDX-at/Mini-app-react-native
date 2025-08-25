// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthHeader } from "../services/api";

interface AuthState {
  user: string | null;
  token: string | null;
  status: "idle" | "loading" | "error";
  initialized: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  initialized: false,
  error: null,
};

// LOGIN thunk
export const loginThunk = createAsyncThunk<
  { user: string | null; token: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/loginThunk", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    console.log("Login response:", response.data);
    const {
      accessToken,
      username: user,
      refreshToken,
    } = response.data as {
      accessToken?: string;
      username?: string;
      refreshToken?: string;
    };

    if (!accessToken) {
      return rejectWithValue("No access token in response");
    }

    // persist token
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken || "");
    // ensure axios defaults include it immediately
    setAuthHeader(accessToken);

    return { user: user ?? null, token: accessToken };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Login failed";
    return rejectWithValue(String(message));
  }
});

// INIT thunk - called on app start
export const initAuthThunk = createAsyncThunk<
  { user: string | null; token: string | null },
  void,
  { rejectValue: string }
>("auth/initAuthThunk", async (_, { rejectWithValue }) => {
  try {
    const stored = await AsyncStorage.getItem("accessToken");
    if (!stored) {
      return { user: null, token: null };
    }

    // set header so /auth/me has Authorization
    setAuthHeader(stored);

    // validate token and get user
    const me = await api.get("/auth/me");
    const user: string | null = (me?.data?.username as string) ?? null;

    return { user, token: stored };
  } catch (err: any) {
    // invalid token: clear storage and header
    await AsyncStorage.removeItem("accessToken");
    setAuthHeader(null);
    return rejectWithValue("Token invalid");
  }
});

// LOGOUT thunk - async cleanup then resolved to reducers
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutThunk", async (_, { rejectWithValue }) => {
  try {
    await AsyncStorage.removeItem("accessToken");
    setAuthHeader(null);
    // optionally call backend logout endpoint here
    return;
  } catch (err: any) {
    return rejectWithValue("Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // keep this pure — used only if you need a manual reset
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.initialized = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ user: string | null; token: string }>
        ) => {
          state.status = "idle";
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = (action.payload as string) ?? "Login failed";
      })

      // init
      .addCase(initAuthThunk.pending, (state) => {
        state.status = "loading";
        state.initialized = false;
      })
      .addCase(
        initAuthThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ user: string | null; token: string | null }>
        ) => {
          state.status = "idle";
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.initialized = true;
          state.error = null;
        }
      )
      .addCase(initAuthThunk.rejected, (state) => {
        state.status = "idle";
        state.initialized = true;
      })

      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
        console.log("Logged out, clearing state");
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.initialized = true;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        // if logout failed, still clear local state to ensure UI consistency
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.initialized = true;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
