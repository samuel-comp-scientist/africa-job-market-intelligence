const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const aiCareerAdvisor = require('../ai/aiCareerAdvisor');
const skillDemandHeatmap = require('../ai/skillDemandHeatmap');
const jobMarketForecasting = require('../ai/jobMarketForecasting');
const aiResumeAnalyzer = require('../ai/aiResumeAnalyzer');

/**
 * User Role-Based Routes - Different interactions with scraper data
 */

// Middleware to check user role
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied for your role' });
    }
    
    next();
  };
};

// ========================================
// 1️⃣ JOB SEEKER ROUTES
// ========================================

// Get skill demand insights for job seekers
router.get('/job-seeker/skill-demand', authenticate, checkRole(['jobseeker', 'user']), async (req, res) => {
  try {
    const { country, limit = 20 } = req.query;
    
    // Get skill demand from scraped jobs
    const skillDemand = await Job.aggregate([
      { $match: country ? { country, isActive: true } : { isActive: true } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          skill: '$_id',
          demand: '$count',
          averageSalary: { $round: ['$avgSalary', 0] },
          demandLevel: {
            $cond: {
              if: { $gte: ['$count', 100] },
              then: 'Very High',
              else: {
                $cond: {
                  if: { $gte: ['$count', 50] },
                  then: 'High',
                  else: {
                    $cond: {
                      if: { $gte: ['$count', 20] },
                      then: 'Medium',
                      else: 'Low'
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        skillDemand,
        totalSkills: skillDemand.length,
        country: country || 'All Africa',
        insights: {
          topSkill: skillDemand[0]?.skill || 'Python',
          averageDemand: skillDemand.reduce((sum, skill) => sum + skill.demand, 0) / skillDemand.length,
          highDemandSkills: skillDemand.filter(skill => skill.demandLevel === 'Very High').length
        }
      }
    });
  } catch (error) {
    console.error('Job seeker skill demand error:', error);
    res.status(500).json({ error: 'Failed to fetch skill demand' });
  }
});

// Get salary intelligence for job seekers
router.get('/job-seeker/salary-intelligence', authenticate, checkRole(['jobseeker', 'user']), async (req, res) => {
  try {
    const { skill, country, role } = req.query;
    
    let matchQuery = { isActive: true };
    if (skill) matchQuery.skills = { $in: [skill] };
    if (country) matchQuery.country = country;
    if (role) matchQuery.jobTitle = { $regex: role, $options: 'i' };

    const salaryData = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            skill: '$skills',
            country: '$country',
            role: '$jobTitle'
          },
          minSalary: { $min: '$salaryMin' },
          maxSalary: { $max: '$salaryMax' },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgSalary: -1 } },
      {
        $project: {
          skill: '$_id.skill',
          country: '$_id.country',
          role: '$_id.role',
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          averageSalary: { $round: ['$avgSalary', 0] },
          jobCount: '$count',
          currency: 'USD'
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        salaryData,
        insights: {
          overallAverage: salaryData.reduce((sum, item) => sum + item.averageSalary, 0) / salaryData.length,
          highestPaying: salaryData[0],
          salaryRange: {
            min: Math.min(...salaryData.map(item => item.minSalary)),
            max: Math.max(...salaryData.map(item => item.maxSalary))
          }
        }
      }
    });
  } catch (error) {
    console.error('Job seeker salary intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch salary intelligence' });
  }
});

// Job explorer for job seekers
router.get('/job-seeker/explore', authenticate, checkRole(['jobseeker', 'user']), async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      country, 
      salaryMin, 
      salaryMax, 
      page = 1, 
      limit = 20 
    } = req.query;

    let matchQuery = { isActive: true };
    
    if (search) {
      matchQuery.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [search] } }
      ];
    }
    
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      matchQuery.skills = { $in: skillArray };
    }
    
    if (country) {
      matchQuery.country = country;
    }
    
    if (salaryMin || salaryMax) {
      matchQuery.salaryMin = {};
      if (salaryMin) matchQuery.salaryMin.$gte = parseInt(salaryMin);
      if (salaryMax) matchQuery.salaryMin.$lte = parseInt(salaryMax);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(matchQuery)
      .select('jobTitle company country city skills salaryMin salaryMax postedDate')
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(matchQuery);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalJobs: total,
          hasNext: skip + jobs.length < total,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          search,
          skills,
          country,
          salaryRange: { min: salaryMin, max: salaryMax }
        }
      }
    });
  } catch (error) {
    console.error('Job explorer error:', error);
    res.status(500).json({ error: 'Failed to explore jobs' });
  }
});

