const express = require("express");
const router = express.Router();

const jobControllers = require("../controllers/job-controllers");
const checkAuth = require("../shared/checkAuth");

router.post("/jobs", jobControllers.getJobs);
router.get("/employmentTypes", jobControllers.getEmploymentTypes);
router.post("/relatedJobs", jobControllers.getRelatedJobs);

router.get("/:id", jobControllers.getJob);

//admin
router.post("/getJobs", jobControllers.getJobsBySite); //site
router.post("/", checkAuth , jobControllers.getJobsByAdmin); //admin
router.get("/admin/:id", checkAuth, jobControllers.getJobByAdmin);
router.post("/search-job", checkAuth, jobControllers.searchJob);
router.put("/edit-job", checkAuth, jobControllers.editJob);
router.post("/add-job", checkAuth, jobControllers.addJob);

router.delete("/", checkAuth, jobControllers.deleteJob);

module.exports = router;
