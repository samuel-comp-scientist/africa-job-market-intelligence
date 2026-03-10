const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const aiCareerAdvisor = require('../ai/aiCareerAdvisor');
const skillDemandHeatmap = require('../ai/skillDemandHeatmap');
const jobMarketForecasting = require('../ai/jobMarketForecasting');
const aiResumeAnalyzer = require('../ai/aiResumeAnalyzer');
const Job = require('../models/Job');
const User = require('../models/User');

// Admin middleware
const requireAdmin = (req, res, next) => {
  next(); // Simplified for now
};

/**
 * AI Career Advisor Routes
 */

// Generate career advice
router.post('/career-advisor', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userSkills, desiredCareer, country } = req.body;
    
    if (!userSkills || !Array.isArray(userSkills) || !desiredCareer || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields: userSkills (array), desiredCareer, country' 
      });
    }

    const advice = await aiCareerAdvisor.generateCareerAdvice(userSkills, desiredCareer, country);
    
    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Career advisor error:', error);
    res.status(500).json({ error: 'Failed to generate career advice' });
  }
});

// Analyze resume
router.post('/resume-analyzer', authenticate, requireAdmin, async (req, res) => {
  try {
    const { resumeText, targetCareer, country } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const analysis = await aiResumeAnalyzer.analyzeResume(resumeText, targetCareer, country);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Resume analyzer error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

/**
 * Skill Demand Heatmap Routes
 */

// Get skill demand heatmap
router.get('/skill-heatmap', authenticate, requireAdmin, async (req, res) => {
  try {
    const heatmap = await skillDemandHeatmap.getSkillDemandHeatmap();
    
    res.json({
      success: true,
      data: heatmap
    });
  } catch (error) {
    console.error('Skill heatmap error:', error);
    res.status(500).json({ error: 'Failed to generate skill heatmap' });
  }
});

// Get emerging technologies
router.get('/emerging-tech', authenticate, requireAdmin, async (req, res) => {
  try {
    const emergingTech = await skillDemandHeatmap.getEmergingTech();
    
    res.json({
      success: true,
      data: emergingTech
    });
  } catch (error) {
    console.error('Emerging tech error:', error);
    res.status(500).json({ error: 'Failed to get emerging technologies' });
  }
});

/**
 * Job Market Forecasting Routes
 */

// Generate market forecast
router.get('/market-forecast', authenticate, requireAdmin, async (req, res) => {
  try {
    const { timeframe = '12months' } = req.query;
    
    const forecast = await jobMarketForecasting.generateMarketForecast(timeframe);
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Market forecast error:', error);
    res.status(500).json({ error: 'Failed to generate market forecast' });
  }
});

/**
 * Smart Job Recommendations
 */

// Get personalized job recommendations
router.post('/job-recommendations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userSkills, targetCareer, country, limit = 10 } = req.body;
    
    if (!userSkills || !Array.isArray(userSkills) || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields: userSkills (array), country' 
      });
    }

    const recommendations = await aiResumeAnalyzer.generateJobRecommendations(
      userSkills, targetCareer, country
    );
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Job recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate job recommendations' });
  }
});

/**
 * Learning Resource Recommendations
 */

// Get learning resources for missing skills
router.post('/learning-resources', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userSkills, desiredCareer } = req.body;
    
    if (!userSkills || !Array.isArray(userSkills) || !desiredCareer) {
      return res.status(400).json({ 
        error: 'Missing required fields: userSkills (array), desiredCareer' 
      });
    }

    // Get career requirements
    const careerRequirements = aiCareerAdvisor.careerPaths[desiredCareer];
    if (!careerRequirements) {
      return res.status(400).json({ error: 'Invalid career path' });
    }

    const missingSkills = careerRequirements.requiredSkills.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const resources = {};
    missingSkills.forEach(skill => {
      resources[skill] = aiCareerAdvisor.learningResources[skill] || [];
    });

    res.json({
      success: true,
      data: {
        missingSkills,
        resources,
        totalMissing: missingSkills.length,
        completionRate: Math.round(((careerRequirements.requiredSkills.length - missingSkills.length) / careerRequirements.requiredSkills.length) * 100)
      }
    });
  } catch (error) {
    console.error('Learning resources error:', error);
    res.status(500).json({ error: 'Failed to get learning resources' });
  }
});

/**
 * Tech Ecosystem Insights
 */

// Get top tech hubs
router.get('/tech-hubs', authenticate, requireAdmin, async (req, res) => {
  try {
    const { country, limit = 10 } = req.query;
    
    let matchQuery = { isActive: true };
    if (country) {
      matchQuery.country = country;
    }

    const hubs = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { country: '$country', city: '$city' },
          jobCount: { $sum: 1 },
          topSkills: { $push: '$skills' },
          averageSalary: {
            $avg: {
              $avg: ['$salaryMin', '$salaryMax']
            }
          }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          country: '$_id.country',
          city: '$_id.city',
          jobCount: 1,
          averageSalary: { $round: ['$averageSalary', 0] },
          topSkills: { $slice: ['$topSkills', 5] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        hubs,
        totalHubs: hubs.length
      }
    });
  } catch (error) {
    console.error('Tech hubs error:', error);
    res.status(500).json({ error: 'Failed to get tech hubs' });
  }
});

