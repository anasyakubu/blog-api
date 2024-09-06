// models/post.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    thumbnail: { type: String }, // Store image path
    categories: [{ type: String }],
    tags: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to User model
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
