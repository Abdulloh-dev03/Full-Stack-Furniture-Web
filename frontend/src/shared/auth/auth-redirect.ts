import type { User } from "./authTypes"

/**
 * Get the redirect URL after login based on user role
 * Now everyone stays on client app at "/"
 */
export const getRedirectUrl = (user: User | null): string => {
  if (!user) return "/"

  // Everyone stays in client app for now
  return "/"
}

/**
 * Handle redirect after login based on user role
 * @param user User object
 * @param navigate React Router navigate function (optional)
 */
export const handleRoleRedirect = (user: User | null, navigate?: (path: string) => void): void => {
  const redirectUrl = getRedirectUrl(user)

  // Save admin flag and user info for UI logic
  if (user?.role === "ADMIN") {
    localStorage.setItem("isAdmin", "true")
  } else {
    localStorage.removeItem("isAdmin")
  }

  if (user) {
    localStorage.setItem("authUser", JSON.stringify(user))
  }

  // Use React Router navigate if available
  if (navigate) {
    navigate(redirectUrl)
  } else {
    // Fallback for direct window location
    window.location.href = redirectUrl
  }
}

/**
 * Check if current user is admin (from localStorage or user object)
 */
export const isAdminUser = (user: User | null): boolean => {
  if (user) return user.role === "ADMIN"

  // fallback check in localStorage
  return localStorage.getItem("isAdmin") === "true"
}
