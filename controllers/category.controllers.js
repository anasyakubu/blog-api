// controllers/category.controllers.js
const Category = require("../models/category.model");

// Create a new category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: 400, error: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ status: 400, error: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ status: 201, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ status: 200, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

module.exports = { createCategory, getCategories };
