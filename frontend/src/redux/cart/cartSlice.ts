import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit"
import type { CartItemType, AddToCartPayload } from "./cartTypes"
import * as cartAPI from "./cartApi"
import type { AxiosError } from "axios"

interface CartState {
  items: CartItemType[]
  loading: boolean
  updatingItemId: number | null
  removingItemId: number | null
  error: string | null
}

const initialState: CartState = {
  items: [],
  loading: false,
  updatingItemId: null,
  removingItemId: null,
  error: null,
}

export const fetchCartByUser = createAsyncThunk("cart/fetchByUser", async (userId: number, { rejectWithValue }) => {
  try {
    const data = await cartAPI.getCartByUser(userId)
    return data
  } catch (error: unknown) {
  const err = error as AxiosError<{ message: string }>
  return rejectWithValue(err.response?.data?.message || "Failed to load cart")
}
})

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (payload: AddToCartPayload, { rejectWithValue }) => {
    try {
      const data = await cartAPI.addToCart(payload)
      return data
    } catch (error: unknown) {
  const err = error as AxiosError<{ message: string }>
  return rejectWithValue(err.response?.data?.message || "Failed to load cart")
}
  },
)

export const updateCartItemQty = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const data = await cartAPI.updateCartItemQuantity(cartItemId, quantity)
      return data
    } catch (error: unknown) {
  const err = error as AxiosError<{ message: string }>
  return rejectWithValue(err.response?.data?.message || "Failed to load cart")
}
  },
)

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(cartItemId)
      return cartItemId
    } catch (error: unknown) {
  const err = error as AxiosError<{ message: string }>
  return rejectWithValue(err.response?.data?.message || "Failed to load cart")
}
  },
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartByUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCartByUser.fulfilled, (state, action: PayloadAction<CartItemType[]>) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchCartByUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItemType>) => {
        const existing = state.items.find(
          (item) =>
            item.productId === action.payload.productId &&
            item.roomId === action.payload.roomId &&
            item.mainId === action.payload.mainId,
        )
        if (existing) {
          existing.quantity = action.payload.quantity
        } else {
          state.items.push(action.payload)
        }
        state.error = null
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(updateCartItemQty.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.cartItemId

        // Optimistic update
        const item = state.items.find((i) => i.id === action.meta.arg.cartItemId)
        if (item) {
          item.quantity = action.meta.arg.quantity
        }

        state.error = null
      })
      .addCase(updateCartItemQty.fulfilled, (state) => {
        state.updatingItemId = null
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.updatingItemId = null
        state.error = action.payload as string
      })

      .addCase(removeItemFromCart.pending, (state, action) => {
        state.removingItemId = action.meta.arg
        state.error = null
      })
      .addCase(removeItemFromCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.removingItemId = null
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.removingItemId = null
        state.error = action.payload as string
      })
  },
})

export const { clearCart, clearError } = cartSlice.actions
export default cartSlice.reducer
