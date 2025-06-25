// src/middleware/isAdmin.ts
import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import Send from "../utils/response"

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string } // Add id property here
    }
  }
}

// ✅ isAuthenticated Middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies.authToken ||
    req.headers.authorization?.split(" ")[1]

  if (!token) {
    Send.unauthorized(res, null, "You must be logged in")
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    if (typeof decoded === "object" && "role" in decoded && "id" in decoded) {
      req.user = decoded as { id: string; role: string }
    } else {
      Send.unauthorized(res, null, "Invalid token payload")
      return
    }

    next()
  } catch (error) {
    Send.unauthorized(res, null, "Invalid or expired token")
  }
}


// ✅ isAdmin Middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user

  if (!user || user.role !== "ADMIN") {
    Send.forbidden(res, null, "Admin access only")
    return
  }

  next()
}
