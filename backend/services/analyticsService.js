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

  static async getSalaryDistribution() {
    const results = await Job.getSalaryDistribution();
    return results;
  }

  static async getJobGrowthByCountry(months = 12) {
    const results = await Job.getJobGrowthByCountry(months);
    return results;
  }

  static async getSkillDemandByCategory() {
    const results = await Job.getSkillDemandByCategory();
    return results;
  }

  static async getJobsByCity(country) {
    const results = await Job.getJobsByCity(country);
    return results;
  }

  static async getTrendsBySkill(skill) {
    const results = await Job.getTrendsBySkill(skill);
    return results;
  }

  static async getIndustryBreakdown() {
    const results = await Job.getIndustryBreakdown();
    return results;
  }

  static async getAdvancedStats() {
    const [totalJobs, activeJobs, withSalary, countries, skills, companies] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Job.countDocuments({ isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] }),
      Job.distinct('country', { isActive: true }),
      Job.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills' } },
        { $count: 'total' }
      ]),
      Job.distinct('company', { isActive: true })
    ]);
    return {
      totalJobs,
      activeJobs,
      withSalary,
      countries: countries.length,
      uniqueSkills: skills[0]?.total || 0,
      companies: companies.length,
      lastUpdated: new Date().toISOString()
    };
  }

}

module.exports = AnalyticsService;
