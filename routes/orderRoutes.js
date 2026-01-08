import express from "express";
import { 
  getAllOrders, 
  updateOrderStatus, 
  clientCancelOrder, 
  getUserOrders 
} from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";

const orderRoute = express.Router();

// Admin Routes
orderRoute.get("/", adminAuth, getAllOrders);
orderRoute.put("/", adminAuth, updateOrderStatus);

// Client Routes
// ✅ পাথটি 'userorders' এ পরিবর্তন করা হলো যাতে ফ্রন্টএন্ডের সাথে মিলে যায়
orderRoute.get("/userorders", authMiddleware, getUserOrders); 
orderRoute.put("/cancel", authMiddleware, clientCancelOrder);

export default orderRoute;