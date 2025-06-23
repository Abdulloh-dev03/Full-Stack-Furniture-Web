import type { Request, Response } from "express"
import prisma from "../db/prisma"
import bcrypt from "bcryptjs"
import accessToken from "../utils/generateToken"
import Send from "../utils/response"
export const Signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, gender } = req.body

    // 1. Validate input
    if (!name || !email || !password || !gender) {
      return Send.error(res, null, "Please fill all the fields.")
    }

    // 2. Check if user already exists
    const existinguser = await prisma.user.findUnique({ where: { email } })
    if (existinguser) {
      return Send.error(res, null, "Email already exists.")
    }

    // 3. Validate gender
    if (gender !== "male" && gender !== "female") {
      return Send.error(res, null, "Gender must be either 'male' or 'female'.")
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
const seed = encodeURIComponent(name);

let profilePic;

if (gender === "male") {
  // For male: blueish background
  profilePic = `https://ui-avatars.com/api/?name=${seed}&background=007BFF&color=fff&rounded=true`;
} else if (gender === "female") {
  // For female: pinkish background
  profilePic = `https://ui-avatars.com/api/?name=${seed}&background=E91E63&color=fff&rounded=true`;
} else {
  // Default: random background
  profilePic = `https://ui-avatars.com/api/?name=${seed}&background=random&rounded=true`;
}


 


    // 6. Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        profilePic,
        role: "USER",
      },
    })

    // 7. Generate token
    const token = accessToken({ id: newUser.id.toString(), role: newUser.role }, res)

    // 8. Return success response
    return Send.success(
      res,
      {
        token,
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        profile: newUser.profilePic,
      },
      "User created successfully."
    )
  } catch (error) {
    console.error(error)
    return Send.error(res, null, "Registration failed.")
  }
}

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return Send.error(res, null, "Please fill all the fields.")
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return Send.error(res, null, "Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return Send.error(res, null, "Invalid email or password.")
    }

    const token = accessToken({ id: user.id.toString(), role: user.role }, res)

    return Send.success(
      res,
      {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role, // ✅ used by frontend to redirect
      },
      "Login successfully.",
    )
  } catch (error) {
    console.error("Error logging in:", error)
    return Send.error(res, null, "Login failed")
  }
}

// Add these new functions

export const Logout = async (_req: Request, res: Response) => {
  try {
    // Clear the auth cookie with the correct name
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })

    return Send.success(res, null, "Logged out successfully")
  } catch (error) {
    console.error("Error logging out:", error)
    return Send.error(res, null, "Logout failed")
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    return Send.success(res, { users });
  } catch (error) {
    console.error(error);
    return Send.error(res, null, "Failed to fetch users");
  }
};


