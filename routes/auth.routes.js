const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const cros = require("cors");
const { test, getProfile } = require("../controllers/auth.controllers");
const {
  registerUser,
  loginUser,
  userList,
  getUser,
} = require("../controllers/user.controllers");

router.get("/", test);
// Login $ register
router.post("/signup", registerUser);
router.get("/user/list", userList);
router.get("/user/get/:id", getUser);
router.post("/login", loginUser);
// profile
router.get("/profile", requireAuth, getProfile);

module.exports = router;
