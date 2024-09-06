// controllers/user.controllers.js
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

// List Users
const userList = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json({ status: 200, data: users }))
    .catch((err) => res.status(400).json(err));
};

// Fetch User [One]
const getUser = (req, res) => {
  const id = req.params.id;
  User.find({ _id: id })
    .then((user) => res.status(200).json({ status: 200, data: user }))
    .catch((err) => res.status(400).json(err));
};

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Validate input fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: 400, error: "All fields are required" });
    }
    if (password.length < 4) {
      return res.status(400).json({
        status: 400,
        error: "Password should be at least 4 characters long",
      });
    }

    // Check if email exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ status: 400, error: "Email already taken" });
    }

    const hashedPassword = await hashPassword(password);

    // Create user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, error: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 400, error: "No user found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ status: 400, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, userID: user._id, role: user.role }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: "10hr" }
    );

    return res.status(200).json({
      status: 200,
      message: "User logged in successfully!",
      token,
      userID: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { userList, getUser, registerUser, loginUser };
