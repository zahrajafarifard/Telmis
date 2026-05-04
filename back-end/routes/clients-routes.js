const express = require("express");
const router = express.Router();

const clientsControllers = require("../controllers/clients-controller");
const checkAuth = require("../shared/checkAuth");
// const fileUpload = require("../shared/fileUpload-main");
const upload = require("../shared/file-upload-article"); //check it for client upload profilephoto

/////////////////////////////////////////////new APIs///////////////////////////////
router.post("/signInUp", clientsControllers.signInUp);
router.post("/verify", clientsControllers.verifyOTP);
router.post("/resend-otp", clientsControllers.resendOTP);
router.get("/fetch-user", checkAuth, clientsControllers.fetchUser);
/////////////////////////////////////////////new APIs///////////////////////////////

/////////pannel

router.post("/notifications", checkAuth, clientsControllers.getNotification); // get to post pagina
router.get(
  "/notifications/latest",
  checkAuth,
  clientsControllers.getLatestNotification
);

// site new:

router.delete("/address/:id", checkAuth, clientsControllers.deleteAddress);
router.post("/address", checkAuth, clientsControllers.insertAddress);
router.get("/address/:addressId", checkAuth, clientsControllers.getAddress);
router.get("/addresses", checkAuth, clientsControllers.getAddresses);
router.patch("/addresses", checkAuth, clientsControllers.editAddresses);
router.get("/", checkAuth, clientsControllers.getClient);

//////////////////////////////////

// router.post("/checkMobile", clientsControllers.checkMobile);
// router.post("/login", clientsControllers.signIn);
// router.post("/signUp", clientsControllers.signUp);

/////////pannel

// router.post("/regenerateCredentials", clientsControllers.regenerateCredentials);
// router.post("/regenerate-capcha", clientsControllers.regenerateCapcha);

router.post("/", checkAuth, clientsControllers.getUserWithLoginHistory);

router.patch(
  "/",
  checkAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  clientsControllers.update
);

module.exports = router;
