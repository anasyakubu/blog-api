// routes/post.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostWithComments,
} = require("../controllers/post.controllers");

// Routes for managing posts
router.post("/posts", requireAuth, upload.single("thumbnail"), createPost); // Create post
router.get("/posts", getPosts); // Get all posts with filtering, pagination, and sorting
router.get("/posts/comments", getPostWithComments); // Get all posts with filtering, pagination, and sorting
router.put("/posts/:id", requireAuth, upload.single("thumbnail"), updatePost); // Update post
router.delete("/posts/:id", requireAuth, deletePost); // Delete post

module.exports = router;
