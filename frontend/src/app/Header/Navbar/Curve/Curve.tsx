"use client"

import { motion, type Variants } from "framer-motion"
import { useEffect, useState } from "react"

export default function Curve() {
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    // Set initial window height
    setWindowHeight(window.innerHeight)

    // Handle window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Don't render until we have window height
  if (windowHeight === 0) {
    return null
  }

  const initialPath = `M100 0 L100 ${windowHeight} Q-100 ${windowHeight / 2} 100 0`
  const targetPath = `M100 0 L100 ${windowHeight} Q100 ${windowHeight / 2} 100 0`

  const curveVariants: Variants = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  }

  return (
    <svg
      className="absolute top-0 left-[-99px] h-full w-[100px] fill-gray-900 stroke-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 100 ${windowHeight}`}
      preserveAspectRatio="none"
    >
      <motion.path variants={curveVariants} initial="initial" animate="enter" exit="exit" />
    </svg>
  )
}
