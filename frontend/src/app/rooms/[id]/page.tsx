"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/app/hook"
import { fetchRooms } from "../../../redux/rooms/roomSlice"
import { message, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import RoundedButton from "../../common/RoundedButton/RoundedButton"
import { MdArrowBack } from "react-icons/md"
import { FiShoppingCart } from "react-icons/fi"
import { LuArrowRight } from "react-icons/lu"
import { addItemToCart } from "../../../redux/cart/cartSlice"
import Image from "next/image"

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)

export default function RoomDetail(){
  const params = useParams()
  const id = params?.id as string
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { rooms, loading, error } = useAppSelector((state) => state.room)
  const { user } = useAppSelector((state) => state.auth)
  const { loading: cartLoading } = useAppSelector((state) => state.cart)

  const isAdding = useRef(false)

  useEffect(() => {
    if (rooms.length === 0) dispatch(fetchRooms())
  }, [dispatch, rooms.length])

  const room = rooms.find((r) => r.id === Number(id))

  const handleAddToCart = async () => {
    if (isAdding.current || cartLoading) return
    if (!user) {
      message.warning("Please log in to add items to your cart.")
      router.push("/login")
      return
    }
    if (!room) {
      message.error("Room not found")
      return
    }
    try {
      isAdding.current = true
      message.loading("Adding to cart...", 1.5)
      await dispatch(
        addItemToCart({
          userId: user.id,
          roomId: room.id,
          quantity: 1,
        }),
      ).unwrap()
      message.success("Item added to cart!")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      message.error("Failed to add item to cart. Please try again.")
    } finally {
      isAdding.current = false
    }
  }

  if (loading || !room) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    )
  }

  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>

  return (
    <div className="container mx-auto">
      <div className="mx-auto flex justify-between my-4 items-center ">
        {/* Back Button */}
        <RoundedButton onClick={() => router.back()} className=" text-black px-2 py-2 shadow-md hover:text-white">
          <MdArrowBack className="text-lg" />
        </RoundedButton>
        <RoundedButton
          onClick={() => router.push("/cart")}
          className="text-black px-3 py-2 border border-gray-300 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <FiShoppingCart className="text-lg" />
            <LuArrowRight className="text-lg" />
          </span>
        </RoundedButton>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-5 font-[Poppins] text-gray-700 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="w-full">
            <Image
            width={348}
  height={288}
              src={room.image || "/placeholder.svg?height=400&width=400"}
              alt={room.title}
              className="rounded-2xl w-full h-[400px] object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=400"
              }}
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{room.heading}</p>
            <div className="text-xl font-semibold text-blue-600 mb-6">{formatUSD(room.price)}</div>
            <RoundedButton
              onClick={handleAddToCart}
              className={`px-6 py-4 border border-gray-400 text-black rounded-full hover:text-white ${
                cartLoading || isAdding.current ? " cursor-not-allowed" : ""
              }`}
              disabled={cartLoading || isAdding.current}
            >
              Add to Cart
            </RoundedButton>
          </div>
        </div>
      </div>
    </div>
  )
}
