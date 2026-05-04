const express = require("express");
const router = express.Router();

const militaryServiceController = require("../controllers/militaryService-controller");
const checkAuth = require("../shared/checkAuth");

router.post("/", checkAuth, militaryServiceController.add);
router.delete("/", checkAuth, militaryServiceController.delete);
router.patch("/", checkAuth, militaryServiceController.edit);
router.get("/:id", checkAuth, militaryServiceController.get);
router.get("/", checkAuth, militaryServiceController.getAll);

module.exports = router;
