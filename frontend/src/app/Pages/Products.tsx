"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchProducts } from "../../redux/product/productSlice"
import { addItemToCart } from "../../redux/cart/cartSlice"
import { message, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import RoundedButton from "../common/RoundedButton/RoundedButton"
import { MdArrowForwardIos } from "react-icons/md"
import { FiShoppingCart } from "react-icons/fi"
import Image from "next/image"

export const Products = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { products, loading, error } = useAppSelector((state) => state.product)
  const [visibleCount] = useState(6)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)

 if (loading) {
  return (
    <div className="flex justify-center items-center h-[500px]">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  )
}

if (error) {
  return <p className="text-center mt-10 text-red-600">Error: {error}</p>
}

if (!products) {
  return <p className="text-center mt-10">Loading or data not ready...</p>
}

if (products.length === 0) {
  return <p className="text-center mt-10">No items found.</p>
}


  const slicedProducts = products.slice(0, visibleCount)

  return (
    <div className="container mx-auto">
      <div className="grid place-items-center mx-6 py-20 font-[Poppins] text-gray-600">
        <h2 className="text-3xl lg:text-4xl text-center my-10 max-sm:my-4 max-md:my-6 font-mono text-gray-800">
          Our Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 justify-items-center">
          {slicedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              paragraph={product.paragraph}
              price={product.price}
              image={product.image}
              formatUSD={formatUSD}
            />
          ))}
        </div>

        {products.length > visibleCount && (
          <RoundedButton
            onClick={() => router.push("/products")}
            className="mt-10 px-6 py-5 font-mono border border-gray-300 text-black transition-all duration-300 rounded-full hover:text-white"
          >
            Show More
          </RoundedButton>
        )}
      </div>
    </div>
  )
}

interface ProductCardProps {
  id: number
  title: string
  paragraph: string
  price: number
  image: string
  formatUSD: (value: number) => string
}

const ProductCard = ({ id, title, paragraph, price, image, formatUSD }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Please log in to add items to your cart.")
      router.push("/login")
      return
    }

    setAddingToCart(true)
    message.loading("Adding to cart...", 1)

    try {
      await dispatch(
        addItemToCart({
          userId: user.id,
          productId: id,
          quantity: 1,
        }),
      ).unwrap()
      message.success("Product added to cart!")
    } catch {
      message.error("Failed to add item to cart.")
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div>
      <div
        className="relative w-[348px] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[1.5rem] h-72">
  <Image
  src={image || "/placeholder.svg?height=288&width=348"}
  alt={title}
  width={348}
  height={288}
  onError={(e) => {
    console.error(`Error loading image: ${image}`)
    e.currentTarget.src = "/placeholder.svg?height=288&width=348"
  }}
  className="w-full h-full object-cover rounded-[1.5rem] block"
/>



          <div className="flex items-center">
            <div
              className={`absolute left-0 right-0 mx-auto bg-white shadow-lg rounded-[1rem] px-8 py-6 transition-all duration-700 ease-in-out z-10 w-[280px] lg:w-[316px] cursor-pointer
                ${isHovered ? "bottom-4 opacity-100 translate-y-0" : "bottom-[-6rem] opacity-0 translate-y-4"}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-mono text-[#262626] mb-3">{title}</h3>
                  <span className="text-sm lg:text-[0.875rem] mb-1 block text-gray-600">
                    {paragraph.split(" ").slice(0, 10).join(" ")}
                    {paragraph.split(" ").length > 10 ? "..." : ""}
                  </span>
                  <p className="text-sm lg:text-[0.875rem] font-mono text-[#455CE9]">{formatUSD(price)}</p>
                </div>

                <div className="flex flex-col items-center gap-8 my-2">
                  <RoundedButton
                    onClick={handleAddToCart}
                    className="p-2 border border-gray-300 text-black hover:text-white flex items-center justify-center"
                    disabled={addingToCart}
                  >
                    <FiShoppingCart />
                  </RoundedButton>
                  <RoundedButton
                    onClick={() => router.push(`/products/${id}`)}
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
