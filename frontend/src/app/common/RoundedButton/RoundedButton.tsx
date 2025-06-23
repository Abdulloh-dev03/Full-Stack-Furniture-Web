import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import Magnetic from "../Gsap/Magnetic"

type RoundedButtonProps = {
  children: React.ReactNode
  backgroundColor?: string
  className?: string
  disabled?: boolean // ✅ Add this line
} & React.HTMLAttributes<HTMLDivElement>


export default function RoundedButton({
  children,
  backgroundColor = "#455CE9",
  className = "",
  ...props
}: RoundedButtonProps) {
  const circleRef = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  let timeoutId: NodeJS.Timeout | null = null

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true })
    timeline.current
      .to(
        circleRef.current,
        {
          top: "-25%",
          width: "150%",
          duration: 0.4,
          ease: "power3.in",
        },
        "enter"
      )
      .to(
        circleRef.current,
        {
          top: "-150%",
          width: "125%",
          duration: 0.25,
        },
        "exit"
      )
  }, [])

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeline.current?.tweenFromTo("enter", "exit")
  }

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play()
    }, 300)
  }

  return (
    <Magnetic>
      <div
        className={`relative inline-flex items-center justify-center  rounded-full cursor-pointer overflow-hidden transition-colors  duration-300 ${className}`}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...props}
      >
        <span className="relative z-10 transition-colors duration-300 hover:text-white">

          {children}
        </span>
        <div
          ref={circleRef}
          style={{ backgroundColor }}
          className="absolute top-full w-full h-[150%] rounded-full z-0"
        />
      </div>
    </Magnetic>
  )
}
