const express = require("express");
const router = express.Router();

const AnalyticsController = require("../controllers/analyticsController");

router.get("/top-skills", AnalyticsController.topSkills);
router.get("/countries", AnalyticsController.jobsByCountry);
router.get("/salary", AnalyticsController.salaryBySkill);
router.get("/salary-by-country", AnalyticsController.salaryByCountry);
router.get("/salary-by-seniority", AnalyticsController.salaryBySeniority);
router.get("/salary-by-title", AnalyticsController.salaryByJobTitle);
router.get("/trends", AnalyticsController.jobTrends);
router.get("/companies", AnalyticsController.topCompanies);

module.exports = router;
