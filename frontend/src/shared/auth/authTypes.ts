// features/auth/authTypes.ts

export type Gender = "male" | "female" // adjust to your enum values
export type Role = "USER" | "ADMIN" // same here

// 👤 This reflects your Prisma User model
export interface User {
  token: boolean
  id: number
  name: string
  email: string
  gender?: Gender
  profilePic?: string
  role: Role
}

// 🧾 Backend response structure for auth
export interface AuthResponse {
  user: User
  token: string
}

// 📩 Request payloads
export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  gender: Gender
  profilePic: string
}

// 🧠 Redux state structure
export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  success: boolean
  isInitialized: boolean // Added to track initialization status
}
