const express = require("express");
const router = express.Router();

const resumeControllers = require("../controllers/resume-controller");
const checkAuth = require("../shared/checkAuth");
const upload = require("../shared/resume-uploader");

//admin - routes
router.post("/get-resumes", checkAuth, resumeControllers.getResumes);
router.post("/accepted-resumes", checkAuth, resumeControllers.acceptedResumes);
router.post("/refused-resumes", checkAuth, resumeControllers.refusedResumes);
router.patch("/accept-resumes", checkAuth, resumeControllers.acceptResumes);
router.patch("/refuse-resumes", checkAuth, resumeControllers.refuseResumes);
router.get("/fetch-resume/:id", checkAuth, resumeControllers.getResume);
router.get("/downloadResume/:id", checkAuth, resumeControllers.downloadResumes);

router.patch("/acceptResume/:id", checkAuth, resumeControllers.acceptResume);
router.patch("/refuseResume/:id", checkAuth, resumeControllers.refuseResume);
router.delete("/delete-resumes", checkAuth, resumeControllers.deleteResumes);
router.delete("/delete-resume/:id", checkAuth, resumeControllers.deleteResume);
///////////////////////////////////

// pannel - clientSide - routes
// router.patch("/send-resume", checkAuth, resumeControllers.sendResume); //site
// router.post(
//   "/upload-resume",
//   checkAuth,
//   upload.fields([{ name: "resume", maxCount: 1 }]),
//   resumeControllers.uploadResume
// );

//newwww site
router.post(
  "/upload",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  resumeControllers.uploadCV
);

module.exports = router;
