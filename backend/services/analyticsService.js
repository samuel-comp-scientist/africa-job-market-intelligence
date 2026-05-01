const Job = require("../models/Job");

class AnalyticsService {

  static async getTopSkills(limit = 10) {
    const results = await Job.getTopSkills(limit);
    return results;
  }

  static async getJobsByCountry() {
    const results = await Job.getJobsByCountry();
    return results.map(r => ({
      country: r._id,
      count: r.count,
      avgSalary: Math.round(r.avgSalary)
    }));
  }

  static async getSalaryBySkill() {
    const results = await Job.getSalaryBySkill();
    return results.sort((a, b) => b.avgSalary - a.avgSalary);
  }

  static async getJobTrends() {
    const results = await Job.getJobTrends();
    const trend = {};
    results.forEach(r => {
      trend[r._id] = r.count;
    });
    return trend;
  }

  static async getTopCompanies(limit = 10) {
    const results = await Job.getTopCompanies(limit);
    return results.map(r => ({
      company: r._id,
      count: r.count
    }));
  }

  static async getSalaryByCountry() {
    const results = await Job.getSalaryByCountry();
    return results;
  }

  static async getSalaryBySeniority() {
    const results = await Job.getSalaryBySeniority();
    return results;
  }

  static async getSalaryByJobTitle(limit = 15) {
    const results = await Job.getSalaryByJobTitle(limit);
    return results;
  }

}

module.exports = AnalyticsService;
