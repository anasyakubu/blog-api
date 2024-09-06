// routes/user.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  userList,
  getUser,
} = require("../controllers/user.controllers");

// Public Routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

// Protected Routes
router.get("/users/list", requireAuth, requireAdmin, userList); // Only admin can access
router.get("/user/get/:id", requireAuth, getUser); // Authenticated users can access their profile

module.exports = router;
