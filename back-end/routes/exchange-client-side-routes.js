const express = require("express");
const router = express.Router();
const checkAuth = require("../shared/checkAuth");
const clientSideController = require("../controllers/exchange-client-side-controller");
const fileUpload = require("../shared/fileUpload-main");

router.post("/favorites", checkAuth, clientSideController.getFavorites);

router.get("/factor/:factorId", checkAuth, clientSideController.getFactor); //for exchange
router.post("/factors", checkAuth, clientSideController.getFactors);
router.post(
  "/deliveredFactors",
  checkAuth,
  clientSideController.getDeliveredFactors
);
router.post(
  "/canceledFactors",
  checkAuth,
  clientSideController.getCanceledFactors
);
router.post("/currentFactors", checkAuth, clientSideController.currentFactors);

router.get(
  "/getUnReadnotifications",
  checkAuth,
  clientSideController.getUnReadnotifications
); //check it later
router.post("/notifications", checkAuth, clientSideController.getNotification); // get to post pagina

// router.get(
//   "/notifications/latest",
//   checkAuth,
//   clientSideController.getLatestNotification
// );

router.post(
  "/regenerateCredentials",
  clientSideController.regenerateCredentials
); //ok

router.get(
  "/downloadFile/:fileId",
  checkAuth,
  clientSideController.downloadFile
);
router.post("/privateFiles", checkAuth, clientSideController.getPrivateFiles);
router.post("/publicFiles", checkAuth, clientSideController.getPublicFiles);
router.post("/generateCredentials", clientSideController.generateCredentials); //ok
router.post("/check-password", clientSideController.checkPassword); //ok
router.post(
  "/exchangeWithLoginHistory",
  checkAuth,
  clientSideController.getExchangeWithPagination
); //ok
router.patch("/", checkAuth, fileUpload, clientSideController.updateExchange); //ok

router.post("/register", clientSideController.register); //ok

// router.get(
//   "/client-notification",
//   checkAuth,
//   clientSideController.exchangeNotification
// );
router.get(
  "/latestExchangeNotification",
  checkAuth,
  clientSideController.latestExchangeNotification
);

router.post("/receipts", checkAuth, clientSideController.getReceipts);
router.post("/latestReceipts", checkAuth, clientSideController.latestReceipts);

router.post("/search-receipt", checkAuth, clientSideController.searchReceipt);
router.post("/search-files", checkAuth, clientSideController.searchFiles);
router.post("/search-factors", checkAuth, clientSideController.searchFactors);

router.get(
  "/latestDowloadedFiles",
  checkAuth,
  clientSideController.latestDowloadedFiles
);
router.get("/exchange", checkAuth, clientSideController.getExchange);

router.get(
  "/downloadReceipt/:receiptId/:changedBy",
  checkAuth,
  clientSideController.downloadReceipts
);

module.exports = router;
