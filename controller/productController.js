import { v2 as cloudinary } from "cloudinary";
import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js";

// ১. নতুন প্রোডাক্ট যোগ করা
const addProduct = async (req, res) => {
  try {
    const {
      _type, name, category, price, discountedPercentage,
      brand, badge, isAvailable, offer, description, tags, stock
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
    const image5 = req.files?.image5?.[0];

    if (!name || !price || !description || !category) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    let parsedTags = typeof tags === 'string' ? JSON.parse(tags) : (tags || []);

    const productData = {
      _type: _type || "",
      name,
      price: Number(price),
      discountedPercentage: Number(discountedPercentage) || 0,
      category: category.toLowerCase(),
      brand: brand || "",
      stock: Number(stock) || 0,
      badge: badge === "true" || badge === true,
      isAvailable: isAvailable === "true" || isAvailable === true,
      offer: offer === "true" || offer === true,
      description,
      tags: parsedTags,
      images: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully ✅" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ২. রিভিউ যোগ করা
const addProductReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName, userId } = req.body;
    const product = await productModel.findById(productId);

    if (!product) return res.json({ success: false, message: "Product not found" });

    const review = { userId, userName, rating: Number(rating), comment, date: Date.now() };
    product.reviews.push(review);

    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.averageRating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();
    res.json({ success: true, message: "Review Added Successfully ⭐" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ৩. ইউজার কি রিভিউ দিতে পারবে?
const canUserReview = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    const orders = await orderModel.find({ userId, payment: true }); 
    
    let hasPurchased = false;
    orders.forEach((order) => {
      // আপনার অর্ডার মডেলে যদি 'items' এর বদলে 'products' থাকে তবে সেটি ব্যবহার করুন
      const itemExists = order.items?.find(item => item._id.toString() === productId);
      if (itemExists) hasPurchased = true;
    });

    res.json({ success: true, canReview: hasPurchased });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ৪. সব প্রোডাক্ট লিস্ট দেখা
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, total: products.length, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ৫. প্রোডাক্ট ডিলিট করা
const removeProduct = async (req, res) => {
  try {
    const { _id } = req.body;
    await productModel.findByIdAndDelete(_id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ৬. সার্চ লজিক (Updated)
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ success: true, product: [] });
    }

    const filter = { 
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, 'i')] } } // ট্যাগের ভেতর সার্চ
      ]
    };
    
    const products = await productModel.find(filter);
    
    // ✅ ফ্রন্টএন্ডের SearchPage.jsx এর সাথে মিল রেখে 'product' নাম দেওয়া হয়েছে
    res.json({ success: true, product: products }); 
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ৭. সিঙ্গেল প্রোডাক্ট ডিটেইলস
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { 
  addProduct, 
  addProductReview, 
  canUserReview, 
  removeProduct, 
  listProducts, 
  singleProduct, 
  searchProducts 
};