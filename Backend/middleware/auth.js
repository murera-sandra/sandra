import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Very simple in-memory blacklist for demo purposes.
// For real scalability use Redis or another shared store.
const tokenBlacklist = new Set();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing" });
    }

    if (tokenBlacklist.has(token)) {
      return res
        .status(401)
        .json({ success: false, message: "Token is no longer valid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer active" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const authorize = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (allowed.length && !allowed.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: insufficient role" });
    }
    next();
  };
};

export const blacklistToken = (token) => {
  if (token) {
    tokenBlacklist.add(token);
  }
};

