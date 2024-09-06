// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "Not Authenticated!" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(403).json({ error: "Not Authorized!" });
    }

    req.user = decodedToken; // Store decoded token data
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required!" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
