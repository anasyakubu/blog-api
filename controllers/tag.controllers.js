// controllers/tag.controllers.js
const Tag = require("../models/tag.model");

// Create a new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: 400, error: "Tag name is required" });
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ status: 400, error: "Tag already exists" });
    }

    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json({ status: 201, data: tag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

// Fetch all tags and filter posts by tag
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json({ status: 200, data: tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

module.exports = { createTag, getTags };
