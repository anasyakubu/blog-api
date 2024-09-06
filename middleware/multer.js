// middleware/multer.js
const multer = require("multer");
const path = require("path");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("File type not supported"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
