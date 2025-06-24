"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchProducts } from "../../redux/product/productSlice" // ✅ updated import
import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import type { Swiper as SwiperClass } from "swiper"
import { Pagination, Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ArrowRight } from "lucide-react"

import "swiper/css"
import "swiper/css/pagination"

export const Main = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { products, loading, error } = useAppSelector((state) => state.product) // ✅ updated selector
  const [, setSwiper] = useState<SwiperClass | null>(null)

  useEffect(() => {
    dispatch(fetchProducts()) // ✅ updated fetch
  }, [dispatch])

  const handleProductClick = (id: string | number) => {
    router.push(`/products/${id}`) // ✅ updated route
  }

if (loading) {
  return (
    <div className="flex justify-center items-center h-[500px]">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}

if (error) {
  return <p className="text-center mt-10 text-red-600">Error loading products: {error}</p>;
}

if (!products) {
  return <p className="text-center mt-10">Loading or no data yet...</p>;
}

if (products.length === 0) {
  return <p className="text-center mt-10">No items found.</p>;
}


  return (
    <div className="relative max-w-7xl mx-auto my-10 h-[600px] max-md:h-[300px]">
      <Swiper
        direction="vertical"
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass:
            "inline-block w-2 h-2 rounded-full bg-gray-300 mx-1 my-1 cursor-pointer transition-all",
          bulletActiveClass: "!bg-orange-300",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
        className="w-full h-full bg-gray-100 rounded-md overflow-hidden"
      >
        {products.map(({ id, image, title, paragraph, price }) => (
          <SwiperSlide key={id} className="relative group cursor-pointer">
            <div className="h-full w-full relative">
              <Image
                width={800}
                height={600}
                src={image || "/placeholder.svg?height=600&width=800"}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                onClick={() => handleProductClick(id)}
                onError={(e) => {
                  console.error(`Failed to load image: ${image}`)
                  e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                }}
              />

              <div
                className="absolute max-md:hidden bottom-8 right-8 bg-gray-100/90 p-6 w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md shadow-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleProductClick(id)
                }}
              >
                <h3 className="text-xl font-medium text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {paragraph.split(" ").length > 8
                    ? paragraph.split(" ").slice(0, 8).join(" ") + "..."
                    : paragraph}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(price)}
                  </p>
                  <ArrowRight className="h-5 w-5 text-gray-800" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Vertical pagination bullets */}
      <div className="custom-pagination absolute top-1/2 right-4 transform -translate-y-1/2 z-10 flex flex-col items-center"></div>

      {/* Features Section */}
      <section className="container mx-auto grid grid-cols-4 max-md:grid-cols-1 max-sm:grid-cols-2 gap-6 mt-10 max-md:hidden">
        <div className="flex items-center space-x-4">
          <Image width={48} height={48} src="/trophy.svg" alt="High Quality" className="w-12 h-12" />
          <span>
            <h3 className="font-semibold text-[16px]">High Quality</h3>
            <p className="text-gray-600 font-medium">crafted from top materials</p>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Image width={48} height={48} src="/guarantee.svg" alt="Warranty Protection" className="w-12 h-12" />
          <span>
            <h3 className="font-semibold text-[16px]">Warranty Protection</h3>
            <p className="text-gray-600 font-medium">Over 2 years</p>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Image width={48} height={48} src="/Vector.svg" alt="Free Shipping" className="w-12 h-12" />
          <span>
            <h3 className="font-semibold text-[16px]">Free Shipping</h3>
            <p className="text-gray-600 font-medium">Order over 150 $</p>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Image width={48} height={48} src="/support.svg" alt="24 / 7 Support" className="w-12 h-12" />
          <span>
            <h3 className="font-semibold text-[16px]">24 / 7 Support</h3>
            <p className="text-gray-600 font-medium">Dedicated support</p>
          </span>
        </div>
      </section>
    </div>
  )
}
