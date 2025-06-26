"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchRooms } from "../../redux/rooms/roomSlice"
import { LoadingOutlined } from "@ant-design/icons"
import { message, Spin } from "antd"
import RoundedButton from "../common/RoundedButton/RoundedButton"
import { MdArrowBack, MdArrowForwardIos } from "react-icons/md"
import { FiShoppingCart } from "react-icons/fi"
import { addItemToCart } from "../../redux/cart/cartSlice"
import type { AddToCartPayload } from "../../redux/cart/cartTypes"
import Image from "next/image"

interface RoomCardProps {
  id: number
  title: string
  heading: string
  price: number
  image: string
  formatUSD: (value: number) => string
}

const RoomCard = ({ id, title, heading, price, image, formatUSD }: RoomCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleAddToCart = () => {
    if (!user) {
      message.warning("Please log in to add items to your cart.")
      router.push("/login")
      return
    }

    const roomItem: AddToCartPayload = {
      userId: user.id, // ✅ REQUIRED FIELD
      roomId: id, // ✅ Correct key for room items
      quantity: 1,
    }

    dispatch(addItemToCart(roomItem))
    message.success("Room added to cart!")
  }

  return (
    <div
      className="relative w-[328px] lg:w-[348px] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] h-72">
        <Image
        width={348}
  height={288}
          src={image || "/placeholder.svg?height=288&width=348"}
          alt={title}
          onError={(e) => {
            console.error(`Error loading image: ${image}`)
            e.currentTarget.src = "/placeholder.svg?height=288&width=348"
          }}
          className="w-full h-full object-cover rounded-[1.5rem] block"
        />

        <div className="flex items-center">
          <div
            className={`absolute left-0 right-0 mx-auto bg-white shadow-lg rounded-[1rem] px-8 py-6 transition-all duration-700 ease-in-out z-10 w-[280px] lg:w-[316px] cursor-pointer
              ${isHovered ? "bottom-2 opacity-100 translate-y-0" : "bottom-[-6rem] opacity-0 translate-y-4"}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-mono text-[#262626]">{title}</h3>
                <span className="text-sm lg:text-[0.875rem] mb-1 block text-gray-600">
                  {heading.split(" ").slice(0, 10).join(" ")}
                  {heading.split(" ").length > 10 ? "..." : ""}
                </span>
                <p className="text-sm font-mono text-[#455CE9]">{formatUSD(price)}</p>
              </div>

              <div className="flex flex-col items-center gap-8 my-2">
                <RoundedButton
                  onClick={handleAddToCart}
                  className="p-2 border border-gray-300 text-black hover:text-white"
                >
                  <FiShoppingCart />
                </RoundedButton>
                <RoundedButton
                  onClick={() => router.push(`/rooms/${id}`)}
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
  )
}

export default function RoomsCollection() {
  const dispatch = useAppDispatch()
  const { rooms, loading, error } = useAppSelector((state) => state.room)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchRooms())
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

  if (!rooms || rooms.length === 0) {
    return <p className="text-center mt-10">No rooms found.</p>
  }

  return (
    <div className="container mx-auto">
      <div className="grid place-items-center mx-6 py-20 font-[Poppins] text-gray-600">
        <div className="flex items-center justify-center gap-4 mb-10">
          <RoundedButton onClick={() => router.back()} className="text-black px-2 py-2 shadow-md hover:text-white">
            <MdArrowBack className="text-lg" />
          </RoundedButton>
          <h2 className="text-3xl lg:text-4xl font-mono text-gray-800">Rooms Collection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 justify-items-center">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.title}
              heading={room.heading}
              price={room.price}
              image={room.image}
              formatUSD={formatUSD}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
