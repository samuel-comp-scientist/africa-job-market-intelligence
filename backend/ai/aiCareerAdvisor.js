const Job = require('../models/Job');
const User = require('../models/User');

/**
 * AI Career Advisor - Advanced career intelligence system
 */
class AICareerAdvisor {
  constructor() {
    this.skillWeights = {
      'Python': 0.9,
      'JavaScript': 0.85,
      'React': 0.8,
      'Node.js': 0.8,
      'AWS': 0.75,
      'Docker': 0.7,
      'Machine Learning': 0.95,
      'Data Science': 0.95,
      'DevOps': 0.8,
      'SQL': 0.85
    };

    this.careerPaths = {
      'Data Scientist': {
        requiredSkills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Statistics'],
        averageSalary: { min: 2500, max: 4200 },
        demandLevel: 'Very High',
        growthRate: 0.25
      },
      'Frontend Developer': {
        requiredSkills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
        averageSalary: { min: 1800, max: 3200 },
        demandLevel: 'High',
        growthRate: 0.15
      },
      'Backend Developer': {
        requiredSkills: ['Python', 'Node.js', 'SQL', 'API', 'Docker'],
        averageSalary: { min: 2000, max: 3800 },
        demandLevel: 'High',
        growthRate: 0.18
      },
      'DevOps Engineer': {
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
        averageSalary: { min: 2800, max: 4500 },
        demandLevel: 'Very High',
        growthRate: 0.22
      },
      'Machine Learning Engineer': {
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'Statistics'],
        averageSalary: { min: 3000, max: 5000 },
        demandLevel: 'Very High',
        growthRate: 0.30
      },
      'Full Stack Developer': {
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Python'],
        averageSalary: { min: 2200, max: 4000 },
        demandLevel: 'Very High',
        growthRate: 0.20
      }
    };

