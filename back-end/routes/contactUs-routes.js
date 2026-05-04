const express = require("express");
const router = express.Router();

const checkAuth = require("../shared/checkAuth");
const contactUsController = require("../controllers/contactUs-controllers");

//admin -side
router.post("/", checkAuth, contactUsController.getComments);

//site
router.post("/comment", contactUsController.submitComment);

module.exports = router;
