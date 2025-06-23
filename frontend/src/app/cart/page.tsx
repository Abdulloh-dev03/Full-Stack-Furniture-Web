"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchCartByUser, updateCartItemQty, removeItemFromCart, clearError } from "../../redux/cart/cartSlice"
import { Minus, Plus, Trash, Loader2 } from "lucide-react"
import { message } from "antd"
import RoundedButton from "../common/RoundedButton/RoundedButton"
import Image from "next/image"

const Cart = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userId = useAppSelector((state) => state.auth.user?.id)
  const { items: cartItems, loading, updatingItemId, removingItemId, error } = useAppSelector((state) => state.cart)

  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartByUser(userId))
    }
  }, [dispatch, userId])

  const handleQuantityChange = (cartItemId: number, quantity: number) => {
    if (quantity >= 1 && updatingItemId !== cartItemId) {
      dispatch(updateCartItemQty({ cartItemId, quantity }))
    }
  }

  const handleRemove = (cartItemId: number) => {
    if (removingItemId !== cartItemId) {
      dispatch(removeItemFromCart(cartItemId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cartItems.map((item) => item.id) : [])
  }

  const handleSelectOne = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const handleDeleteSelected = () => {
    selectedItems.forEach((id) => dispatch(removeItemFromCart(id)))
    setSelectedItems([])
  }

  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const product = item.product || item.room || item.main
      return sum + (product?.price || 0) * item.quantity
    }, 0)

  const handleOrder = () => {
    if (selectedItems.length === 0) return

    selectedItems.forEach((id) => dispatch(removeItemFromCart(id)))
    message.success("Your selected items have been ordered!")
    setSelectedItems([])
  }

  const renderItem = (item: (typeof cartItems)[0]) => {
    const data = item.product || item.room || item.main
    if (!data) return null

    return (
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          className="accent-black cursor-pointer"
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectOne(item.id)}
        />
        <Image
        width={348}
  height={288}
          src={data.image || "/placeholder.svg?height=96&width=96"}
          alt={data.title}
          className="w-24 h-24 object-cover rounded-lg "
        />
        <div className="flex-1">
          <h3 className="text-md font-semibold">{data.title}</h3>
        </div>
      </div>
    )
  }

  if (!userId) {
    return <div className="p-10 text-center text-red-500">Please log in to view your cart.</div>
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={20} />
        Loading your cart...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={() => {
            dispatch(clearError())
            if (userId) dispatch(fetchCartByUser(userId))
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h1 className="text-xl font-semibold mb-4">Your cart is empty.</h1>
        <RoundedButton
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Go to Shopping
        </RoundedButton>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="accent-black cursor-pointer"
            />
            Choose all
          </label>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className="text-red-500 text-sm hover:underline disabled:opacity-50"
          >
            <Trash />
          </button>
        </div>

        {cartItems.map((item) => {
          const data = item.product || item.room || item.main
          const isUpdating = updatingItemId === item.id
          const isRemoving = removingItemId === item.id
          const isDisabled = isUpdating || isRemoving

          return (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row justify-between items-center gap-6 p-5 rounded-2xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200 ${
                isRemoving ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto flex-1">{renderItem(item)}</div>

              <div className="flex items-center gap-4 w-full sm:w-auto flex-shrink-0">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded relative">
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded z-10">
                      <Loader2 className="animate-spin" size={16} />
                    </div>
                  )}
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={isDisabled || item.quantity <= 1}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={isDisabled}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Price */}
                <p className="w-20 text-right font-medium whitespace-nowrap">
                  ${((data?.price || 0) * item.quantity).toFixed(2)}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isRemoving}
                  className="p-1 text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                  title="Remove item"
                >
                  {isRemoving ? <Loader2 className="animate-spin" size={20} /> : <Trash size={20} />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Right: Summary */}
      <div className="border border-gray-300 p-6 rounded-lg shadow-md bg-white h-fit">
        <h3 className="text-lg font-bold mb-4">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg py-4 border-t mt-4">
            <span>Total</span>
            <span>USD ${(selectedItems.length ? subtotal + 0 : 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 border border-gray-300 rounded px-4 py-2 max-h-36 overflow-y-auto text-sm">
          <p className="font-medium mb-1">Selected Items:</p>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500">No items selected</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {cartItems
                .filter((item) => selectedItems.includes(item.id))
                .map((item) => {
                  const data = item.product || item.room || item.main
                  return <li key={item.id}>{data?.title || "Untitled"}</li>
                })}
            </ul>
          )}
        </div>

        <RoundedButton
          onClick={handleOrder}
          className="w-full mt-4 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          disabled={selectedItems.length === 0}
        >
          Order
        </RoundedButton>
      </div>
    </div>
  )
}

export default Cart
