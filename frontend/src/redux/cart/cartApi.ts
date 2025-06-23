import { axiosInstance } from "../api/axiosInstance"
import type { CartItemType, AddToCartPayload } from "./cartTypes"

// Fetch cart items by user ID - returns an array of CartItemType
export const getCartByUser = async (userId: number): Promise<CartItemType[]> => {
  const response = await axiosInstance.get(`/cart/${userId}`)
  return response.data.data
}

// Add an item to cart - now supports all item types
export const addToCart = async (payload: AddToCartPayload): Promise<CartItemType> => {
  const response = await axiosInstance.post(`/cart/add`, payload)
  return response.data.data
}

// Update cart item quantity - cartItemId goes in URL
export const updateCartItemQuantity = async (cartItemId: number, quantity: number): Promise<CartItemType> => {
  const response = await axiosInstance.put(`/cart/${cartItemId}`, { quantity })
  return response.data.data
}

// Remove an item from cart by cart item ID
export const removeFromCart = async (cartItemId: number): Promise<void> => {
  await axiosInstance.delete(`/cart/${cartItemId}`)
}
