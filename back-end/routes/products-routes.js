const express = require("express");
const router = express.Router();

const upload = require("../shared/file-upload-products");
// const fileUpload = require("../shared/main-fileUploader");
const productsControllers = require("../controllers/products-controllers");
const checkAuth = require("../shared/checkAuth");

//pannnell client

router.delete("/favorites", checkAuth, productsControllers.deleteFavorites);
// admin - side routes

router.delete("/refuse-comment", checkAuth, productsControllers.refuseComment);
router.patch("/confirm-comment", checkAuth, productsControllers.confirmComment);
router.patch(
  "/confirm-comments",
  checkAuth,
  productsControllers.confirmComments
);
router.delete(
  "/refuse-comments",
  checkAuth,
  productsControllers.refuseComments
);
////////////
router.post("/comments", checkAuth, productsControllers.getComments);
router.delete("/deleteImage", checkAuth, productsControllers.deleteImage);

router.patch(
  "/:productId",
  checkAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),

  productsControllers.update
);

router.post(
  "/newProduct",
  checkAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }
    next();
  },
  productsControllers.add
);
router.post("/getFavProduct", checkAuth, productsControllers.getFavProduct);
router.delete("/:productId", checkAuth, productsControllers.delete);

// router.post("/", productsControllers.getAll); ?/
router.post("/all", productsControllers.getAll); // changed for site
router.post("/", checkAuth, productsControllers.getAll);
router.get("/getproductById/:productId", productsControllers.getById);

router.post(
  "/ProductsPerSubCategory",
  checkAuth,
  productsControllers.ProductsPerSubCategory
);
router.post(
  "/productsPerCategory",
  checkAuth,
  productsControllers.productsPerCategory
);
//pannnell client

router.post("/favorites", checkAuth, productsControllers.getFavorites);

router.get("/latest", checkAuth, productsControllers.latestProducts);

// client - side routes
//site
router.post("/addToFavorite", checkAuth, productsControllers.addToFavorite);

router.post(
  "/productsPerCategorySite",
  productsControllers.productsPerCategorySite
);
router.post(
  "/productsPerSubCategorySite",
  productsControllers.ProductsPerSubCategorySite
);

router.post("/sort-favorites", checkAuth, productsControllers.sortFavorites);
router.post("/sort", productsControllers.sort);
router.post("/comment", productsControllers.insertComment);
router.get(
  "/relatedProducts/:categoryId/:productId",
  productsControllers.relatedProducts
);
router.get(
  "/updateProductPrices/:ids",
  productsControllers.updateProductPrices
);
router.post("/search", productsControllers.search); // admin - side changed - add pagination
router.get("/bestSellingProducts", productsControllers.bestSellingProducts);

router.post("/api/:categoryId", productsControllers.allProductWithSameCategory);

module.exports = router;
