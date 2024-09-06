// routes/category.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controllers");

// Routes for managing categories (Admin only)
router.post("/categories", requireAuth, requireAdmin, createCategory); // Create category
router.get("/categories", getCategories); // Get all categories

module.exports = router;
