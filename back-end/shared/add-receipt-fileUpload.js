const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Exchange = require("../models/exchange");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let _id = req?.body?.exchangeId;

    let _foundExchange;

    try {
      _foundExchange = await Exchange.findByPk(_id);
    } catch (error) {
      console.log("multer err", error);
    }

    let dir;

    dir = path.join("uploadedFiles", _foundExchange?.name, "receipts");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(/\.(?=[^\.]+$)/)[0] +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(/\.(?=[^\.]+$)/)[1]
    );
  },
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array("uploadingFiles", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 300 * 1024 * 1024; // 300MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);

        console.log(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      console.log("errr22", errors);

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = uploadMiddleware;