    this.learningResources = {
      'Python': [
        { title: 'Python for Data Science', platform: 'Coursera', duration: '3 months', level: 'Beginner' },
        { title: 'Complete Python Bootcamp', platform: 'Udemy', duration: '2 months', level: 'Beginner' }
      ],
      'Machine Learning': [
        { title: 'Machine Learning A-Z', platform: 'Udemy', duration: '4 months', level: 'Intermediate' },
        { title: 'Deep Learning Specialization', platform: 'Coursera', duration: '5 months', level: 'Advanced' }
      ],
      'React': [
        { title: 'React - The Complete Guide', platform: 'Udemy', duration: '3 months', level: 'Intermediate' },
        { title: 'Modern React with Redux', platform: 'Udemy', duration: '2.5 months', level: 'Intermediate' }
      ],
      'AWS': [
        { title: 'AWS Solutions Architect', platform: 'Udemy', duration: '3 months', level: 'Intermediate' },
        { title: 'AWS Cloud Practitioner', platform: 'Coursera', duration: '2 months', level: 'Beginner' }
      ]
    };
  }

  /**
   * Generate personalized career advice
   */
  async generateCareerAdvice(userSkills, desiredCareer, country) {
    try {
      const careerPath = this.careerPaths[desiredCareer];
      if (!careerPath) {
        throw new Error('Career path not found');
      }

      // Analyze user's current skills
      const skillAnalysis = this.analyzeSkills(userSkills, careerPath.requiredSkills);
      
      // Calculate job probability score
      const jobProbability = this.calculateJobProbability(skillAnalysis, country);
      
      // Generate learning roadmap
      const learningRoadmap = this.generateLearningRoadmap(skillAnalysis.missingSkills);
      
      // Predict salary based on skills and location
      const salaryPrediction = this.predictSalary(skillAnalysis, careerPath, country);
      
      // Get market insights
      const marketInsights = await this.getMarketInsights(desiredCareer, country);

      return {
        targetCareer: desiredCareer,
        currentSkills: userSkills,
        skillAnalysis,
        jobProbability,
        salaryPrediction,
        learningRoadmap,
        marketInsights,
        country,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Career advice generation error:', error);
      throw error;
    }
  }

  /**
   * Analyze user skills against career requirements
   */
  analyzeSkills(userSkills, requiredSkills) {
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));
    const requiredSkillSet = new Set(requiredSkills.map(s => s.toLowerCase()));
    
    const matchingSkills = userSkills.filter(skill => 
      requiredSkillSet.has(skill.toLowerCase())
    );
    
    const missingSkills = requiredSkills.filter(skill => 
      !userSkillSet.has(skill.toLowerCase())
    );

    const skillScore = matchingSkills.length / requiredSkills.length;
    const weightedScore = matchingSkills.reduce((score, skill) => {
      return score + (this.skillWeights[skill] || 0.5);
    }, 0) / requiredSkills.length;

    return {
      matchingSkills,
      missingSkills,
      skillScore: Math.round(skillScore * 100),
      weightedScore: Math.round(weightedScore * 100),
      readinessLevel: this.getReadinessLevel(skillScore)
    };
  }

  /**
   * Calculate job probability based on skills and location
   */
  calculateJobProbability(skillAnalysis, country) {
    const baseProbability = skillAnalysis.weightedScore / 100;
    
    // Country multipliers based on market demand
    const countryMultipliers = {
      'Nigeria': 1.2,
      'Kenya': 1.1,
      'South Africa': 1.3,
      'Egypt': 1.0,
      'Ghana': 0.9
    };

    const countryMultiplier = countryMultipliers[country] || 1.0;
    const probability = Math.min(95, baseProbability * countryMultiplier * 100);

    return {
      score: Math.round(probability),
      level: this.getProbabilityLevel(probability),
      factors: {
        skills: Math.round(baseProbability * 100),
        location: Math.round((countryMultiplier - 1) * 100),
        marketDemand: Math.round((probability - baseProbability * 100) / 2)
      }
    };
  }

  /**
   * Predict salary based on skills and location
   */
  predictSalary(skillAnalysis, careerPath, country) {
    const baseSalary = careerPath.averageSalary;
    const skillBonus = (skillAnalysis.weightedScore / 100) * 0.3; // 30% max bonus for skills
    
    // Country salary adjustments
    const countryAdjustments = {
      'Nigeria': 1.1,
      'Kenya': 1.05,
      'South Africa': 1.2,
      'Egypt': 0.95,
      'Ghana': 0.9
    };

    const countryMultiplier = countryAdjustments[country] || 1.0;
    const adjustedMin = Math.round(baseSalary.min * (1 + skillBonus) * countryMultiplier);
    const adjustedMax = Math.round(baseSalary.max * (1 + skillBonus) * countryMultiplier);

    return {
      estimated: {
        min: adjustedMin,
        max: adjustedMax,
        average: Math.round((adjustedMin + adjustedMax) / 2),
        currency: 'USD'
      },
      market: {
        min: baseSalary.min,
        max: baseSalary.max,
        average: Math.round((baseSalary.min + baseSalary.max) / 2),
        currency: 'USD'
      },
      potential: Math.round(((adjustedMax - baseSalary.max) / baseSalary.max) * 100)
    };
  }

  /**
   * Generate learning roadmap for missing skills
   */
  generateLearningRoadmap(missingSkills) {
    const roadmap = [];
    
    missingSkills.forEach((skill, index) => {
      const resources = this.learningResources[skill] || [];
      const priority = this.getSkillPriority(skill);
      const estimatedTime = this.getSkillTimeEstimate(skill);
      
      roadmap.push({
        skill,
        priority,
        estimatedTime,
        resources: resources.slice(0, 2), // Top 2 resources
        order: index + 1
      });
    });

    // Sort by priority
    roadmap.sort((a, b) => b.priority - a.priority);

    return {
      totalSkills: missingSkills.length,
      estimatedTotalTime: roadmap.reduce((total, skill) => total + skill.estimatedTime, 0),
      skills: roadmap,
      recommendedPath: this.createLearningPath(roadmap)
    };
  }

  /**
   * Get market insights for specific career and country
   */
  async getMarketInsights(career, country) {
    try {
      // Get jobs data for this career in the country
      const countryJobs = await Job.find({
        country: country,
        jobTitle: { $regex: career, $options: 'i' },
        isActive: true
      }).select('salaryMin salaryMax skills postedDate').lean();

      if (countryJobs.length === 0) {
        return this.getDefaultMarketInsights(career, country);
      }

      const salaries = countryJobs.map(job => (job.salaryMin + job.salaryMax) / 2);
      const allSkills = countryJobs.flatMap(job => job.skills || []);
      const skillFrequency = {};

      allSkills.forEach(skill => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
      });

      const topSkills = Object.entries(skillFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, demand: count }));

      return {
        jobMarket: {
          availablePositions: countryJobs.length,
          averageSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
          salaryRange: {
            min: Math.round(Math.min(...salaries)),
            max: Math.round(Math.max(...salaries))
          }
        },
        topSkills,
        competition: this.assessCompetition(countryJobs.length),
        growthTrend: this.calculateGrowthTrend(countryJobs)
      };

    } catch (error) {
      console.error('Market insights error:', error);
      return this.getDefaultMarketInsights(career, country);
    }
  }

  /**
   * Analyze uploaded resume
   */
  async analyzeResume(resumeText, targetCareer) {
    try {
      // Extract skills from resume text
      const extractedSkills = this.extractSkillsFromText(resumeText);
      
      // Get career requirements
      const careerPath = this.careerPaths[targetCareer];
      if (!careerPath) {
        throw new Error('Career path not found');
      }

      // Analyze skill match
      const skillAnalysis = this.analyzeSkills(extractedSkills, careerPath.requiredSkills);
      
      // Calculate compatibility score
      const compatibilityScore = this.calculateResumeCompatibility(skillAnalysis, extractedSkills);
      
      // Generate improvement suggestions
      const improvements = this.generateImprovementSuggestions(skillAnalysis, targetCareer);

      return {
        extractedSkills,
        skillAnalysis,
        compatibilityScore,
        improvements,
        targetCareer,
        analyzedAt: new Date()
      };

    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  /**
   * Extract skills from text using NLP
   */
  extractSkillsFromText(text) {
    const allSkills = Object.keys(this.skillWeights);
    const foundSkills = [];
    
    allSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)];
  }

  /**
   * Helper methods
   */
  getReadinessLevel(score) {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Developing';
    return 'Beginner';
  }

  getProbabilityLevel(score) {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  getSkillPriority(skill) {
    const highPrioritySkills = ['Python', 'Machine Learning', 'React', 'AWS'];
    return highPrioritySkills.includes(skill) ? 10 : 7;
  }

  getSkillTimeEstimate(skill) {
    const timeMap = {
      'Python': 2,
      'JavaScript': 2,
      'React': 3,
      'Machine Learning': 4,
      'AWS': 3,
      'Docker': 2,
      'SQL': 1
    };
    return timeMap[skill] || 2;
  }

  createLearningPath(roadmap) {
    return roadmap
      .filter(skill => skill.priority >= 8)
      .map(skill => skill.skill)
      .slice(0, 3);
  }

  assessCompetition(jobCount) {
    if (jobCount > 100) return 'Low';
    if (jobCount > 50) return 'Medium';
    return 'High';
  }

  calculateGrowthTrend(jobs) {
    const recentJobs = jobs.filter(job => 
      new Date(job.postedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    const growthRate = recentJobs.length / jobs.length;
    if (growthRate > 0.3) return 'Rapidly Growing';
    if (growthRate > 0.1) return 'Growing';
    return 'Stable';
  }

  getDefaultMarketInsights(career, country) {
    const careerPath = this.careerPaths[career];
    return {
      jobMarket: {
        availablePositions: Math.floor(Math.random() * 100) + 50,
        averageSalary: Math.round((careerPath.averageSalary.min + careerPath.averageSalary.max) / 2),
        salaryRange: careerPath.averageSalary
      },
      topSkills: careerPath.requiredSkills.slice(0, 5).map(skill => ({ skill, demand: Math.floor(Math.random() * 50) + 10 })),
      competition: 'Medium',
      growthTrend: 'Growing'
    };
  }

  calculateResumeCompatibility(skillAnalysis, extractedSkills) {
    const skillScore = skillAnalysis.skillScore;
    const skillVarietyBonus = Math.min(extractedSkills.length * 2, 20);
    const totalScore = Math.min(95, skillScore + skillVarietyBonus);
    
    return {
      score: totalScore,
      level: this.getCompatibilityLevel(totalScore),
      breakdown: {
        skillMatch: skillScore,
        skillVariety: skillVarietyBonus
      }
    };
  }

  getCompatibilityLevel(score) {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Strong Match';
    if (score >= 55) return 'Good Match';
    return 'Needs Improvement';
  }

  generateImprovementSuggestions(skillAnalysis, targetCareer) {
    const suggestions = [];
    
    skillAnalysis.missingSkills.forEach(skill => {
      suggestions.push({
        skill,
        importance: this.getSkillImportance(skill, targetCareer),
        timeframe: this.getSkillTimeEstimate(skill),
        resources: this.learningResources[skill] || []
      });
    });

    return suggestions.sort((a, b) => b.importance - a.importance);
  }

  getSkillImportance(skill, career) {
    const careerPath = this.careerPaths[career];
    const skillIndex = careerPath.requiredSkills.indexOf(skill);
    return skillIndex === -1 ? 5 : (careerPath.requiredSkills.length - skillIndex) * 10;
  }
}

module.exports = new AICareerAdvisor();
