import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Configs
import dbConnect from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRouters.js";
import productRoute from "./routes/productsRoute.js";
import orderRoute from "./routes/adminOrder.js";
import categoryRouter from "./routes/categoryRoute.js"; // ✅ নিশ্চিত করুন এই ফাইলটি তৈরি করেছেন

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Database & Cloudinary Connection
dbConnect();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/category", categoryRouter); // ✅ নতুন রুট যুক্ত করা হলো


app.get("/", (req, res) => res.send("Digital Shop API is Live 🚀"));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`✅ Server is running on port: ${port}`);
});