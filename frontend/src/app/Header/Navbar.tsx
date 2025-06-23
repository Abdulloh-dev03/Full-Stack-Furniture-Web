"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useAppSelector } from "../../redux/app/hook"
import { AnimatePresence, motion } from "framer-motion"
import { message } from "antd"
import { MenuIcon } from "lucide-react"
import Magnetic from "../common/Gsap/Magnetic"
import RoundedButton from "../common/RoundedButton/RoundedButton"
import Menu from "./Navbar/Menu"
import Image from "next/image"
import { useRouter } from "next/navigation"

export const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showScrollMenuBar, setShowScrollMenuBar] = useState(false)

  // Ref to track if open requested during closing
  const pendingOpen = useRef(false)

  const openMenu = () => {
    if (isClosing) {
      // Queue open after close animation
      pendingOpen.current = true
      return
    }
    setIsMenuOpen(true)
  }

  const closeMenuWithDelay = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsMenuOpen(false)
      setIsClosing(false)
      if (pendingOpen.current) {
        pendingOpen.current = false
        setIsMenuOpen(true) // Open menu now after close finished
      }
    }, 300)
  }

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      const tipKey = `hasSeenMenuTip:${user.email}`

      const hasSeen = localStorage.getItem(tipKey)
      if (!hasSeen) {
        message.info("Click your profile picture to open the menu.")
        localStorage.setItem(tipKey, "true")
      }
    }
  }, [user])

  // Scroll listener to toggle scroll menu bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollMenuBar(true)
      } else {
        setShowScrollMenuBar(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

const handleAdminPanel = () => {
  router.push("/admin")
}


  return (
    <>
          <div className="container mx-auto">
            <nav className="text-[#1E1E1E] flex items-center justify-between py-4 px-6">
              <Magnetic>
                <h1 className="text-2xl">
                  <Link href="/">Funiro.</Link>
                </h1>
              </Magnetic>
    
              <div className="flex items-center gap-8">
                {user?.role === "ADMIN" && (
                  <RoundedButton
                    onClick={handleAdminPanel}
                    className="text-[15px] px-3 py-4 rounded-full hover:text-white border border-gray-300 max-md:hidden max-sm:hidden"
                  >
                    Admin Panel
                  </RoundedButton>
                )}
    
                {user ? (
                  <Magnetic>
                    <Image
                      width={56}
                      height={56}
                      src={user.profilePic || "/placeholder.svg"}
                      className="w-15 h-15 rounded-full object-cover cursor-pointer"
                      alt="Profile"
                      onClick={openMenu}
                      title="Click to Open Menu"
                    />
                  </Magnetic>
                ) : (
                  <>
                    <RoundedButton className="text-[15px] px-3 py-2 rounded-full hover:text-white border border-gray-300">
                      <Link href="/signup">SignUp</Link>
                    </RoundedButton>
                    <RoundedButton className="text-[15px] px-3 py-2 rounded-full hover:text-white border border-gray-300">
                      <Link href="/login">SignIn</Link>
                    </RoundedButton>
                  </>
                )}
              </div>
            </nav>
          </div>
    
          {/* Scroll triggered fixed menu bar */}
          <AnimatePresence>
            {showScrollMenuBar && user && !isMenuOpen && !isClosing && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="fixed top-2 right-4 z-50"
              >
                  <RoundedButton
                    onClick={openMenu}
                    title="Open Menu"
                    className="px-4 py-4 bg-[#1c1d20] text-white"
                  >
                    <MenuIcon size={24} />
                  </RoundedButton>
              </motion.div>
            )}
          </AnimatePresence>
    
          {/* Original menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <Menu
                onCloseAction={closeMenuWithDelay}
                isClosing={isClosing}
              />
            )}
          </AnimatePresence>
        </>
  )
}
