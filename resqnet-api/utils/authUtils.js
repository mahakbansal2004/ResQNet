import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import { errorHandler } from "./error.js";

dotenvConfig();

export const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "5h" });
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔑 Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("📥 Extracted Token:", token);

  if (!token) {
    console.log("⛔ No token provided");
    return next(errorHandler(401, "Token missing"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return next(errorHandler(401, "Unauthorized user"));
    }
    console.log("✅ Token verified successfully:", decoded);
    req.user = decoded;
    next();
  });
};
