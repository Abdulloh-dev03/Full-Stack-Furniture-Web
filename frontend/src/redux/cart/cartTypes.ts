export type CartItemType = {
  id: number
  quantity: number
  cartId: number
  productId?: number
  roomId?: number
  mainId?: number
  product?: {
    id: number
    title: string
    price: number
    image: string
    paragraph: string
  }
  room?: {
    id: number
    title: string
    heading: string
    image: string
    price: number
  }
  main?: {
    id: number
    image: string
    title: string
    paragraph: string
    price: number
  }
}

export type AddToCartPayload = {
  userId: number
  productId?: number
  roomId?: number
  mainId?: number
  quantity?: number
}

export type UpdateQuantityPayload = {
  cartItemId: number
  quantity: number
}
