import express from "express";
import Order from "../model/orderModel.js";
import { 
  getAllOrders, 
  updateOrderStatus, 
  clientCancelOrder,
  reverseGeocode // ✅ Imported for map location
} from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import { verifyToken } from "../middleware/verifyToken.js"; 

const router = express.Router();

/**
 * @route   GET /api/order/reverse-geocode
 * @desc    Get address details from latitude and longitude (Proxy for Map)
 * @access  Public (Keep it before protected routes)
 */
router.get("/reverse-geocode", reverseGeocode);

/**
 * @route   POST /api/order/create
 * @desc    Create a new order (Client side)
 * @access  Private (User)
 */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(200).json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/order/user/:userId
 * @desc    Get all orders for a specific user
 * @access  Private (User)
 */
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/order/cancel
 * @desc    Cancel an order by the client
 * @access  Private (User)
 */
router.put("/cancel", verifyToken, clientCancelOrder);

/**
 * @route   GET /api/order/
 * @desc    Get all orders for admin dashboard
 * @access  Private (Admin)
 */
router.get("/", adminAuth, getAllOrders);

/**
 * @route   PUT /api/order/
 * @desc    Update order status (e.g., Pending to Shipped)
 * @access  Private (Admin)
 */
router.put("/", adminAuth, updateOrderStatus);

export default router;