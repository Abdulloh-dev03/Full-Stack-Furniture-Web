"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchProducts } from "../../redux/product/productSlice"
import { Spin, message } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import RoundedButton from "../common/RoundedButton/RoundedButton"
import { MdArrowBack, MdArrowForwardIos } from "react-icons/md"
import { FiShoppingCart } from "react-icons/fi"
import { addItemToCart } from "../../redux/cart/cartSlice"
import React from "react"
import Image from "next/image"

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)

export default function MoreProducts() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { products, loading, error } = useAppSelector((state) => state.product)

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts())
  }, [dispatch, products.length])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    )
  }

  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>
  if (!products || products.length === 0) return <p className="text-center mt-10">No items found.</p>

  return (
    <div className="container mx-auto">
      <div className="grid place-items-center mx-6 py-20 font-[Poppins] text-gray-600">
        <div className="flex items-center justify-center gap-4 mb-10">
          <RoundedButton onClick={() => router.back()} className="text-black px-2 py-2 shadow-md hover:text-white">
            <MdArrowBack className="text-lg" />
          </RoundedButton>
          <h2 className="text-3xl lg:text-4xl font-mono text-gray-800">All Products</h2>
        </div>

        <div className="px-10 grid grid-cols-3 gap-14 max-sm:grid-cols-1 max-md:grid-cols-1 max-xl:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} formatUSD={formatUSD} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface Product {
  id: number
  title: string
  paragraph: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
  formatUSD: (value: number) => string
}

const ProductCard = ({ product, formatUSD }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const { loading: cartLoading } = useAppSelector((state) => state.cart)

  const [isHovered, setIsHovered] = React.useState(false)
  const isAdding = React.useRef(false)

  const handleAddToCart = async () => {
    if (isAdding.current || cartLoading) return

    if (!user) {
      message.warning("Please log in to add items to your cart.")
      router.push("/login")
      return
    }

    if (!product) {
      message.error("Product not found")
      return
    }

    try {
      isAdding.current = true
      message.loading("Adding to cart...", 1)

      await dispatch(
        addItemToCart({
          userId: user.id,
          productId: product.id,
          quantity: 1,
        }),
      ).unwrap()

      message.success("Product added to cart!")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      message.error("Failed to add item to cart. Please try again.")
    } finally {
      isAdding.current = false
    }
  }

  return (
    <div>
      <div
        className="relative max-xl:w-[310px] lg:w-[348px] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[1.5rem] h-72">
          <Image
          width={348}
  height={288}
            src={product.image || "/placeholder.svg?height=288&width=348"}
            alt={product.title}
            onError={(e) => (e.currentTarget.src = "/placeholder.svg?height=288&width=348")}
            className="w-full h-full object-cover rounded-[1.5rem] block"
          />

          <div className="flex items-center">
            <div
              className={`absolute left-0 right-0 mx-auto bg-white shadow-lg rounded-[1rem] px-8 py-6 transition-all duration-700 ease-in-out z-10 w-[280px] lg:w-[316px] cursor-pointer
              ${isHovered ? "bottom-2 opacity-100 translate-y-0" : "bottom-[-6rem] opacity-0 translate-y-4"}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-mono text-[#262626]">{product.title}</h3>
                  <span className="text-sm lg:text-[0.875rem] mb-1 block text-gray-600">
                    {product.paragraph.split(" ").slice(0, 10).join(" ")}
                    {product.paragraph.split(" ").length > 10 ? "..." : ""}
                  </span>
                  <p className="text-sm font-mono text-[#455CE9]">{formatUSD(product.price)}</p>
                </div>

                <div className="flex flex-col items-center gap-8 my-2">
                  <RoundedButton
                    onClick={handleAddToCart}
                    className={`p-2 border border-gray-300 text-black hover:text-white ${
                      cartLoading || isAdding.current ? " cursor-not-allowed" : ""
                    }`}
                    disabled={cartLoading || isAdding.current}
                  >
                    <FiShoppingCart />
                  </RoundedButton>
                  <RoundedButton
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="p-2 border border-gray-300 text-black hover:text-white"
                  >
                    <MdArrowForwardIos />
                  </RoundedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
