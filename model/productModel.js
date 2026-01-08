import mongoose from "mongoose";

// রিভিউ স্কিমা (প্রোডাক্টের ভেতরে সাব-ডকুমেন্ট হিসেবে থাকবে)
const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Number, default: Date.now() }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: Array, required: true }, 
  category: { type: String, required: true },
  subCategory: { type: String }, 
  brand: { type: String },
  discountedPercentage: { type: Number, default: 0 },
  badge: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  offer: { type: Boolean, default: false },
  tags: { type: Array },
  date: { type: Number, required: true },
  
  // ডাইনামিক রিভিউ সেকশন
  reviews: [reviewSchema], // এখানে সব ইউজারের রিভিউ সেভ হবে
  averageRating: { type: Number, default: 0 } // সর্টিং বা শপে স্টার দেখানোর জন্য
}, { minimize: false });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;