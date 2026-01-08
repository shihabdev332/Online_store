import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPercentage: { type: Number, default: 0 },
  brand: { type: String, required: true }, // ইলেকট্রনিক্সের জন্য ব্র্যান্ড জরুরি
  category: { type: String, required: true }, // এটি আপনার Category Model এর নামের সাথে মিলবে
  stock: { type: Number, default: 1 }, // নতুন যুক্ত করা হয়েছে
  tags: { type: Array }, // SEO এবং সার্চের জন্য
  images: { type: Array, required: true }, // ৫টি ইমেজ সেভ করার জন্য Array
  offer: { type: Boolean, default: false },
  badge: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  date: { type: Number, required: true }
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;