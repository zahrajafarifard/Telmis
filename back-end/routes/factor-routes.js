const express = require("express");
const router = express.Router();

const checkAuth = require("../shared/checkAuth");
const factorControllers = require("../controllers/factor-controllers");

//client - side
router.post("/change-address", checkAuth, factorControllers.ChangeAddress);
router.post("/order", checkAuth, factorControllers.order);
router.get("/latest", checkAuth, factorControllers.getLatestFactors);

router.get(
  "/api/fetchPreviousPurchases/:clientId",
  checkAuth,
  factorControllers.fetchPreviousPurchases
);

//admin-side   //// auth
router.get("/status", checkAuth, factorControllers.getStatus);
router.post(
  "/changeStatus/:factorId",
  checkAuth,
  factorControllers.changeStatus
);
router.get("/getFactor/:factorId", checkAuth, factorControllers.getFactorForAdmin);//for admin
router.get("/:factorId", checkAuth, factorControllers.getFactor);//for client
router.post("/sort", checkAuth, factorControllers.sortFactors);
router.post("/getAllFactors", checkAuth, factorControllers.getAllFactors); //for admin
router.post("/", checkAuth, factorControllers.getFactors); //for client
// router.get("/", checkAuth, factorControllers.getFactors); change to post for pagination
router.get("/delivered-orders", checkAuth, factorControllers.deliveredOrders);
module.exports = router;