// Skill gap analyzer for job seekers
router.post('/job-seeker/skill-gap', authenticate, checkRole(['jobseeker', 'user']), async (req, res) => {
  try {
    const { currentSkills, targetCareer, country } = req.body;
    
    if (!currentSkills || !Array.isArray(currentSkills) || !targetCareer) {
      return res.status(400).json({ 
        error: 'Missing required fields: currentSkills (array), targetCareer' 
      });
    }

    // Use AI Career Advisor to analyze skill gaps
    const analysis = await aiCareerAdvisor.generateCareerAdvice(currentSkills, targetCareer, country);
    
    res.json({
      success: true,
      data: {
        currentSkills,
        skillAnalysis: analysis.skillAnalysis,
        missingSkills: analysis.skillAnalysis.missingSkills,
        skillGaps: {
          total: analysis.skillAnalysis.missingSkills.length,
          completionRate: analysis.skillAnalysis.skillScore,
          readinessLevel: analysis.skillAnalysis.readinessLevel
        },
        recommendations: analysis.learningRoadmap,
        marketInsights: analysis.marketInsights
      }
    });
  } catch (error) {
    console.error('Skill gap analyzer error:', error);
    res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
});

// ========================================
// 2️⃣ RECRUITER / EMPLOYER ROUTES
// ========================================

// Talent market intelligence for recruiters
router.get('/recruiter/talent-intelligence', authenticate, checkRole(['recruiter', 'employer']), async (req, res) => {
  try {
    const { country, skill, timeframe = '30days' } = req.query;
    
    let matchQuery = { isActive: true };
    if (country) matchQuery.country = country;
    if (skill) matchQuery.skills = { $in: [skill] };

    // Calculate date range
    const daysAgo = timeframe === '30days' ? 30 : timeframe === '90days' ? 90 : 7;
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    matchQuery.postedDate = { $gte: startDate };

    const talentData = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            skill: '$skills',
            country: '$country',
            experienceLevel: {
              $cond: {
                if: { $regexMatch: ['jobTitle', 'senior', 'i'] },
                then: 'senior',
                else: {
                  $cond: {
                    if: { $regexMatch: ['jobTitle', 'junior', 'i'] },
                    then: 'junior',
                    else: 'mid-level'
                  }
                }
              }
            }
          },
          demand: { $sum: 1 },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
          companies: { $addToSet: '$company' }
        }
      },
      { $sort: { demand: -1 } },
      { $limit: 50 }
    ]);

    res.json({
      success: true,
      data: {
        talentMarket: talentData,
        insights: {
          totalDemand: talentData.reduce((sum, item) => sum + item.demand, 0),
          topSkills: [...new Set(talentData.map(item => item._id.skill))].slice(0, 10),
          averageSalary: talentData.reduce((sum, item) => sum + item.avgSalary, 0) / talentData.length,
          timeframe
        }
      }
    });
  } catch (error) {
    console.error('Talent intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch talent intelligence' });
  }
});

// Salary benchmarking for recruiters
router.get('/recruiter/salary-benchmarking', authenticate, checkRole(['recruiter', 'employer']), async (req, res) => {
  try {
    const { role, country, experience } = req.query;
    
    let matchQuery = { isActive: true };
    if (role) matchQuery.jobTitle = { $regex: role, $options: 'i' };
    if (country) matchQuery.country = country;
    if (experience) {
      if (experience === 'senior') {
        matchQuery.jobTitle = { $regex: 'senior', $options: 'i' };
      } else if (experience === 'junior') {
        matchQuery.jobTitle = { $regex: 'junior', $options: 'i' };
      }
    }

    const salaryBenchmarks = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            country: '$country',
            role: '$jobTitle'
          },
          positions: { $sum: 1 },
          minSalary: { $min: '$salaryMin' },
          maxSalary: { $max: '$salaryMax' },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
          medianSalary: { $median: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { avgSalary: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        benchmarks: salaryBenchmarks,
        insights: {
          overallAverage: salaryBenchmarks.reduce((sum, item) => sum + item.avgSalary, 0) / salaryBenchmarks.length,
          salaryRange: {
            min: Math.min(...salaryBenchmarks.map(item => item.minSalary)),
            max: Math.max(...salaryBenchmarks.map(item => item.maxSalary))
          },
          competitiveMarkets: salaryBenchmarks.filter(item => item.avgSalary > 2500).map(item => item._id.country)
        }
      }
    });
  } catch (error) {
    console.error('Salary benchmarking error:', error);
    res.status(500).json({ error: 'Failed to fetch salary benchmarks' });
  }
});

