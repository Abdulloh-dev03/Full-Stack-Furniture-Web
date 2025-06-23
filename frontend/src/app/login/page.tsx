"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { message } from "antd"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { loginUser, clearAuthError } from "../../shared/auth/authSlice"
import { handleRoleRedirect } from "../../shared/auth/auth-redirect"

const Login = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { loading, user, success, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    dispatch(clearAuthError()) // Clear previous errors when component mounts
  }, [dispatch])

  useEffect(() => {
    const alreadyRedirected = sessionStorage.getItem("adminRedirected")

    if (user && success) {
      message.success("Login successful!")

      if (!alreadyRedirected) {
        handleRoleRedirect(user)
      } else {
        sessionStorage.removeItem("adminRedirected")
      }
    }

    if (error) {
      message.error(error)
    }
  }, [user, success, error, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      message.error("Please fill in all fields.")
      return
    }

    dispatch(loginUser(formData))
  }

  return (
    <div className="auth bg-gradient-to-br from-[#f6f1ed] to-[#e1ebe2] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1d2939]">Welcome Back</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#455CE9] transition-colors cursor-pointer"
              onClick={togglePassword}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white text-lg rounded-lg transition-all cursor-pointer ${
              loading ? "bg-[#455CE9]/70 cursor-not-allowed" : "bg-[#455CE9] hover:bg-[#455CE9]/90"
            }`}
          >
            {loading ? "Signing in..." : "SignIn"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#455CE9] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
