const express = require("express");
const router = express.Router();

const jobCategoryController = require("../controllers/job-articleCategory-controller");
const checkAuth = require("../shared/checkAuth");

router.post("/", checkAuth, jobCategoryController.add);
router.delete("/", checkAuth, jobCategoryController.delete);
router.patch("/", checkAuth, jobCategoryController.edit);
router.get("/:id", checkAuth, jobCategoryController.get);
router.get("/", checkAuth, jobCategoryController.getAll);

module.exports = router;
