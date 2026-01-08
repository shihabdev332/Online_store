import Order from "../model/orderModel.js";
import axios from "axios";

// ✅ ১. ম্যাপের লোকেশন থেকে অ্যাড্রেস বের করা (Reverse Geocoding)
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        message: "অক্ষাংশ (Latitude) এবং দ্রাঘিমাংশ (Longitude) প্রয়োজন।" 
      });
    }

    // Nominatim API Policy অনুযায়ী User-Agent হেডার পাঠানো বাধ্যতামূলক
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`,
      {
        headers: {
          "User-Agent": "DigitalShop_Server/1.0", 
        },
      }
    );

    if (response.data) {
      res.json(response.data);
    } else {
      res.json({ success: false, message: "লোকেশন খুঁজে পাওয়া যায়নি।" });
    }
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "সার্ভার থেকে লোকেশন আনতে সমস্যা হয়েছে।" 
    });
  }
};

// ✅ ২. সব অর্ডার দেখা (Admin Only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ ৩. ইউজারের নিজস্ব অর্ডার দেখা (Client)
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID প্রয়োজন।" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ৪. অর্ডার স্ট্যাটাস আপডেট করা (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return res.json({ success: false, message: "অর্ডারটি পাওয়া যায়নি।" });
    }

    res.json({ success: true, message: "অর্ডার স্ট্যাটাস আপডেট হয়েছে ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ ৫. ক্লায়েন্ট দ্বারা অর্ডার ক্যানসেল (শর্তসাপেক্ষে)
export const clientCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "অর্ডারটি পাওয়া যায়নি।" });
    }

    // শুধুমাত্র 'Pending' অবস্থায় থাকলে ক্যানসেল করা যাবে
    if (order.status !== "Pending") {
      return res.json({ 
        success: false, 
        message: `অর্ডারটি ইতিমধ্যে ${order.status} অবস্থায় আছে। ক্যানসেল করা সম্ভব নয়।` 
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "অর্ডারটি সফলভাবে ক্যানসেল করা হয়েছে ❌" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};