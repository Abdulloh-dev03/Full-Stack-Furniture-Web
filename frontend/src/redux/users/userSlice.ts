import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import axiosInstance from '../api/axiosInstance'
import type { AxiosError } from 'axios'

// Define CartItem type according to your Prisma schema
export interface CartItem {
  id: number
  productId?: number | null
  roomId?: number | null
  quantity: number
  // add other fields if needed
}

// Extend User type to include cartItems
export interface User {
  id: number
  name: string
  email: string
  profilePic: string
  cartItems: CartItem[]
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/users', { withCredentials: true })
      return res.data.data.users as User[]
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || 'Failed to load users')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load users'
      })
  },
})

export default userSlice.reducer