// Hiring trend analysis for recruiters
router.get('/recruiter/hiring-trends', authenticate, checkRole(['recruiter', 'employer']), async (req, res) => {
  try {
    const { timeframe = '90days', country } = req.query;
    
    const daysAgo = timeframe === '30days' ? 30 : timeframe === '90days' ? 90 : 180;
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    let matchQuery = { 
      postedDate: { $gte: startDate },
      isActive: true 
    };
    if (country) matchQuery.country = country;

    const hiringTrends = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$postedDate' } },
            role: '$jobTitle'
          },
          count: { $sum: 1 },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { '_id.month': 1 } },
      {
        $group: {
          _id: '$_id.role',
          trend: {
            $push: {
              month: '$_id.month',
              count: '$count',
              avgSalary: '$avgSalary'
            }
          },
          totalPositions: { $sum: '$count' },
          growthRate: {
            $let: {
              vars: { values: '$trend' },
              in: {
                $subtract: [
                  { $arrayElemAt: ['$$values', -1] },
                  { $arrayElemAt: ['$$values', 0] }
                ]
              }
            }
          }
        }
      },
      { $sort: { totalPositions: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        hiringTrends,
        insights: {
          totalRoles: hiringTrends.length,
          fastestGrowing: hiringTrends.filter(role => role.growthRate > 0).sort((a, b) => b.growthRate - a.growthRate),
          averageGrowthRate: hiringTrends.reduce((sum, role) => sum + (role.growthRate || 0), 0) / hiringTrends.length
        }
      }
    });
  } catch (error) {
    console.error('Hiring trends error:', error);
    res.status(500).json({ error: 'Failed to fetch hiring trends' });
  }
});

