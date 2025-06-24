"use client"

import { useEffect, useRef, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { fetchRooms } from "../../redux/rooms/roomSlice"
import { fetchProducts } from "../../redux/product/productSlice"
import { motion, useAnimation } from "framer-motion"
import Image from "next/image"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
const CenteredBentoGrid = () => {
  const dispatch = useAppDispatch()
  const { rooms } = useAppSelector((state) => state.room)
  const { products } = useAppSelector((state) => state.product)

  const controls = useAnimation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchRooms())
    dispatch(fetchProducts())
  }, [dispatch])

  const bentoGroups = useMemo(() => {
    const safeRooms = Array.isArray(rooms) ? rooms : []
    const safeProducts = Array.isArray(products) ? products : []

    const combined = [...safeRooms, ...safeProducts]
    const groups = []

    for (let i = 0; i <= combined.length - 5; i += 5) {
      groups.push(combined.slice(i, i + 5))
    }

    return groups
  }, [ rooms, products])

  // Animate infinite scroll
  useEffect(() => {
    const animateScroll = async () => {
      const container = scrollRef.current
      if (!container) return

      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth
      const distance = scrollWidth - clientWidth

      while (true) {
        await controls.start({
          x: -distance,
          transition: { duration: 30, ease: "linear" },
        })
        await controls.set({ x: 0 })
      }
    }

    if (bentoGroups.length > 0) animateScroll()
  }, [bentoGroups, controls])

 if (bentoGroups.length === 0) {
  return (
    <div className="flex justify-center items-center h-[500px]">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  )
}

  return (
    <div>
      <div className="text-center">
        <p className="text-gray-600">Share your setup with </p>
        <h1 className="text-3xl">#FuniroFurniture</h1>
      </div>
      <div className="overflow-hidden py-10 px-4 max-md:overflow-hidden">
        <motion.div ref={scrollRef} className="flex w-fit gap-10" animate={controls} initial={{ x: 0 }}>
          {bentoGroups.map((group, index) => {
            const [left1, left2, center, right1, right2] = group
            return (
              <div key={index} className="grid grid-cols-5 gap-4 w-full max-w-7xl flex-shrink-0">
                {/* Left 2 */}
                <div className="flex flex-col gap-4">
                  {[left1, left2].map((item, idx) => (
                    <Image
                    width={348}
  height={288}
                      key={idx}
                      src={item?.image || "/placeholder.svg?height=200&width=200"}
                      alt={`left-${idx}`}
                      className="w-full h-[200px] object-cover rounded-2xl shadow max-md:h-[100px] max-md:w-full"
                    />
                  ))}
                </div>

                {/* Center */}
                <div className="col-span-3 flex justify-center items-center">
                  <Image
                  width={348}
  height={288}
                    src={center?.image || "/placeholder.svg?height=420&width=600"}
                    alt="center"
                    className="w-full h-[420px] object-cover rounded-2xl shadow max-md:h-[210px] max-md:w-full"
                  />
                </div>

                {/* Right 2 */}
                <div className="flex flex-col gap-4">
                  {[right1, right2].map((item, idx) => (
                    <Image
                    width={348}
  height={288}
                      key={idx}
                      src={item?.image || "/placeholder.svg?height=200&width=200"}
                      alt={`right-${idx}`}
                      className="w-full h-[200px] max-md:h-[100px] object-cover rounded-2xl shadow max-md:w-full"
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default CenteredBentoGrid
