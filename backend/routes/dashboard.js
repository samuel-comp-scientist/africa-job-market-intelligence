const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Skill = require('../models/Skill');
const SalaryAnalytics = require('../models/SalaryAnalytics');
const { authenticate, jobseekerOnly, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get job seeker dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview data
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const userType = user.userType;
    
    // Route to appropriate dashboard based on user type
    if (userType === 'jobseeker') {
      return getJobSeekerOverview(req, res);
    } else if (userType === 'dataanalyst') {
      return getDataAnalystOverview(req, res);
    } else if (userType === 'recruiter') {
      return getRecruiterOverview(req, res);
    } else {
      res.status(400).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

/**
 * @swagger
 * /api/dashboard/analyst-overview:
 *   get:
 *     summary: Get data analyst dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data analyst dashboard data
 */
router.get('/analyst-overview', authenticate, authorize('dataanalyst'), async (req, res) => {
  try {
    const overview = await getDataAnalystOverview(req, res);
    return overview;
  } catch (error) {
    console.error('Data analyst dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch analyst dashboard data' });
  }
});

/**
 * @swagger
 * /api/dashboard/recruiter-overview:
 *   get:
 *     summary: Get recruiter dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recruiter dashboard data
 */
router.get('/recruiter-overview', authenticate, authorize('recruiter'), async (req, res) => {
  try {
    const overview = await getRecruiterOverview(req, res);
    return overview;
  } catch (error) {
    console.error('Recruiter dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch recruiter dashboard data' });
  }
});

// Job Seeker Dashboard Functions
async function getJobSeekerOverview(req, res) {
  const user = req.user;
  
  // Get user's current skills
  const userSkills = user.jobseekerProfile?.currentSkills || [];
  const skillNames = userSkills.map(skill => skill.name);
  
  // Get top demanded skills
  const topSkills = await Skill.getTopSkills(10);
  
  // Get market insights
  const latestSalaryAnalytics = await SalaryAnalytics.getLatest('monthly');
  
  // Get job recommendations based on user skills
  const jobRecommendations = await Job.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$skills' },
    { $match: { 'skills': { $in: skillNames } } },
    {
      $group: {
        _id: '$jobTitle',
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
        companies: { $addToSet: '$company' },
        locations: { $addToSet: '$country' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $project: {
        jobTitle: '$_id',
        demand: '$count',
        avgSalary: { $round: ['$avgSalary', 0] },
        companies: { $size: '$companies' },
        locations: { $size: '$locations' },
        _id: 0
      }
    }
  ]);

  // Get skill gap analysis
  const skillGapAnalysis = await analyzeSkillGap(userSkills, topSkills);
  
  // Get career recommendations
  const careerRecommendations = await getCareerRecommendations(user.jobseekerProfile?.careerLevel, skillNames);
  
  // Get market trends
  const marketTrends = await getMarketTrends();

  const profileComplete = calculateProfileCompleteness(user);

  res.json({
    user: {
      name: user.displayName,
      careerLevel: user.jobseekerProfile?.careerLevel,
      skillsCount: userSkills.length,
      profileComplete
    },
    insights: {
      topSkills: topSkills.slice(0, 5),
      salaryOverview: latestSalaryAnalytics?.overall || {},
      jobRecommendations,
      skillGapAnalysis,
      careerRecommendations,
      marketTrends
    },
    stats: {
      savedJobs: user.preferences?.dashboard?.savedJobs?.length || 0,
      savedSearches: user.preferences?.dashboard?.savedSearches?.length || 0,
      profileViews: user.activity?.profileViews || 0,
      lastLogin: user.activity?.lastLogin
    }
  });
}

// Data Analyst Dashboard Functions
async function getDataAnalystOverview(req, res) {
  // Get comprehensive market data for analysts
  const totalJobs = await Job.countDocuments({ isActive: true });
  const totalCompanies = await Job.distinct('company').then(companies => companies.length);
  const topSkills = await Skill.getTopSkills(20);
  
  // Get salary analytics
  const salaryAnalytics = await SalaryAnalytics.getLatest('monthly');
  
  // Get job trends
  const jobTrends = await Job.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$postedDate" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } },
    { $limit: 12 }
  ]);

  // Get country distribution
  const countryDistribution = await Job.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get skill demand growth
  const skillGrowth = await Skill.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        totalDemand: { $sum: '$demand.current.count' },
        avgGrowth: { $avg: '$growth.monthly' },
        skillCount: { $sum: 1 }
      }
    },
    { $sort: { totalDemand: -1 } }
  ]);

  res.json({
    overview: {
      totalJobs,
      totalCompanies,
      topSkills,
      salaryAnalytics,
      jobTrends,
      countryDistribution,
      skillGrowth
    },
    datasets: {
      jobs: {
        totalRecords: totalJobs,
        lastUpdated: new Date(),
        size: '124 MB'
      },
      skills: {
        totalRecords: await Skill.countDocuments(),
        lastUpdated: new Date(),
        size: '45 MB'
      },
      salaries: {
        totalRecords: await SalaryAnalytics.countDocuments(),
        lastUpdated: new Date(),
        size: '67 MB'
      }
    },
    metrics: {
      marketGrowth: 18.5,
      hiringGrowth: 24.5,
      salaryGrowth: 5.2,
      newCompanies: 89
    }
  });
}

