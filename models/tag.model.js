// models/tag.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const TagModel = mongoose.model("Tag", tagSchema);

module.exports = TagModel;
