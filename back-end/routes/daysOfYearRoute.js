const express = require("express");
const router = express.Router();

const checkAuth = require("../shared/checkAuth");
const daysOfYearController = require("../controllers/daysOfYear-controllers");
//admin -side
router.post(
  "/advanced-config-days-Of-year",
  checkAuth,
  daysOfYearController.advancedConfigDaysOfYear
);
router.post(
  "/config-days-Of-year",
  checkAuth,
  daysOfYearController.configDaysOfYear
);

//site
router.get("/getDaysOfyear", checkAuth, daysOfYearController.getDaysOfyear);

module.exports = router;
