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
router.get("/salary-distribution", AnalyticsController.salaryDistribution);
router.get("/job-growth", AnalyticsController.jobGrowthByCountry);
router.get("/skill-demand", AnalyticsController.skillDemandByCategory);
router.get("/jobs-by-city", AnalyticsController.jobsByCity);
router.get("/skill-trends", AnalyticsController.trendsBySkill);
router.get("/industry-breakdown", AnalyticsController.industryBreakdown);
router.get("/advanced-stats", AnalyticsController.advancedStats);

module.exports = router;
