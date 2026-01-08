import express from "express";
import {
  addProduct,
  removeProduct,
  listProducts,
  singleProduct,
  searchProducts,
  addProductReview,
  canUserReview, // কন্ট্রোলার থেকে নতুন ফাংশনটি ইম্পোর্ট করুন
} from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoute = express.Router();

// প্রোডাক্ট অ্যাড করার রুট (Admin Only)
productRoute.post(
  "/add",
  adminAuth, 
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  addProduct
);

// প্রোডাক্ট রিমুভ করার রুট (Admin Only)
productRoute.post("/remove", adminAuth, removeProduct); 

// প্রোডাক্ট লিস্ট দেখার রুট
productRoute.get("/list", listProducts);

// সিঙ্গেল প্রোডাক্ট দেখার রুট
productRoute.get("/single", singleProduct); 

// প্রোডাক্ট সার্চ করার রুট
productRoute.get("/search", searchProducts);

// রিভিউ অ্যাড করার রুট
productRoute.post("/add-review", addProductReview); 

// বায়ার চেক করার রুট (নতুন যোগ করা হয়েছে)
productRoute.get("/can-review", canUserReview); 

export default productRoute;