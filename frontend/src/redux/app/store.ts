import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../shared/auth/authSlice';
import productsReducer from "../product/productSlice"
import userReducer from "../users/userSlice"
import roomReducer from "../rooms/roomSlice"
import cartReducer from "../cart/cartSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product:productsReducer,
    user:userReducer,
    room:roomReducer,
    cart:cartReducer
  },
});

// Export RootState type for TypeScript usage:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