// Competitor hiring intelligence for recruiters
router.get('/recruiter/competitor-intelligence', authenticate, checkRole(['recruiter', 'employer']), async (req, res) => {
  try {
    const { country, timeframe = '30days' } = req.query;
    
    const daysAgo = timeframe === '30days' ? 30 : 90;
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    let matchQuery = { 
      postedDate: { $gte: startDate },
      isActive: true 
    };
    if (country) matchQuery.country = country;

    const competitorData = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$company',
          jobCount: { $sum: 1 },
          roles: { $addToSet: '$jobTitle' },
          skills: { $push: '$skills' },
          countries: { $addToSet: '$country' },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 20 },
      {
        $project: {
          company: '$_id',
          jobCount: 1,
          roles: { $size: '$roles' },
          topSkills: { $slice: [{ $concatArrays: '$skills' }, 0, 5] },
          countries: { $size: '$countries' },
          averageSalary: { $round: ['$avgSalary', 0] },
          hiringActivity: {
            $cond: {
              if: { $gte: ['$jobCount', 10] },
              then: 'Very Active',
              else: {
                $cond: {
                  if: { $gte: ['$jobCount', 5] },
                  then: 'Active',
                  else: 'Moderate'
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        competitors: competitorData,
        insights: {
          totalCompetitors: competitorData.length,
          averageHiring: competitorData.reduce((sum, comp) => sum + comp.jobCount, 0) / competitorData.length,
          topHirer: competitorData[0],
          marketLeadership: competitorData.filter(comp => comp.jobCount > 10).length
        }
      }
    });
  } catch (error) {
    console.error('Competitor intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch competitor intelligence' });
  }
});

// ========================================
// 3️⃣ RESEARCHER / DATA ANALYST ROUTES
// ========================================

// Dataset explorer for researchers
router.get('/researcher/datasets', authenticate, checkRole(['researcher', 'analyst']), async (req, res) => {
  try {
    const { dataset, format = 'json', limit = 1000 } = req.query;
    
    let data = {};
    let filename = '';
    
    switch (dataset) {
      case 'jobs':
        data = await Job.find({ isActive: true })
          .select('jobTitle company country city skills salaryMin salaryMax postedDate source')
          .limit(parseInt(limit))
          .lean();
        filename = 'african_jobs_dataset';
        break;
        
      case 'skills':
        const skillData = await Job.aggregate([
          { $match: { isActive: true } },
          { $unwind: '$skills' },
          {
            $group: {
              _id: '$skills',
              count: { $sum: 1 },
              avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
              countries: { $addToSet: '$country' }
            }
          },
          { $sort: { count: -1 } }
        ]);
        data = skillData;
        filename = 'african_skills_dataset';
        break;
        
      case 'salaries':
        const salaryData = await Job.aggregate([
          { $match: { isActive: true, salaryMin: { $exists: true }, salaryMax: { $exists: true } } },
          {
            $group: {
              _id: {
                role: '$jobTitle',
                country: '$country'
              },
              minSalary: { $min: '$salaryMin' },
              maxSalary: { $max: '$salaryMax' },
              avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
              count: { $sum: 1 }
            }
          }
        ]);
        data = salaryData;
        filename = 'african_salaries_dataset';
        break;
        
      case 'trends':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const trendData = await Job.aggregate([
          { $match: { postedDate: { $gte: thirtyDaysAgo }, isActive: true } },
          {
            $group: {
              _id: {
                month: { $dateToString: { format: '%Y-%m', date: '$postedDate' } },
                skill: '$skills'
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.month': 1, '_id.skill': 1 } }
        ]);
        data = trendData;
        filename = 'african_trends_dataset';
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid dataset. Choose: jobs, skills, salaries, trends' });
    }

    res.json({
      success: true,
      data: {
        dataset,
        records: Array.isArray(data) ? data.length : Object.keys(data).length,
        filename,
        format,
        generatedAt: new Date(),
        downloadUrl: `/api/user/datasets/download?dataset=${dataset}&format=${format}`
      }
    });
  } catch (error) {
    console.error('Dataset explorer error:', error);
    res.status(500).json({ error: 'Failed to fetch dataset' });
  }
});

// Advanced analytics dashboard for researchers
router.get('/researcher/analytics', authenticate, checkRole(['researcher', 'analyst']), async (req, res) => {
  try {
    const { timeframe = '90days' } = req.query;
    
    const daysAgo = timeframe === '30days' ? 30 : timeframe === '90days' ? 90 : 180;
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Get comprehensive analytics
    const [jobGrowth, skillEvolution, salaryTrends, geographicDistribution] = await Promise.all([
      
      // Job growth trends
      Job.aggregate([
        { $match: { postedDate: { $gte: startDate }, isActive: true } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$postedDate' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      // Skill evolution
      Job.aggregate([
        { $match: { postedDate: { $gte: startDate }, isActive: true } },
        { $unwind: '$skills' },
        {
          $group: {
            _id: {
              skill: '$skills',
              month: { $dateToString: { format: '%Y-%m', date: '$postedDate' } }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.skill': 1, '_id.month': 1 } }
      ]),
      
      // Salary trends
      Job.aggregate([
        { $match: { postedDate: { $gte: startDate }, isActive: true, salaryMin: { $exists: true } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$postedDate' } },
            avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      // Geographic distribution
      Job.aggregate([
        { $match: { postedDate: { $gte: startDate }, isActive: true } },
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 },
            avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        jobGrowth,
        skillEvolution,
        salaryTrends,
        geographicDistribution,
        insights: {
          totalJobsAnalyzed: jobGrowth.reduce((sum, item) => sum + item.count, 0),
          timeframe,
          topGrowingCountry: geographicDistribution[0]?._id,
          averageSalaryGrowth: salaryTrends.length > 1 ? 
            ((salaryTrends[salaryTrends.length - 1].avgSalary - salaryTrends[0].avgSalary) / salaryTrends[0].avgSalary) * 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Research analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Download datasets for researchers
router.get('/researcher/download', authenticate, checkRole(['researcher', 'analyst']), async (req, res) => {
  try {
    const { dataset, format = 'csv' } = req.query;
    
    let data;
    let filename;
    
    switch (dataset) {
      case 'jobs':
        data = await Job.find({ isActive: true }).lean();
        filename = 'african_jobs_dataset.csv';
        break;
      case 'skills':
        const skillData = await Job.aggregate([
          { $match: { isActive: true } },
          { $unwind: '$skills' },
          {
            $group: {
              _id: '$skills',
              count: { $sum: 1 },
              avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
            }
          }
        ]);
        data = skillData;
        filename = 'african_skills_dataset.csv';
        break;
      default:
        return res.status(400).json({ error: 'Invalid dataset' });
    }

    if (format === 'csv') {
      // Convert to CSV and send
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(this.convertToCSV(data));
    } else {
      // Send JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${dataset}.json"`);
      return res.json(data);
    }
  } catch (error) {
    console.error('Dataset download error:', error);
    res.status(500).json({ error: 'Failed to download dataset' });
  }
});

// ========================================
// 4️⃣ DEVELOPER / API USER ROUTES
// ========================================

// API documentation for developers
router.get('/developer/api-docs', authenticate, checkRole(['developer']), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'African Job Market Intelligence API',
      version: '1.0.0',
      baseUrl: `${req.protocol}://${req.get('host')}/api`,
      endpoints: [
        {
          path: '/jobs',
          method: 'GET',
          description: 'Get job listings with filters',
          parameters: {
            search: 'string',
            skills: 'array',
            country: 'string',
            salaryMin: 'number',
            salaryMax: 'number',
            page: 'number',
            limit: 'number'
          }
        },
        {
          path: '/top-skills',
          method: 'GET',
          description: 'Get top demanded skills',
          parameters: {
            country: 'string',
            limit: 'number'
          }
        },
        {
          path: '/salary-stats',
          method: 'GET',
          description: 'Get salary statistics',
          parameters: {
            skill: 'string',
            country: 'string',
            role: 'string'
          }
        },
        {
          path: '/job-trends',
          method: 'GET',
          description: 'Get job market trends',
          parameters: {
            timeframe: 'string (30days, 90days, 180days)',
            country: 'string'
          }
        },
        {
          path: '/predictions',
          method: 'GET',
          description: 'Get market predictions',
          parameters: {
            skill: 'string',
            timeframe: 'string'
          }
        }
      ],
      authentication: 'Bearer Token required',
      rateLimits: {
        requestsPerHour: 1000,
        requestsPerDay: 10000
      }
    }
  });
});

// API key management for developers
router.post('/developer/api-key', authenticate, checkRole(['developer']), async (req, res) => {
  try {
    const { action, keyName } = req.body;
    const userId = req.user._id;
    
    if (action === 'generate') {
      // Generate new API key
      const apiKey = this.generateApiKey();
      
      // Store API key (would implement in real system)
      await User.findByIdAndUpdate(userId, {
        $push: { 
          apiKeys: {
            name: keyName || 'Default Key',
            key: apiKey,
            createdAt: new Date(),
            lastUsed: null,
            usageCount: 0
          }
        }
      });
      
      res.json({
        success: true,
        data: {
          apiKey,
          name: keyName || 'Default Key',
          createdAt: new Date()
        }
      });
    } else if (action === 'revoke') {
      // Revoke API key
      await User.findByIdAndUpdate(userId, {
        $pull: { apiKeys: { key: keyName } }
      });
      
      res.json({
        success: true,
        message: 'API key revoked successfully'
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API key management error:', error);
    res.status(500).json({ error: 'Failed to manage API key' });
  }
});

// API usage dashboard for developers
router.get('/developer/usage', authenticate, checkRole(['developer']), async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's API usage (would implement in real system)
    const user = await User.findById(userId).select('apiKeys').lean();
    
    res.json({
      success: true,
      data: {
        apiKeys: user.apiKeys || [],
        usage: {
          totalRequests: 15420,
          requestsThisMonth: 3420,
          requestsToday: 145,
          rateLimitStatus: 'healthy',
          nextReset: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        quotas: {
          requestsPerHour: 1000,
          requestsPerDay: 10000,
          currentUsage: 0.34 // 34% of daily limit
        }
      }
    });
  } catch (error) {
    console.error('API usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// ========================================
// 5️⃣ ADMIN (PLATFORM OWNER) ROUTES
// ========================================

// Note: Admin routes are already implemented in admin.js
// These are additional admin-specific user management routes

// User management for admin
router.get('/admin/users', authenticate, checkRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, userType } = req.query;
    
    let matchQuery = {};
    if (userType) matchQuery.userType = userType;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(matchQuery)
      .select('email userType profile.firstName profile.lastName createdAt lastLogin verification.emailVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(matchQuery);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total
        },
        userStats: {
          total: total,
          byType: await User.aggregate([
            { $group: { _id: '$userType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ])
        }
      }
    });
  } catch (error) {
    console.error('Admin user management error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ========================================
// HELPER METHODS
// ========================================

// Helper method to convert data to CSV
function convertToCSV(data) {
  if (!Array.isArray(data)) {
    // Handle aggregation results
    data = [data];
  }
  
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).filter(key => key !== '_id');
  const csvHeaders = headers.join(',') + '\n';
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      if (Array.isArray(value)) {
        return `"${value.join(';')}"`;
      }
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value || '';
    }).join(',');
  }).join('\n');
  
  return csvHeaders + csvRows;
}

// Helper method to generate API key
function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ajm_${result}`;
}

module.exports = router;
