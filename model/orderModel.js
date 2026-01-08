import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true }, // $NaN এবং নামের সমস্যা দূর করবে
      price: { type: Number, required: true }, // ক্যালকুলেশন ফিক্স করবে
      image: { type: Array, required: true }, // ইমেজ ফিক্স করবে
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
  payment: { type: Boolean, default: false },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;