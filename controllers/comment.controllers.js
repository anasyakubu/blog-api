// controllers/comment.controllers.js
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

// Add a new comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from the request params
    const { content, parentCommentId } = req.body; // Content of the comment and optional parent comment ID for nested comments
    const userId = req.user.userID; // Authenticated user ID from the token

    // Validate input
    if (!content) {
      return res
        .status(400)
        .json({ status: 400, error: "Comment content is required" });
    }

    // Create a new comment
    const comment = new Comment({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null, // Set parentComment to null if not provided
    });

    // Save the comment
    await comment.save();

    // If the comment is a reply, add it to the parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    res.status(201).json({ status: 201, data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Delete a comment (User can delete their own comment, Admins can delete any comment)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Get the comment ID from the request params
    const userId = req.user.userID; // Authenticated user ID from the token

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ status: 404, error: "Comment not found" });
    }

    // Check if the user is the author of the comment or an admin
    if (comment.author.toString() !== userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ status: 403, error: "Not authorized to delete this comment" });
    }

    // Delete the comment and its nested replies
    await deleteNestedComments(commentId);

    res
      .status(200)
      .json({ status: 200, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Recursive function to delete nested comments
const deleteNestedComments = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (comment) {
    for (const replyId of comment.replies) {
      await deleteNestedComments(replyId); // Recursively delete replies
    }
    await Comment.findByIdAndDelete(commentId); // Delete the comment itself
  }
};

module.exports = { addComment, deleteComment };
