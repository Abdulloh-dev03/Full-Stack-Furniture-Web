import { Router } from "express"
import { Signup, Login, Logout,getAllUsers } from "../controllers/auth.controllers"
import { isAuthenticated } from "../middleware/auth.middleware"
const router = Router()

router.post("/signup", Signup)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/users",isAuthenticated,getAllUsers)
export default router
