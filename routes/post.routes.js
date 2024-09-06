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
  likePost,
  getPopularPosts,
  getPostWithComments,
} = require("../controllers/post.controllers");
//
const {
  searchPosts,
  getFilteredPosts,
} = require("../controllers/post.controllers");

const { isAdmin, isOwnerOrAdmin } = require("../middleware/roleMiddleware");
const {
  approveOrRejectPost,
  deleteAnyPost,
  deleteOwnPostOrComment,
} = require("../controllers/post.controllers");

// Routes for managing posts
router.post("/posts", requireAuth, upload.single("thumbnail"), createPost); // Create post
router.get("/posts", getPosts); // Get all posts with filtering, pagination, and sorting
router.get("/posts/comments", getPostWithComments); // Get all posts with filtering, pagination, and sorting
router.put("/posts/:id", requireAuth, upload.single("thumbnail"), updatePost); // Update post
router.delete("/posts/:id", requireAuth, deletePost); // Delete post
// Route to like or unlike a post
router.post("/posts/:postId/like", requireAuth, likePost);
// Route to fetch popular posts based on likes and comments
router.get("/posts/popular", getPopularPosts);
// Route to search for posts by keyword
router.get("/search", searchPosts);

// Route to get posts with filtering and pagination
router.get("/posts", getFilteredPosts);

// Admin route to approve or reject posts
router.post(
  "/admin/posts/approve-reject",
  requireAuth,
  isAdmin,
  approveOrRejectPost
);

// Admin route to delete any post
router.delete("/admin/posts/:postId", requireAuth, isAdmin, deleteAnyPost);

// Route for users to delete their own post or comment (and admins)
router.delete(
  "/posts/:postId",
  requireAuth,
  isOwnerOrAdmin,
  deleteOwnPostOrComment
);
module.exports = router;