// Recruiter Dashboard Functions
async function getRecruiterOverview(req, res) {
  // Get talent insights
  const availableTalent = await User.countDocuments({ 
    userType: 'jobseeker', 
    isActive: true 
  });
  
  const topSkills = await Skill.getTopSkills(10);
  
  // Get hiring trends
  const hiringTrends = await Job.aggregate([
    {
      $group: {
        _id: '$jobTitle',
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get company insights
  const topHiringCompanies = await Job.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$company',
        jobCount: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
        uniqueSkills: { $addToSet: '$skills' }
      }
    },
    { $sort: { jobCount: -1 } },
    { $limit: 20 }
  ]);

  // Get salary benchmarking data
  const salaryBySkill = await SalaryAnalytics.aggregate([
    { $match: { period: 'monthly' } },
    { $sort: { date: -1 } },
    { $limit: 1 },
    { $unwind: '$bySkill' },
    {
      $project: {
        skill: '$bySkill.skill',
        average: '$bySkill.average',
        minimum: '$bySkill.minimum',
        maximum: '$bySkill.maximum',
        growth: '$bySkill.growth'
      }
    },
    { $sort: { average: -1 } }
  ]);

  // Get country-specific data
  const talentByCountry = await Job.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$country',
        jobCount: { $sum: 1 },
        avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
        topSkills: { $push: '$skills' }
      }
    },
    { $sort: { jobCount: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    talent: {
      availableTalent,
      topSkills,
      talentByCountry
    },
    hiring: {
      trends: hiringTrends,
      growth: 24.5,
      activePostings: 8234,
      timeToFill: 32
    },
    benchmarking: {
      salaryBySkill,
      marketRates: salaryBySkill
    },
    competitors: {
      topHiringCompanies,
      marketLeaders: topHiringCompanies.slice(0, 5)
    },
    forecasts: {
      skillDemand: [
        { skill: 'Machine Learning', growth: '+45%', shortage: 'Critical' },
        { skill: 'Cloud Computing', growth: '+38%', shortage: 'High' },
        { skill: 'Cybersecurity', growth: '+52%', shortage: 'Critical' }
      ]
    }
  });
}

// Helper functions (reuse from previous implementation)
async function analyzeSkillGap(userSkills, topSkills) {
  const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
  const topSkillNames = topSkills.map(skill => skill.skill.toLowerCase());
  
  const hasSkills = userSkillNames.filter(skill => topSkillNames.includes(skill));
  const missingSkills = topSkillNames.filter(skill => !userSkillNames.includes(skill));
  
  return {
    hasSkills: hasSkills.length,
    missingSkills: missingSkills.slice(0, 10),
    gapPercentage: Math.round((missingSkills.length / topSkillNames.length) * 100)
  };
}

async function getCareerRecommendations(careerLevel, userSkills) {
  const recommendations = {
    'student': ['Junior Developer', 'Intern Developer', 'Junior QA Engineer'],
    'entry-level': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    'mid-level': ['Senior Developer', 'Tech Lead', 'DevOps Engineer'],
    'senior': ['Principal Engineer', 'Engineering Manager', 'Solution Architect'],
    'lead': ['Engineering Manager', 'CTO', 'VP Engineering'],
    'executive': ['CTO', 'VP Engineering', 'Director of Technology']
  };
  
  return recommendations[careerLevel] || recommendations['entry-level'];
}

async function getMarketTrends() {
  return {
    growingSkills: ['python', 'aws', 'react', 'typescript', 'docker'],
    decliningSkills: ['php', 'jquery', 'angularjs'],
    emergingTechnologies: ['web3', 'blockchain', 'ai/ml', 'edge computing'],
    marketGrowth: 12.5
  };
}

function calculateProfileCompleteness(user) {
  let score = 0;
  const maxScore = 100;
  
  // Basic profile (30 points)
  if (user.profile.firstName && user.profile.lastName) score += 10;
  if (user.profile.bio) score += 10;
  if (user.profile.location.country) score += 10;
  
  // Skills (30 points)
  const skillsCount = user.jobseekerProfile?.currentSkills?.length || 0;
  score += Math.min(skillsCount * 6, 30);
  
  // Experience (20 points)
  if (user.jobseekerProfile?.experience?.length > 0) score += 20;
  
  // Education (10 points)
  if (user.jobseekerProfile?.education?.length > 0) score += 10;
  
  // Preferences (10 points)
  if (user.jobseekerProfile?.targetRoles?.length > 0) score += 5;
  if (user.jobseekerProfile?.salaryExpectation) score += 5;
  
  return Math.min(score, maxScore);
}

module.exports = router;
