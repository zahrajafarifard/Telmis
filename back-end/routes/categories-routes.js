const express = require("express");
const router = express.Router();
const checkAuth = require("../shared/checkAuth");

const upload = require("../shared/subCat-uploader");
const categorisControllers = require("../controllers/categories-controller");

//admin - side routes
router.get(
  "/parentsCategories", //site - route
  categorisControllers.getParents
);

router.get(
  "/parents", //change in admin side
  checkAuth,
  categorisControllers.getParents
);

router.get("/allparents", categorisControllers.allParents);
router.post("/getSubParents", categorisControllers.getSubParents);
router.get("/getAllSubCategories", categorisControllers.getAllSubCategories);
router.get("/getCategory/:categoryId", categorisControllers.getById);
router.patch(
  "/editSubCategory",
  checkAuth,
  upload.single("image"),
  categorisControllers.updateSubCategory
);
router.patch("/:categoryId", checkAuth, categorisControllers.update);
// router.post("/add", checkAuth, categorisControllers.add);
router.post(
  "/add",
  checkAuth,
  upload.single("image"),
  categorisControllers.add
);
router.post(
  "/addSubCategory",
  checkAuth,
  upload.single("image"),
  categorisControllers.addSubCategory
);
router.delete("/:categoryId", checkAuth, categorisControllers.delete);
router.get("/", categorisControllers.getAll);
router.get(
  "/:categoryId/subCategory",
  // checkAuth, client doesnt have token , but admin should have
  categorisControllers.getSubCategory
);

//client - side routes
router.get("/api/getSubParents", categorisControllers.getSubParents);
router.get("/api/parents", categorisControllers.getParents);
router.post(
  "/api/:categoryId/subCategories",
  categorisControllers.getSubCategories
);

module.exports = router;
