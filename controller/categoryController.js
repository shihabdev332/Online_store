import categoryModel from "../model/categoryModel.js";

// ১. নতুন ক্যাটাগরি যোগ করা (Admin Panel এর জন্য)
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ success: false, message: "Category name is required" });
    }

    const category = new categoryModel({ name });
    await category.save();

    res.json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ২. সব ক্যাটাগরি দেখা (Shop Page এবং Admin Dropdown এর জন্য)
const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addCategory, getCategories };