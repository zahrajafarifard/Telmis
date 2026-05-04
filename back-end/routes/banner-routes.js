const express = require("express");
const router = express.Router();

const bannerController = require("../controllers/banner-controller");
const checkAuth = require("../shared/checkAuth");
const upload = require("../shared/upload-baner");

router.post(
  "/",
  checkAuth,
  upload.fields([
    { name: "screen500", maxCount: 1 },
    { name: "screen900", maxCount: 1 },
    { name: "screen1440", maxCount: 1 },
    { name: "screen1980", maxCount: 1 },
  ]),
  bannerController.upload
);
router.get("/shop-header", bannerController.getImageShopHeader);
router.get("/shop-body", bannerController.getImageShopBody);
router.get("/", checkAuth, bannerController.getImages);

module.exports = router;
