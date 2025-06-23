import express from "express";
import multer from "multer";
import { 
    createProducts, 
    editProducts,
    getAllProducts,
    deleteProducts,
    getProductById
} from "../controllers/product.controllers";
import {isAuthenticated,isAdmin} from '../middleware/auth.middleware'
const router = express.Router();
const upload = multer(); 

router.post("/create",isAuthenticated, isAdmin, upload.single("image"), createProducts);
router.put("/edit/:id",isAuthenticated, isAdmin, upload.single("image"),editProducts)
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteProducts)
router.get("/getall",getAllProducts)
router.get("/get/:id",getProductById)
export default router;
