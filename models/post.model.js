// models/post.model.js (Updated)
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: String }],
    thumbnail: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array to store users who liked the post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
