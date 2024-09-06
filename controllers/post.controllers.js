// controllers/post.controllers.js
const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

// Create a new post with tags
const createPost = async (req, res) => {
  try {
    const { title, body, categories, tags } = req.body;
    const thumbnail = req.file ? req.file.path : ""; // Image path from Multer
    const author = req.user.userID; // Authenticated user ID from token

    // Ensure tags exist in the Tag collection
    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        let existingTag = await Tag.findOne({ name: tag });
        if (!existingTag) {
          existingTag = await new Tag({ name: tag }).save();
        }
        return existingTag._id;
      })
    );

    const post = new Post({
      title,
      body,
      thumbnail,
      categories,
      tags: tagIds,
      author,
    });

    await post.save();
    res.status(201).json({ status: 201, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Get all posts with pagination, sorting, and filtering
const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      category,
      tags,
      author,
    } = req.query;
    const query = {};

    // Filtering
    if (category) query.categories = category;
    if (tags) query.tags = { $in: tags.split(",") };
    if (author) query.author = author;

    // Pagination and Sorting
    const posts = await Post.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({ status: 200, data: posts, total: totalPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, body, categories, tags } = req.body;
    const thumbnail = req.file ? req.file.path : null; // Optional image update
    const userId = req.user.userID;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    // Check if the user is the post owner or an admin
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: 403, error: "Not authorized to update this post" });
    }

    // Update post fields
    post.title = title || post.title;
    post.body = body || post.body;
    post.categories = categories || post.categories;
    post.tags = tags || post.tags;
    if (thumbnail) post.thumbnail = thumbnail;

    await post.save();
    res.status(200).json({ status: 200, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userID;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    // Check if the user is the post owner or an admin
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: 403, error: "Not authorized to delete this post" });
    }

    await post.remove();
    res.status(200).json({ status: 200, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Fetch a single post with comments
const getPostWithComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          model: "Comment",
          populate: { path: "author", model: "User", select: "name" },
        },
      })
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    res.status(200).json({ status: 200, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from the request params
    const userId = req.user.userID; // Authenticated user ID from the token

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    // Check if the user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      // If already liked, remove the like
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      // Otherwise, add the like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      status: 200,
      message: alreadyLiked ? "Post unliked" : "Post liked",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Get popular posts based on likes and comments
const getPopularPosts = async (req, res) => {
  try {
    // Fetch posts sorted by the number of likes and comments in descending order
    const popularPosts = await Post.find({})
      .populate("author", "name")
      .populate("comments")
      .sort({ "likes.length": -1, "comments.length": -1 }) // Sort by likes and comments
      .limit(10); // Limit to top 10 popular posts

    res.status(200).json({ status: 200, data: popularPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Search posts by title or body
const searchPosts = async (req, res) => {
  try {
    const { keyword } = req.query; // Get the search keyword from the query parameters

    if (!keyword) {
      return res
        .status(400)
        .json({ status: 400, error: "Keyword is required for searching" });
    }

    // Search for posts where the title or body contains the keyword (case insensitive)
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // Case insensitive search for title
        { body: { $regex: keyword, $options: "i" } }, // Case insensitive search for body
      ],
    }).populate("author", "name");

    res.status(200).json({ status: 200, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Get posts with filtering and pagination
const getFilteredPosts = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query; // Get query parameters for filtering and pagination

    const filter = {};

    if (category) {
      filter.categories = category; // Filter by category
    }

    if (tag) {
      filter.tags = tag; // Filter by tag
    }

    const posts = await Post.find(filter)
      .populate("author", "name")
      .skip((page - 1) * limit) // Implement pagination
      .limit(parseInt(limit)) // Limit the number of posts per page
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    const totalPosts = await Post.countDocuments(filter); // Total number of posts for pagination info
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total number of pages

    res.status(200).json({
      status: 200,
      data: posts,
      totalPosts,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Approve or reject a post (Admin action)
const approveOrRejectPost = async (req, res) => {
  try {
    const { postId, action } = req.body; // action should be "approve" or "reject"

    if (!postId || !action) {
      return res
        .status(400)
        .json({ status: 400, error: "Post ID and action are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    if (action === "approve") {
      post.status = "approved";
    } else if (action === "reject") {
      post.status = "rejected";
    } else {
      return res.status(400).json({ status: 400, error: "Invalid action" });
    }

    await post.save();
    res.status(200).json({
      status: 200,
      message: `Post has been ${action}ed successfully!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Delete any post (Admin action)
const deleteAnyPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found" });
    }

    await post.remove();
    res
      .status(200)
      .json({ status: 200, message: "Post deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Delete user's own post or comment (User or Admin action)
const deleteOwnPostOrComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: postId, author: userId });

    if (!post) {
      return res.status(403).json({
        status: 403,
        error: "You are not authorized to delete this post!",
      });
    }

    await post.remove();
    res
      .status(200)
      .json({ status: 200, message: "Post deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostWithComments,
  likePost,
  searchPosts,
  getFilteredPosts,
  approveOrRejectPost,
  deleteAnyPost,
  deleteOwnPostOrComment,
};
