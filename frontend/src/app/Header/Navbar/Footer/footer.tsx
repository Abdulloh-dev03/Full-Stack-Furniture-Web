"use client"

import { MdLogout } from "react-icons/md"
import { useRouter } from "next/navigation"
import RoundedButton from "../../../common/RoundedButton/RoundedButton"
import { useAppDispatch } from "../../../../redux/app/hook"
import { logoutUser } from "../../../../shared/auth/authSlice"

export default function Footer({ onCloseAction }: { onCloseAction: () => void }) {

  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    const result = await dispatch(logoutUser())
    if (logoutUser.fulfilled.match(result)) {
      onCloseAction() // Close the menu here
      router.push("/") // redirect after logout
    }
  }

  return (
    <div className="mb-20 max-md:mb-40 max-xl:mb-20">
      <RoundedButton onClick={handleLogout} className="px-2 py-2 rounded-full border border-gray-600">
        <span className="flex items-center gap-2 text-2xl font-mono">
          Logout <MdLogout />
        </span>
      </RoundedButton>
    </div>
  )
}
