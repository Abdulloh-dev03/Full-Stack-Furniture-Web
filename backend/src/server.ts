import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/products.routes";
import roomRoutes from "./routes/room.routes";
import cartRoutes from "./routes/cart.routes";


dotenv.config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // cookies/auth support
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/cart", cartRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
});

