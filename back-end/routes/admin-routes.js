const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");
const checkAuth = require("../shared/checkAuth");

router.post("/checkSecurityCode", adminController.checkSecurityCode);

router.post("/generateSecurityCode", adminController.generateSecurityCode);
router.patch("/set-new-password", adminController.setNewPassword);
router.post("/login", adminController.login);
router.get("/admin-profile", checkAuth, adminController.adminProfile);
router.get("/", adminController.signUp);
router.patch("/updateCredential", checkAuth , adminController.updateCredential);

//check do they exist??
router.get("/getAllVisits", adminController.getAllVisits);
router.post("/sendSMS", adminController.sendSMS);

module.exports = router;
