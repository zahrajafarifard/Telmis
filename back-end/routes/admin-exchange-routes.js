const express = require("express");
const router = express.Router();
const fileUploadFiles = require("../shared/fileUpload");
const fileUpload = require("../shared/fileUpload-main");
const editFileUpload = require("../shared/edit-fileUpload");
const addReceiptFileUpload = require("../shared/add-receipt-fileUpload");
const checkAuth = require("../shared/checkAuth");
const exchangeControllers = require("../controllers/exchange-controllers");

//admin routes

router.post("/notification", checkAuth, exchangeControllers.notification); //add pagination get to post -- new user notif
router.post(
  "/profile-notification",
  checkAuth,
  exchangeControllers.profileNotification
);
router.post(
  "/financial-notification",
  checkAuth,
  exchangeControllers.financialNotification
);
//  *****
router.get("/get-requests", checkAuth, exchangeControllers.getRequests);
router.post("/create", checkAuth, fileUpload, exchangeControllers.create);
router.patch(
  "/confirm-requests",
  checkAuth,
  exchangeControllers.confirmRequests
);
router.delete(
  "/refuse-requests",
  checkAuth,
  exchangeControllers.refuseRequests
);
// *****
router.patch(
  "/adminUpdateExchange",
  checkAuth,
  exchangeControllers.adminUpdateExchange
);
//admin && client
router.patch(
  "/uploadImage",
  checkAuth,
  fileUpload,
  exchangeControllers.uploadImage
); // ddelrte from client
router.delete("/refuse-request", checkAuth, exchangeControllers.refuseRequest);
router.patch("/confirm-request", checkAuth, exchangeControllers.confirmRequest);

//***** */

router.get("/file/:id", checkAuth, exchangeControllers.getFile); //new - admin
router.post("/downloads", checkAuth, exchangeControllers.getAllFiles);
router.post("/search-file", checkAuth, exchangeControllers.searchFile);
router.patch(
  "/uploadFiles",
  checkAuth,
  fileUploadFiles,
  exchangeControllers.uploadFiles
);
router.delete("/delete-file", checkAuth, exchangeControllers.deleteFile);
router.patch(
  "/updateFile",
  checkAuth,
  editFileUpload,
  exchangeControllers.updateFile
);

// ******

//admin and client
router.post(
  "/receipts/:exchangeId",
  checkAuth,
  exchangeControllers.getReceipts
);
//admin and client
router.post("/search-receipt", checkAuth, exchangeControllers.searchReceipt);
router.post("/search-files", checkAuth, exchangeControllers.searchFiles); //check it later

router.patch(
  "/add-receipt",
  checkAuth,
  addReceiptFileUpload,
  exchangeControllers.addReceipt
);
router.patch(
  "/edit-receipt",
  checkAuth,
  addReceiptFileUpload,
  exchangeControllers.editReceipt
);
//client and admin
router.get(
  "/downloadReceipt/:receiptId/:changedBy",
  checkAuth,
  exchangeControllers.downloadReceipts
); // delete from client ssssside
router.delete("/delete-receipt", checkAuth, exchangeControllers.deleteReceipt);

//******/

router.get("/getFileType/:id", checkAuth, exchangeControllers.getById);
router.post("/addFileType", checkAuth, exchangeControllers.addFileType);
router.get("/getFileTypes", checkAuth, exchangeControllers.getFileTypes);
router.delete(
  "/delete-fileType",
  checkAuth,
  exchangeControllers.deleteFileType
);
router.patch("/editFileType", checkAuth, exchangeControllers.editFileType);

// ****************************************************************************

//client routes

router.get(
  "/relatedFilesVer/:exchangeId/:fileTypeId",
  checkAuth,
  exchangeControllers.relatedFilesVersions
);

router.get(
  "/relatedFiles/:exchangeId",
  checkAuth,
  exchangeControllers.relatedFiles
);

router.get(
  "/latestReceipts/:exchangeId",
  checkAuth,
  exchangeControllers.latestReceipts
);

router.get("/receipt/:id", checkAuth, exchangeControllers.getReceipt); //new - admin

// **************************************************************************
// admin routes and client

router.post(
  "/getExchangeWithLoginHistory/:exchangeId",
  checkAuth,
  exchangeControllers.getExchange
); // not anymore in client-side but there is  in admin side

router.get("/", checkAuth, exchangeControllers.getExchanges);

module.exports = router;
