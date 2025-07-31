import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { clearUser, setUser } from "./userSlice";
import { decodeAccessToken } from "@/shared/utils/jwt";
import { loginApi, logoutApi, refreshAccessTokenApi, registerApi, RegisterRequest, validateAccessTokenApi } from "@/shared/services/auth-service";

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    username: string;
    isLoggedIn: boolean;
    loading: boolean;
}

const initialState = {
    accessToken: null,
    refreshToken: null,
    username: null,
    isLoggedIn: false,
    loading: false
}



export const validateAccessTokenThunk = createAsyncThunk(
  "auth/validateAccessToken",
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      return rejectWithValue("Tokens not found");
    }

    try {
      const res = await validateAccessTokenApi(accessToken, refreshToken);

      const {  id, username, role } = decodeAccessToken(accessToken);
      dispatch( loginAction({ accessToken, refreshToken, username }) );
      

      dispatch( setUser({ id,username,role }) );



      return res.data;

    } catch (error: any) {
       if (error.response && error.response.data) {
          const { code, message } = error.response.data;

          if( code == "INVALID_ACCESS_TOKEN"){
            
            const refreshResult = await dispatch(refreshAccessTokenThunk());
            
            if (refreshAccessTokenThunk.fulfilled.match(refreshResult)) {
              const { accessToken, refreshToken } = refreshResult.payload;

              dispatch(loginAction( {accessToken, refreshToken, username: decodeAccessToken(accessToken).username }) );
            }
          }
          else if (code == "REFRESH_TOKEN_BLACKLISTED")
            
            await dispatch(logoutThunk()); 
      } 
      return rejectWithValue(error.response.data.message);
      }
  }
);

// Refresh token ile yeni access token alma
export const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { dispatch,  rejectWithValue }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (!refreshToken || !accessToken) {
      await dispatch(logoutThunk());
      return rejectWithValue("Tokens not found");
    }

    try {
      const res = await refreshAccessTokenApi(refreshToken, accessToken);
      return res.data; 
    } catch (err: any) {
       await dispatch(logoutThunk());
      if (
        err.response?.data?.code === "RefreshTokenBlacklistedException" ||
        err.response?.data?.message === "RefreshTokenBlacklistedException"
      ) {
        return rejectWithValue("RefreshTokenBlacklistedException");
      }
      return rejectWithValue(err.response?.data?.message || "Refresh failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken || !refreshToken) {
      return rejectWithValue('Tokens not found')
    }

    try {
      await logoutApi(accessToken, refreshToken)
    } catch (err) {
      console.error('Logout error:', err)
    }

    dispatch(clearUser())
    dispatch(logoutAction())
  }
)

export const loginThunk = createAsyncThunk<
  { id: string; userName: string; role: string },
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const { accessToken, refreshToken } = await loginApi({ username, password });

      const {  id, role } = decodeAccessToken(accessToken);


      dispatch( loginAction({ accessToken, refreshToken, username }) );
      dispatch( setUser({ id,username,role }) );

      return { id, username, role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (registerData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerApi(registerData);
      return response.data;
    } catch (error: any) {
      // Axios error yapısı kontrolü
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginAction: (state, action: any) => {
            const { username, accessToken, refreshToken } = action.payload
            const decoded = accessToken ? decodeAccessToken(accessToken) : null

            state.username = username ?? decoded?.username ?? null
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isLoggedIn = true;
  
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        },
        logoutAction: (state) => {
          state.accessToken = null;
          state.refreshToken = null;
          state.username = null;
          state.isLoggedIn = false;

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken')
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(validateAccessTokenThunk.pending, (state) => {
            state.loading = true;
        })
        .addCase(validateAccessTokenThunk.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(validateAccessTokenThunk.rejected, (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.loading = false;
        });
  },
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;