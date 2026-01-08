import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ১. টোকেন চেক (স্মার্টার চেক)
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: No token provided!" 
      });
    }

    const token = authHeader.split(" ")[1];

    // ২. টোকেন ভেরিফিকেশন
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ৩. রোল চেক (Strict Check)
    if (decoded.role !== 'admin' && !decoded.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden: You do not have admin privileges" 
      });
    }

    // ৪. রিকোয়েস্ট অবজেক্টে ডাটা পাস
    req.adminId = decoded.id; 
    req.user = decoded; 

    next();
  } catch (error) {
    // ৫. নির্দিষ্ট এরর হ্যান্ডলিং
    const message = error.name === "TokenExpiredError" 
      ? "Token expired, please login again" 
      : "Invalid token authentication failed";

    return res.status(401).json({ success: false, message });
  }
};

export default adminAuth;