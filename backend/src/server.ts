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

// Allowlisted origins (update as needed)
const allowedOrigins = [
  "http://localhost:3000",
  "https://full-stack-furniture-web.vercel.app",
  "https://full-stack-furniture-web-git-abdulloh-abdulloh-dev03s-projects.vercel.app",
  "https://full-stack-furniture-4hl2uf85q-abdulloh-dev03s-projects.vercel.app"
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/cart", cartRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Full-Stack Furniture Store Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
});
