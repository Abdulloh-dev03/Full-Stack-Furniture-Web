import { Router } from "express";
import { createRoom,editRoom,deleteRoom,getAllRoom,getRoomById } from "../controllers/room.controllers";
import {isAuthenticated,isAdmin} from '../middleware/auth.middleware'
import multer from "multer";
const router = Router();
const upload = multer(); 

router.post("/create",isAuthenticated,isAdmin,upload.single("image"),createRoom)
router.put("/edit/:id",isAuthenticated,isAdmin,upload.single("image"),editRoom)
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteRoom)
router.get("/getall",getAllRoom)
router.get("/get/:id",getRoomById)

export default router