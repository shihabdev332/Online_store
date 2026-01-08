import jwt from "jsonwebtoken";

/**
 * Middleware to verify User JWT Token
 * Ensures the requester is a logged-in user
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header exists and follows 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication failed: No token provided!" 
        });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication failed: Token missing!" 
        });
    }

    // 3. Verify the token using JWT_SECRET from .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Check if error is due to token expiration
            const errorMessage = err.name === "TokenExpiredError" 
                ? "Session expired, please login again" 
                : "Invalid token authentication failed";

            return res.status(403).json({ 
                success: false, 
                message: errorMessage 
            });
        }

        // 4. Attach decoded payload (userId, role, etc.) to the request object
        req.user = decoded;
        
        // Move to the next middleware or controller
        next();
    });
};