// Get fastest growing markets
router.get('/growing-markets', authenticate, requireAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const recentJobs = await Job.countDocuments({
      postedDate: { $gte: thirtyDaysAgo },
      isActive: true
    });

    const olderJobs = await Job.countDocuments({
      postedDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      isActive: true
    });

    const growthRate = olderJobs > 0 ? ((recentJobs - olderJobs) / olderJobs) * 100 : 0;

    // Get country-wise growth
    const countryGrowth = await Job.aggregate([
      {
        $match: {
          postedDate: { $gte: sixtyDaysAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            country: '$country',
            period: {
              $cond: {
                if: { $gte: ['$postedDate', thirtyDaysAgo] },
                then: 'recent',
                else: 'older'
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.country',
          recent: {
            $sum: {
              $cond: {
                if: { $eq: ['$_id.period', 'recent'] },
                then: '$count',
                else: 0
              }
            }
          },
          older: {
            $sum: {
              $cond: {
                if: { $eq: ['$_id.period', 'older'] },
                then: '$count',
                else: 0
              }
            }
          }
        }
      },
      {
        $addFields: {
          growthRate: {
            $cond: {
              if: { $gt: ['$older', 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$recent', '$older'] },
                      '$older'
                    ]
                  },
                  100
                ]
              },
              else: 0
            }
          }
        }
      },
      { $sort: { growthRate: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overallGrowthRate: Math.round(growthRate * 10) / 10,
        countryGrowth,
        totalRecentJobs: recentJobs,
        totalOlderJobs: olderJobs
      }
    });
  } catch (error) {
    console.error('Growing markets error:', error);
    res.status(500).json({ error: 'Failed to get growing markets' });
  }
});

/**
 * Company Intelligence
 */

// Get top hiring companies
router.get('/top-companies', authenticate, requireAdmin, async (req, res) => {
  try {
    const { country, limit = 10 } = req.query;
    
    let matchQuery = { isActive: true };
    if (country) {
      matchQuery.country = country;
    }

    const companies = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$company',
          jobCount: { $sum: 1 },
          countries: { $addToSet: '$country' },
          skills: { $push: '$skills' },
          salaryRanges: {
            $push: {
              min: '$salaryMin',
              max: '$salaryMax'
            }
          }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          company: '$_id',
          jobCount: 1,
          countries: 1,
          averageSalary: {
            $round: [
              {
                $avg: [
                  { $avg: ['$salaryRanges.min', '$salaryRanges.max'] }
                ]
              },
              0
            ]
          },
          topSkills: { $slice: [{ $slice: ['$skills', 5] }, 0, 5] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        companies,
        totalCompanies: companies.length
      }
    });
  } catch (error) {
    console.error('Top companies error:', error);
    res.status(500).json({ error: 'Failed to get top companies' });
  }
});

/**
 * Data Science Playground
 */

// Get dataset statistics
router.get('/dataset-stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalCompanies = await Company.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get skill distribution
    const skillDistribution = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
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
      { $sort: { count: -1 } }
    ]);

    // Get salary statistics
    const salaryStats = await Job.aggregate([
      { $match: { isActive: true, salaryMin: { $exists: true }, salaryMax: { $exists: true } } },
      {
        $group: {
          _id: null,
          averageSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
          minSalary: { $min: '$salaryMin' },
          maxSalary: { $max: '$salaryMax' },
          medianSalary: { $median: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          totalCompanies,
          totalUsers
        },
        skillDistribution,
        countryDistribution,
        salaryStats: salaryStats[0] || {}
      }
    });
  } catch (error) {
    console.error('Dataset stats error:', error);
    res.status(500).json({ error: 'Failed to get dataset statistics' });
  }
});

// Custom query builder
router.post('/custom-query', authenticate, requireAdmin, async (req, res) => {
  try {
    const { 
      countries, 
      skills, 
      salaryMin, 
      salaryMax, 
      postedAfter, 
      limit = 100 
    } = req.body;

    let matchQuery = { isActive: true };

    if (countries && Array.isArray(countries)) {
      matchQuery.country = { $in: countries };
    }

    if (skills && Array.isArray(skills)) {
      matchQuery.skills = { $in: skills };
    }

    if (salaryMin || salaryMax) {
      matchQuery.salaryMin = {};
      if (salaryMin) matchQuery.salaryMin.$gte = salaryMin;
      if (salaryMax) matchQuery.salaryMin.$lte = salaryMax;
    }

    if (postedAfter) {
      matchQuery.postedDate = { $gte: new Date(postedAfter) };
    }

    const results = await Job.find(matchQuery)
      .select('jobTitle company country city skills salaryMin salaryMax postedDate')
      .limit(parseInt(limit))
      .sort({ postedDate: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        results,
        total: results.length,
        query: matchQuery
      }
    });
  } catch (error) {
    console.error('Custom query error:', error);
    res.status(500).json({ error: 'Failed to execute custom query' });
  }
});

module.exports = router;
