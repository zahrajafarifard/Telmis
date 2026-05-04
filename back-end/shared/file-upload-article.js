const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname,  "..","uploads/article");

    // Check if the directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    cb(null, uploadDir); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with the original extension
  },
});

// Initialize multer with storage settings
const upload = multer({ storage });

module.exports = upload;
