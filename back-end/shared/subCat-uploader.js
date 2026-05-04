const multer = require("multer");
const path = require("path");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads/product");
    cb(null, uploadDir);
    // cb(null, "uploads/"); // Set the folder for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const fileFilter = (req, file, cb) => {
  // Only accept image files
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Set upload limits
const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB file size limit
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
