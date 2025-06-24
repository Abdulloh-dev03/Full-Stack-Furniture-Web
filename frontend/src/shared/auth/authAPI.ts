import axios from "axios"
import type { LoginPayload, SignupPayload } from "./authTypes"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Configure axios with token from localStorage
const configureAxios = () => {
  const token = localStorage.getItem("token")

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  axios.defaults.withCredentials = true
}

export const loginAPI = async (payload: LoginPayload) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, payload, {
      withCredentials: true,
    })

    // Set token in axios headers for subsequent requests
    if (res.data.data?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.token}`
    }

    return res.data
  } catch (error) {
    console.error("Login API error:", error)
    throw error
  }
}

export const signupAPI = async (payload: SignupPayload) => {
  const res = await axios.post(`${API_URL}/auth/signup`, payload, {
    withCredentials: true,
  })
  return res.data
}

export const logoutAPI = async () => {
  configureAxios()

  try {
    const res = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    )

    // Clear Authorization header
    delete axios.defaults.headers.common["Authorization"]

    return res.data
  } catch (error) {
    console.error("Logout API error:", error)
    throw error
  }
}


