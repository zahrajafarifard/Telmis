const path = require("path");
const multer = require("multer");
const fs = require("fs");

const Exchange = require("../models/exchange");

const createDirectories = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let _id = req?.body?.exchangeId;

    let _foundExchange;

    try {
      _foundExchange = await Exchange.findByPk(_id);
    } catch (error) {
      console.log("multer err", error);
    }

    const dir = file.mimetype.startsWith("image")
      ? `uploadedFiles/${_foundExchange?.name}/images/`
      : `uploadedFiles/${_foundExchange?.name}/files/`;
    createDirectories(dir);
    cb(null, ""); // We will set the path in the filename function
  },

  filename: async (req, file, cb) => {
    let filePath, _foundExchange;

    let _id = req?.body?.exchangeId;

    try {
      _foundExchange = await Exchange.findByPk(_id);
    } catch (error) {
      console.log("multer err", error);
    }

    const dir = file.mimetype.startsWith("image")
      ? `uploadedFiles/${_foundExchange?.name}/images/`
      : `uploadedFiles/${_foundExchange?.name}/files/`;

    const ext = path.extname(file.originalname);

    const fileNameWithoutExtension = path.parse(file.originalname).name;
    filePath = `${dir}${fileNameWithoutExtension}-${Date.now()}${ext}`;

    cb(null, filePath);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "files", maxCount: 10 },
  { name: "images", maxCount: 10 },
]);

module.exports = upload;
