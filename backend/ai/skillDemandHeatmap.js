const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * Skill Demand Heatmap - Geographic intelligence system
 */
class SkillDemandHeatmap {
  constructor() {
    this.africanCountries = [
      'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana',
      'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Morocco',
      'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Zambia',
      'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique', 'Angola'
    ];

    this.techHubs = {
      'Nigeria': ['Lagos', 'Abuja', 'Port Harcourt'],
      'Kenya': ['Nairobi', 'Mombasa', 'Kisumu'],
      'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
      'Egypt': ['Cairo', 'Alexandria', 'Giza'],
      'Ghana': ['Accra', 'Kumasi', 'Takoradi'],
      'Rwanda': ['Kigali'],
      'Uganda': ['Kampala', 'Entebbe'],
      'Tanzania': ['Dar es Salaam', 'Arusha', 'Mwanza'],
      'Ethiopia': ['Addis Ababa', 'Dire Dawa'],
      'Morocco': ['Casablanca', 'Rabat', 'Marrakech']
    };

    this.skillCategories = {
      'Frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'HTML', 'CSS', 'JavaScript'],
      'Backend': ['Python', 'Node.js', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'],
      'Data Science': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Science', 'Statistics'],
      'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Terraform'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS'],
      'Database': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL'],
      'Cloud': ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Cloud Computing'],
      'AI/ML': ['Machine Learning', 'Deep Learning', 'AI', 'Neural Networks', 'NLP']
    };
  }

  /**
   * Get skill demand heatmap data for Africa
   */
  async getSkillDemandHeatmap() {
    try {
      const heatmapData = {};

      // Get data for each African country
      for (const country of this.africanCountries) {
        const countryData = await this.getCountrySkillData(country);
        heatmapData[country] = countryData;
      }

      // Calculate regional insights
      const regionalInsights = this.calculateRegionalInsights(heatmapData);
      
      // Get top skills globally
      const globalTopSkills = await this.getGlobalTopSkills();

      return {
        heatmapData,
        regionalInsights,
        globalTopSkills,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Heatmap generation error:', error);
      throw error;
    }
  }

  /**
   * Get skill data for a specific country
   */
  async getCountrySkillData(country) {
    try {
      const jobs = await Job.find({
        country: country,
        isActive: true
      }).select('skills salaryMin salaryMax city company').lean();

      if (jobs.length === 0) {
        return this.getDefaultCountryData(country);
      }

      // Analyze skills
      const skillAnalysis = this.analyzeCountrySkills(jobs);
      
      // Get top companies
      const topCompanies = this.getTopCompanies(jobs);
      
      // Calculate salary ranges
      const salaryRanges = this.calculateSalaryRanges(jobs);
      
      // Get city distribution
      const cityDistribution = this.getCityDistribution(jobs);

      return {
        country,
        totalJobs: jobs.length,
        topSkills: skillAnalysis.topSkills,
        skillCategories: skillAnalysis.categories,
        topCompanies,
        salaryRanges,
        cityDistribution,
        marketHeat: this.calculateMarketHeat(jobs.length, skillAnalysis.topSkills.length),
        techHubs: this.getTechHubData(country, jobs)
      };

    } catch (error) {
      console.error(`Country data error for ${country}:`, error);
      return this.getDefaultCountryData(country);
    }
  }

  /**
   * Analyze skills for a country
   */
  analyzeCountrySkills(jobs) {
    const skillFrequency = {};
    const categoryFrequency = {};

    jobs.forEach(job => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
          
          // Categorize skills
          const category = this.getSkillCategory(skill);
          if (category) {
            categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
          }
        });
      }
    });

    // Sort skills by frequency
    const topSkills = Object.entries(skillFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({
        skill,
        demand: count,
        percentage: Math.round((count / jobs.length) * 100)
      }));

    // Sort categories by frequency
    const categories = Object.entries(categoryFrequency)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({
        category,
        demand: count,
        percentage: Math.round((count / jobs.length) * 100)
      }));

    return { topSkills, categories };
  }

  /**
   * Get top companies in a country
   */
  getTopCompanies(jobs) {
    const companyFrequency = {};

    jobs.forEach(job => {
      if (job.company) {
        companyFrequency[job.company] = (companyFrequency[job.company] || 0) + 1;
      }
    });

    return Object.entries(companyFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([company, count]) => ({
        company,
        jobCount: count,
        percentage: Math.round((count / jobs.length) * 100)
      }));
  }

  /**
   * Calculate salary ranges for a country
   */
  calculateSalaryRanges(jobs) {
    const salaries = jobs
      .filter(job => job.salaryMin && job.salaryMax)
      .map(job => (job.salaryMin + job.salaryMax) / 2);

    if (salaries.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        currency: 'USD'
      };
    }

    salaries.sort((a, b) => a - b);
    
    return {
      average: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      min: Math.round(salaries[0]),
      max: Math.round(salaries[salaries.length - 1]),
      median: Math.round(salaries[Math.floor(salaries.length / 2)]),
      currency: 'USD'
    };
  }

  /**
   * Get city distribution
   */
  getCityDistribution(jobs) {
    const cityFrequency = {};

    jobs.forEach(job => {
      if (job.city) {
        cityFrequency[job.city] = (cityFrequency[job.city] || 0) + 1;
      }
    });

    return Object.entries(cityFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({
        city,
        jobCount: count,
        percentage: Math.round((count / jobs.length) * 100)
      }));
  }

  /**
   * Calculate market heat for a country
   */
  calculateMarketHeat(jobCount, uniqueSkills) {
    const jobScore = Math.min(jobCount / 100, 1) * 50; // Max 50 points for jobs
    const skillScore = Math.min(uniqueSkills / 20, 1) * 50; // Max 50 points for skills
    
    const totalScore = jobScore + skillScore;
    
    if (totalScore >= 80) return 'Very Hot';
    if (totalScore >= 60) return 'Hot';
    if (totalScore >= 40) return 'Warm';
    return 'Cool';
  }

  /**
   * Get tech hub data for a country
   */
  getTechHubData(country, jobs) {
    const hubs = this.techHubs[country] || [];
    const hubData = {};

    hubs.forEach(hub => {
      const hubJobs = jobs.filter(job => job.city === hub);
      hubData[hub] = {
        jobCount: hubJobs.length,
        topSkills: this.getTopSkillsForJobs(hubJobs),
        averageSalary: this.calculateAverageSalary(hubJobs)
      };
    });

    return hubData;
  }

  /**
   * Calculate regional insights
   */
  calculateRegionalInsights(heatmapData) {
    const regions = {
      'West Africa': ['Nigeria', 'Ghana', 'Ivory Coast', 'Senegal'],
      'East Africa': ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'],
      'Southern Africa': ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Mozambique', 'Angola'],
      'North Africa': ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan']
    };

    const regionalData = {};

    Object.entries(regions).forEach(([region, countries]) => {
      const regionCountries = countries.filter(country => heatmapData[country]);
      
      if (regionCountries.length > 0) {
        const totalJobs = regionCountries.reduce((sum, country) => sum + heatmapData[country].totalJobs, 0);
        const allSkills = regionCountries.flatMap(country => heatmapData[country].topSkills || []);
        
        // Get top skills for region
        const skillFrequency = {};
        allSkills.forEach(skillData => {
          skillFrequency[skillData.skill] = (skillFrequency[skillData.skill] || 0) + skillData.demand;
        });

        const topSkills = Object.entries(skillFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([skill, demand]) => ({ skill, demand }));

        regionalData[region] = {
          countries: regionCountries,
          totalJobs,
          topSkills,
          averageJobsPerCountry: Math.round(totalJobs / regionCountries.length),
          marketStatus: this.getRegionalMarketStatus(totalJobs, regionCountries.length)
        };
      }
    });

    return regionalData;
  }

  /**
   * Get global top skills
   */
  async getGlobalTopSkills() {
    try {
      const jobs = await Job.find({ isActive: true }).select('skills').lean();
      
      const skillFrequency = {};
      jobs.forEach(job => {
        if (job.skills && Array.isArray(job.skills)) {
          job.skills.forEach(skill => {
            skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
          });
        }
      });

      return Object.entries(skillFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([skill, count]) => ({
          skill,
          demand: count,
          countries: this.getSkillCountries(skill)
        }));

    } catch (error) {
      console.error('Global skills error:', error);
      return [];
    }
  }

  /**
   * Get countries where a skill is in demand
   */
  async getSkillCountries(skill) {
    try {
      const jobs = await Job.find({ 
        skills: skill, 
        isActive: true 
      }).select('country').lean();

      const countries = [...new Set(jobs.map(job => job.country))];
      return countries.slice(0, 5); // Top 5 countries
    } catch (error) {
      return [];
    }
  }

  /**
   * Get emerging tech trends
   */
  async getEmergingTech() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      // Get jobs from last 30 days
      const recentJobs = await Job.find({
        postedDate: { $gte: thirtyDaysAgo },
        isActive: true
      }).select('skills').lean();

      // Get jobs from 30-60 days ago
      const olderJobs = await Job.find({
        postedDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
        isActive: true
      }).select('skills').lean();

      const recentSkills = this.getSkillFrequency(recentJobs);
      const olderSkills = this.getSkillFrequency(olderJobs);

      // Calculate growth rates
      const growthRates = {};
      Object.keys(recentSkills).forEach(skill => {
        const recentCount = recentSkills[skill];
        const olderCount = olderSkills[skill] || 1;
        const growthRate = ((recentCount - olderCount) / olderCount) * 100;
        
        if (recentCount >= 5) { // Minimum threshold
          growthRates[skill] = {
            growthRate: Math.round(growthRate),
            recentCount,
            olderCount,
            trend: this.getTrendLabel(growthRate)
          };
        }
      });

      // Sort by growth rate
      const trendingSkills = Object.entries(growthRates)
        .sort(([,a], [,b]) => b.growthRate - a.growthRate)
        .slice(0, 10)
        .map(([skill, data]) => ({ skill, ...data }));

      return {
        trendingSkills,
        analysis: this.analyzeTechTrends(trendingSkills),
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Emerging tech error:', error);
      return { trendingSkills: [], analysis: {}, generatedAt: new Date() };
    }
  }

  /**
   * Get skill frequency from jobs
   */
  getSkillFrequency(jobs) {
    const frequency = {};
    jobs.forEach(job => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          frequency[skill] = (frequency[skill] || 0) + 1;
        });
      }
    });
    return frequency;
  }

  /**
   * Helper methods
   */
  getSkillCategory(skill) {
    for (const [category, skills] of Object.entries(this.skillCategories)) {
      if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        return category;
      }
    }
    return 'Other';
  }

  getTopSkillsForJobs(jobs) {
    const skillFrequency = {};
    jobs.forEach(job => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);
  }

  calculateAverageSalary(jobs) {
    const salaries = jobs
      .filter(job => job.salaryMin && job.salaryMax)
      .map(job => (job.salaryMin + job.salaryMax) / 2);

    if (salaries.length === 0) return 0;
    return Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  }

  getRegionalMarketStatus(totalJobs, countryCount) {
    const avgJobs = totalJobs / countryCount;
    if (avgJobs > 200) return 'Very Active';
    if (avgJobs > 100) return 'Active';
    if (avgJobs > 50) return 'Moderate';
    return 'Emerging';
  }

  getTrendLabel(growthRate) {
    if (growthRate > 50) return 'Explosive Growth';
    if (growthRate > 25) return 'Rapid Growth';
    if (growthRate > 10) return 'Growing';
    if (growthRate > 0) return 'Stable Growth';
    return 'Declining';
  }

  analyzeTechTrends(trendingSkills) {
    const categories = {
      'AI/ML': 0,
      'Cloud': 0,
      'Frontend': 0,
      'Backend': 0,
      'DevOps': 0,
      'Mobile': 0
    };

    trendingSkills.forEach(({ skill }) => {
      const category = this.getSkillCategory(skill);
      if (categories[category] !== undefined) {
        categories[category]++;
      }
    });

    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      topCategory: topCategory ? topCategory[0] : 'Other',
      categoryDistribution: categories,
      averageGrowthRate: Math.round(
        trendingSkills.reduce((sum, skill) => sum + skill.growthRate, 0) / trendingSkills.length
      )
    };
  }

  getDefaultCountryData(country) {
    return {
      country,
      totalJobs: 0,
      topSkills: [],
      skillCategories: [],
      topCompanies: [],
      salaryRanges: { average: 0, min: 0, max: 0, currency: 'USD' },
      cityDistribution: [],
      marketHeat: 'Cool',
      techHubs: {}
    };
  }
}

module.exports = new SkillDemandHeatmap();
