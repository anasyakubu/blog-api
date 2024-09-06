// Test Endpoint
const test = (req, res) => {
  res.json({ status: 200, message: "Testing.." });
};

// Get Profile
const getProfile = (req, res) => {
  res.json({
    message: "Authorized",
    status: 200,
    // userId: user._id,
  });
};

module.exports = { test, getProfile };
