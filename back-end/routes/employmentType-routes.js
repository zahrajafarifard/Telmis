const express = require("express");
const router = express.Router();

const employmentTypeController = require("../controllers/employmentType-controller");
const checkAuth = require("../shared/checkAuth");

router.post("/", checkAuth, employmentTypeController.add);
router.delete("/", checkAuth, employmentTypeController.delete);
router.patch("/", checkAuth, employmentTypeController.edit);
router.get("/:id", checkAuth, employmentTypeController.get);
router.get("/", checkAuth, employmentTypeController.getAll);

module.exports = router;
