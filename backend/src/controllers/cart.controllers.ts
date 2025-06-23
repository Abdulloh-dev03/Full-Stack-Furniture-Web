import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import Send from "../utils/response"

const prisma = new PrismaClient()

export const addToTheCart = async (req: Request, res: Response) => {
  const { userId, productId, roomId, mainId, quantity } = req.body
  const qty = Number(quantity) || 1

  if (!userId) return Send.error(res, null, "User ID is required")
  if (!productId && !roomId && !mainId) {
    return Send.error(res, null, "At least one item ID is required (productId, roomId, or mainId)")
  }

  try {
    let cart = await prisma.cart.findUnique({ where: { userId: Number(userId) } })
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: Number(userId) } })
    }

    const itemIdentifier = productId
      ? { productId: Number(productId) }
      : roomId
        ? { roomId: Number(roomId) }
        : { mainId: Number(mainId) }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, ...itemIdentifier },
    })

    if (existingCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + qty },
        include: {
          product: true,
          room: true,
        },
      })
      return Send.success(res, updatedCartItem, "Quantity updated")
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        quantity: qty,
        ...(productId ? { productId: Number(productId) } : {}),
        ...(roomId ? { roomId: Number(roomId) } : {}),
        ...(mainId ? { mainId: Number(mainId) } : {}),
      },
      include: {
        product: true,
        room: true,
      },
    })

    return Send.success(res, cartItem, "Item added to cart")
  } catch (error: any) {
    console.log(error)
    return Send.error(res, null, error.message)
  }
}

export const getCartItems = async (req: Request, res: Response) => {
  const { userId } = req.params
  const parsedUserId = Number(userId)

  if (isNaN(parsedUserId)) {
    return Send.error(res, null, "Invalid user ID format")
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: parsedUserId } })

    if (!cart) return Send.success(res, [], "Cart is empty")

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: true,
        room: true,
      },
    })

    return Send.success(res, cartItems, "Cart items fetched")
  } catch (error: any) {
    console.log(error)
    return Send.error(res, null, error.message)
  }
}

export const removeFromCart = async (req: Request, res: Response) => {
  const { cartItemId } = req.params
  const parsedCartItemId = Number(cartItemId)

  if (isNaN(parsedCartItemId)) {
    return Send.error(res, null, "Invalid cart item ID format")
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id: parsedCartItemId } })

    if (!cartItem) return Send.error(res, null, "Cart item not found")

    await prisma.cartItem.delete({ where: { id: parsedCartItemId } })

    return Send.success(res, null, "Item removed from cart")
  } catch (error: any) {
    console.log(error)
    return Send.error(res, null, error.message)
  }
}

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { cartItemId } = req.params // ✅ Get from params, not body
  const { quantity } = req.body

  const qty = Number(quantity)
  const parsedCartItemId = Number(cartItemId)

  if (isNaN(qty) || qty < 1) {
    return Send.error(res, null, "Invalid quantity. Must be a positive number.")
  }

  if (isNaN(parsedCartItemId)) {
    return Send.error(res, null, "Invalid cart item ID format")
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id: parsedCartItemId } })
    if (!cartItem) return Send.error(res, null, "Cart item not found")

    const updated = await prisma.cartItem.update({
      where: { id: parsedCartItemId },
      data: { quantity: qty },
      include: {
        product: true,
        room: true,
      },
    })

    return Send.success(res, updated, "Quantity updated")
  } catch (error: any) {
    console.log(error)
    return Send.error(res, null, error.message)
  }
}
