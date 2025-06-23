// src/app/redux/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { loginAPI, signupAPI, logoutAPI } from "./authAPI"
import type { AuthState, LoginPayload, SignupPayload, User } from "./authTypes"
import axios from "axios"

const userFromStorage = typeof window !== "undefined"
  ? JSON.parse(localStorage.getItem("user") || "null")
  : null

const tokenFromStorage = typeof window !== "undefined"
  ? localStorage.getItem("token")
  : null

export const initialState: AuthState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
  success: false,
  isInitialized: false,
}


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await loginAPI(payload)
      return response // expected: { ok, message, data: { userInfo, token } }
    } catch (error: unknown) {
      let message = "Something went wrong"
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload: SignupPayload, thunkAPI) => {
    try {
      const response = await signupAPI(payload)
      return response
    } catch (error: unknown) {
      let message = "Signup failed"
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await logoutAPI()
    return { success: true }
  } catch (error: unknown) {
    let message = "Logout failed"
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message
    }
    return thunkAPI.rejectWithValue(message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
    },
    clearAuthError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.success = false
    },
    resetAuthState: (state) => {
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.success = false
      state.error = null
    })
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false
  if (action.payload.data) {
    const userData = { ...action.payload.data }
    const { token, ...userWithoutToken } = userData
    state.user = userWithoutToken
    state.token = token

    // ✅ Persist in localStorage
    localStorage.setItem("user", JSON.stringify(userWithoutToken))
    localStorage.setItem("token", token)
  }
  state.success = true
})

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  },
})

export const { logout, resetAuthState, setUser, setToken, clearAuthError } = authSlice.actions
export default authSlice.reducer