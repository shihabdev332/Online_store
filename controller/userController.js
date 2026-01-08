import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// Function to generate JWT token
const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );
};

// Handle user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password!" });
    }

    const token = createToken(user);

    // Return success response with token and user data
    res.json({
      success: true,
      token,
      message: "User Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        isAdmin: user.isAdmin || false,
        userCart: user.userCart || {},
      },
    });
  } catch (error) {
    console.error("User Login error", error);
    res.json({ success: false, message: error.message });
  }
};

// Register a new user
const userRegister = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Field validation
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: encryptedPassword,
      isAdmin: isAdmin || false,
    });

    const user = await newUser.save();
    const token = createToken(user); // Generate token for automatic login after register

    res.json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    console.error("User register Error", error);
    res.json({ success: false, message: error.message });
  }
};

// Handle admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });

    // Verify admin privileges
    if (!user || !user.isAdmin) {
      return res.status(401).json({ success: false, message: "Not authorized as admin!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password!" });
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      token,
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
const removeUser = async (req, res) => {
  try {
    const { _id } = req.body;
    await userModel.findByIdAndDelete(_id);
    res.json({ success: true, message: "User Deleted Successfully!" });
  } catch (error) {
    console.error("Remove User error", error);
    res.json({ success: false, message: error.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const user = await userModel.findById(_id);
    if (!user) return res.json({ success: false, message: "User not found!" });

    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address!" });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Password too short!" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.error("Update User Error!", error);
    res.json({ success: false, message: error.message });
  }
};

// Get all users (Excluding passwords)
const getUser = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password"); // Security: do not send passwords
    const total = users.length;
    res.json({ success: true, total, users });
  } catch (error) {
    console.error("Fetch Users Error!", error);
    res.json({ success: false, message: error.message });
  }
};

export { userLogin, userRegister, adminLogin, removeUser, updateUser, getUser };