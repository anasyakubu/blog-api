// routes/tag.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { createTag, getTags } = require("../controllers/tag.controllers");

// Routes for managing tags
router.post("/tags", requireAuth, createTag); // Create tag (any authenticated user)
router.get("/tags", getTags); // Get all tags

module.exports = router;
