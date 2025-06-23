"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { slide, scale } from "../../animation"
import Magnetic from "../../../common/Gsap/Magnetic"

interface LinkProps {
  data: {
    title: string
    href: string
    index: number
  }
  isActive: boolean
  setSelectedIndicator: (href: string) => void
  onClose: () => void
}

export default function LinkComponent({ data, isActive, setSelectedIndicator, onClose }: LinkProps) {
  const { title, href, index } = data
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedIndicator(href)
    onClose() // Close the menu

    // Delay navigation until the menu exit animation finishes
    setTimeout(() => {
      router.push(href)
    }, 300) // Make sure this matches your Framer Motion exit animation time
  }

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className="absolute left-[-30px] h-2.5 w-2.5 rounded-full bg-white"
      />
      <Magnetic>
        <button onClick={handleClick} className="font-light text-white no-underline text-left cursor-pointer">
          {title}
        </button>
      </Magnetic>
    </motion.div>
  )
}
