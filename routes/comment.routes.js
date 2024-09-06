// routes/comment.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  addComment,
  deleteComment,
} = require("../controllers/comment.controllers");

// Route to add a comment to a post
router.post("/posts/:postId/comments", requireAuth, addComment);

// Route to delete a comment (by user or admin)
router.delete("/posts/comments/:commentId", requireAuth, deleteComment);

module.exports = router;
