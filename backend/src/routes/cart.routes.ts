import { Router } from "express"
import {
  addToTheCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity
} from "../controllers/cart.controllers"
import { isAuthenticated } from "../middleware/auth.middleware"

const router = Router()

router.post("/add", isAuthenticated, addToTheCart)
router.get("/:userId", isAuthenticated, getCartItems)
router.delete("/:cartItemId", isAuthenticated, removeFromCart)
router.put("/:cartItemId", isAuthenticated, updateCartItemQuantity)

export default router
