"use client"

import RoundedButton from "../common/RoundedButton/RoundedButton"
import { fetchRooms } from "../../redux/rooms/roomSlice"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { LoadingOutlined } from "@ant-design/icons"
import { message, Spin } from "antd"
import { FiShoppingCart } from "react-icons/fi"
import { MdArrowForwardIos } from "react-icons/md"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import type { AddToCartPayload } from "../../redux/cart/cartTypes"
import { addItemToCart } from "../../redux/cart/cartSlice"
import Image from "next/image"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

export default function Rooms() {
  const dispatch = useAppDispatch()
  const { rooms, loading, error } = useAppSelector((state) => state.room)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

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

if (!rooms) {
  return <p className="text-center mt-10">Loading or data not ready...</p>
}

if (rooms.length === 0) {
  return <p className="text-center mt-10">No items found.</p>
}


  return (
    <div className=" py-16">
      <div className="container mx-auto px-10 flex flex-col lg:flex-row items-start justify-between gap-10">
        {/* Text section */}
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-6">50+ Beautiful rooms inspiration</h2>
          <p className="text-gray-500 text-[16px] mb-10">
            Our designer already made a lot of beautiful prototype of rooms that inspire you
          </p>
          <RoundedButton
            onClick={() => router.push("/rooms")}
            className="text-black rounded-full px-6 py-3 border border-gray-300 hover:text-white"
          >
            Explore Now
          </RoundedButton>
        </div>

        {/* Swiper section */}
        <div className="relative w-full lg:w-[70%] max-sm:w-full">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            navigation={{
              nextEl: ".custom-next",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1, // small screens
              },
              768: {
                slidesPerView: 1, // medium screens
              },
              1024: {
                slidesPerView: 2, // large and above
              },
            }}
            className="rooms-swiper"
          >
            {rooms.map((room) => (
              <SwiperSlide key={room.id}>
                <RoomsCard id={room.id} title={room.title} heading={room.heading} image={room.image} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right navigation button (optional hide on small screens) */}
          <div className="custom-next absolute top-1/2 right-[-1rem] z-10 transform -translate-y-1/2 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer max-sm:hidden">
            <MdArrowForwardIos />
          </div>
        </div>
      </div>
    </div>
  )
}

interface RoomsCardProps {
  id: number
  title: string
  heading: string
  image: string
}

const RoomsCard = ({ id, title, heading, image }: RoomsCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
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
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] h-[400px] max-md:h-[450px]">
        <Image
        width={348}
  height={288}
          src={image || "/placeholder.svg?height=400&width=600"}
          alt={title}
          onError={(e) => {
            console.error(`Error loading image: ${image}`)
            e.currentTarget.src = "/placeholder.svg?height=400&width=600"
          }}
          className="w-full h-full object-cover rounded-[1.5rem] block"
        />

        <div
          className={`absolute left-0 right-0 mx-auto bg-white shadow-lg rounded-[1rem] px-8 py-6 transition-all duration-700 ease-in-out z-10 w-[280px] max-lg:w-[316px] max-md:w-[250px] cursor-pointer ${
            isHovered ? "bottom-4 opacity-100 translate-y-0" : "bottom-[-6rem] opacity-0 translate-y-4"
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl lg:text-2xl font-mono text-[#262626] mb-3">{title}</h3>
              <span className="text-sm lg:text-[0.875rem] mb-1 block text-gray-600">
                {heading.split(" ").slice(0, 10).join(" ")}
                {heading.split(" ").length > 10 ? "..." : ""}
              </span>
            </div>
            <div className="flex flex-col items-center gap-6 my-2">
              <RoundedButton
                onClick={handleAddToCart}
                className="p-2 border border-gray-300 text-black hover:text-white"
              >
                <FiShoppingCart />
              </RoundedButton>
              <RoundedButton
                className="p-2 border border-gray-300 text-black hover:text-white"
                onClick={() => router.push(`/rooms/${id}`)}
              >
                <MdArrowForwardIos />
              </RoundedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
