// controllers/post.controllers.js
const Post = require("../models/post.model");
const Tag = require("../models/tag.model");

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

// controllers/post.controllers.js (Updated)
const Post = require("../models/post.model");

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

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostWithComments,
};
