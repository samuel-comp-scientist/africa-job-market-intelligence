const express = require("express");
const router = express.Router();

const AnalyticsController = require("../controllers/analyticsController");

router.get("/top-skills", AnalyticsController.topSkills);
router.get("/countries", AnalyticsController.jobsByCountry);
router.get("/salary", AnalyticsController.salaryBySkill);
router.get("/trends", AnalyticsController.jobTrends);
router.get("/companies", AnalyticsController.topCompanies);

module.exports = router;
