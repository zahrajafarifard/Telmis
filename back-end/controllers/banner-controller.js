const Banner = require("../models/banner");
const path = require("path");
const fs = require("fs");

setInterval(deleteOldFiles, 24 * 60 * 60 * 1000);
// setInterval(deleteOldFiles, 5000);

async function deleteOldFiles() {
  try {
    const folderPath = path.join(__dirname, "..", "uploads", "banners");
    const banners = await Banner.findAll();

    const imageFields = [
      "image_screen500",
      "image_screen900",
      "image_screen1440",
      "image_screen1980",
    ];

    const validFiles = new Set();

    for (const article of banners) {
      for (const field of imageFields) {
        const imagePath = article[field];
        if (imagePath) {
          validFiles.add(path.basename(imagePath));
        }
      }
    }

    const allFiles = fs.readdirSync(folderPath);

    for (const file of allFiles) {
      if (!validFiles.has(file)) {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted orphaned file: ${filePath}`);
      }
    }

    console.log("Old files deleted successfully!");
  } catch (err) {
    console.error("Error deleting old files:", err);
  }
}

exports.getImageShopBody = async (req, res, next) => {
  try {
    const banner = await Banner.findOne({
      where: {
        title: "shop-body",
      },
    });

    return res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};
exports.getImageShopHeader = async (req, res, next) => {
  try {
    const banner = await Banner.findOne({
      where: {
        title: "shop-header",
      },
    });

    return res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};
exports.getImages = async (req, res, next) => {
  try {
    const banners = await Banner.findAll();

    return res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};
exports.upload = async (req, res, next) => {
  try {
    const { title, link } = req.body;
    const files = req.files;

    const bannerData = {
      title,
      link,
      image_screen500: `/uploads/banners/${files.screen500[0].filename}`,
      image_screen900: `/uploads/banners/${files.screen900[0].filename}`,
      image_screen1440: `/uploads/banners/${files.screen1440[0].filename}`,
      image_screen1980: `/uploads/banners/${files.screen1980[0].filename}`,
    };

    // upsert will create a new record if title doesn't exist, or update it if it does
    const [banner, created] = await Banner.upsert(bannerData, {
      returning: true, // makes sure Sequelize returns the updated/created row
      conflictFields: ["title"], // only needed if title is not the primary key
    });

    return res.status(created ? 201 : 200).json(banner);
  } catch (err) {
    console.error("Banner Upload Error:", err);
    res.status(500).json({ error: "Failed to upload or update banner" });
  }
};
