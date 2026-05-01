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

  static async salaryByCountry(req, res) {
    try {
      const data = await AnalyticsService.getSalaryByCountry();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary by country", message: error.message });
    }
  }

  static async salaryBySeniority(req, res) {
    try {
      const data = await AnalyticsService.getSalaryBySeniority();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary by seniority", message: error.message });
    }
  }

  static async salaryByJobTitle(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 15;
      const data = await AnalyticsService.getSalaryByJobTitle(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary by job title", message: error.message });
    }
  }

  static async salaryDistribution(req, res) {
    try {
      const data = await AnalyticsService.getSalaryDistribution();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary distribution", message: error.message });
    }
  }

  static async jobGrowthByCountry(req, res) {
    try {
      const months = parseInt(req.query.months) || 12;
      const data = await AnalyticsService.getJobGrowthByCountry(months);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job growth by country", message: error.message });
    }
  }

  static async skillDemandByCategory(req, res) {
    try {
      const data = await AnalyticsService.getSkillDemandByCategory();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skill demand", message: error.message });
    }
  }

  static async jobsByCity(req, res) {
    try {
      const country = req.query.country;
      const data = await AnalyticsService.getJobsByCity(country);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs by city", message: error.message });
    }
  }

  static async trendsBySkill(req, res) {
    try {
      const skill = req.query.skill;
      if (!skill) return res.status(400).json({ error: "skill query parameter required" });
      const data = await AnalyticsService.getTrendsBySkill(skill);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends by skill", message: error.message });
    }
  }

  static async industryBreakdown(req, res) {
    try {
      const data = await AnalyticsService.getIndustryBreakdown();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch industry breakdown", message: error.message });
    }
  }

  static async advancedStats(req, res) {
    try {
      const data = await AnalyticsService.getAdvancedStats();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch advanced stats", message: error.message });
    }
  }

}

module.exports = AnalyticsController;
