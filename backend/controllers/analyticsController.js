const AnalyticsService = require("../services/analyticsService");

class AnalyticsController {

  static async topSkills(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await AnalyticsService.getTopSkills(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top skills", message: error.message });
    }
  }

  static async jobsByCountry(req, res) {
    try {
      const data = await AnalyticsService.getJobsByCountry();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs by country", message: error.message });
    }
  }

  static async salaryBySkill(req, res) {
    try {
      const data = await AnalyticsService.getSalaryBySkill();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary by skill", message: error.message });
    }
  }

  static async jobTrends(req, res) {
    try {
      const data = await AnalyticsService.getJobTrends();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job trends", message: error.message });
    }
  }

  static async topCompanies(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await AnalyticsService.getTopCompanies(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top companies", message: error.message });
    }
  }

}

module.exports = AnalyticsController;
