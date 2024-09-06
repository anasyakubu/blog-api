// models/category.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
