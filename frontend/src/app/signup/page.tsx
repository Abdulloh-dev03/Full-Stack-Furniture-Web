"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { message } from "antd"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { signupUser, resetAuthState } from "../../shared/auth/authSlice"
import type { Gender } from "../../shared/auth/authTypes"

const SignUp = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error, success } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (success) {
      message.success("Signup successful! Redirecting...")
      setTimeout(() => {
        dispatch(resetAuthState())
        router.push("/login")
      }, 1500)
    }
  }, [success, router, dispatch])

  useEffect(() => {
    if (error) message.error(error)
  }, [error])

  const togglePassword = () => setShowPassword(!showPassword)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.gender) {
      message.error("Please fill in all fields.")
      return
    }

    dispatch(signupUser({ ...formData, gender: formData.gender as Gender, profilePic: "" }))
  }

  return (
    <div className="auth bg-gradient-to-br from-[#f6f1ed] to-[#e1ebe2] min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1d2939]">Create an Account</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455CE9] focus:border-transparent transition-all"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455CE9] focus:border-transparent transition-all"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#455CE9] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#455CE9] transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm text-gray-700">Gender</label>
            <div className="flex gap-6">
              {["male", "female"].map((gender) => (
                <label key={gender} className="flex items-center gap-2 text-gray-700 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="accent-[#455CE9] cursor-pointer"
                  />
                  <span className="capitalize">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white text-lg rounded-lg transition-all cursor-pointer ${
              loading ? "bg-[#455CE9]/70 cursor-not-allowed" : "bg-[#455CE9] hover:bg-[#455CE9]/90"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#455CE9] font-medium hover:underline">
              SignIn
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default SignUp
