import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false }, // ডিফল্ট ভ্যালু থাকা ভালো
    cartData: { type: Object, default: {} }, // ইউজার কার্ট স্টোর করার জন্য
}, { minimize: false, timestamps: true }); // timestamps ক্রিয়েটেড ডেট ট্র্যাক করবে

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;