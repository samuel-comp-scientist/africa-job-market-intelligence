const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

/**
 * @swagger
 * /api/trends/predictions:
 *   get:
 *     summary: Get AI predictions for skill demand trends
 *     tags: [Trends]
 *     parameters:
 *       - in: query
 *         name: horizon
 *         schema:
 *           type: string
 *           enum: [3_months, 6_months, 12_months]
 *           default: 6_months
 *         description: Prediction time horizon
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of top predictions to return
 *     responses:
 *       200:
 *         description: AI predictions for skill demand
 */
router.get('/predictions', async (req, res) => {
  try {
    const { horizon = '6_months', limit = 20 } = req.query;

    // For demo purposes, we'll simulate predictions
    // In a real implementation, this would fetch from the ML model
    const mockPredictions = generateMockPredictions(horizon, parseInt(limit));

    res.json({
      predictions: mockPredictions,
      horizon,
      generated_at: new Date().toISOString(),
      model_version: '1.0.0'
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

/**
 * @swagger
 * /api/trends/emerging:
 *   get:
 *     summary: Get emerging skills and technologies
 *     tags: [Trends]
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [month, quarter, year]
 *           default: quarter
 *         description: Timeframe to analyze emerging skills
 *     responses:
 *       200:
 *         description: Emerging skills data
 */
router.get('/emerging', async (req, res) => {
  try {
    const { timeframe = 'quarter' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
    }

    // Get emerging skills (skills growing in demand)
    const emergingSkills = await Job.aggregate([
      { $match: { active: true, scraped_at: { $gte: startDate } } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills' },
          recentCount: { $sum: 1 },
          countries: { $addToSet: '$country' },
          seniority_levels: { $addToSet: '$seniority_level' },
          avgSalary: { $avg: '$salary_numeric' }
        }
      },
      { $match: { recentCount: { $gte: 5 } } }, // Minimum threshold
      { $sort: { recentCount: -1 } },
      { $limit: 20 },
      {
        $project: {
          skill: '$_id',
          demand: '$recentCount',
          countryCount: { $size: '$countries' },
          countries: 1,
          seniority_levels: 1,
          avgSalary: { $round: ['$avgSalary', 0] },
          _id: 0
        }
      }
    ]);

    // Get historical data for comparison
    const historicalStartDate = new Date(startDate);
    historicalStartDate.setMonth(historicalStartDate.getMonth() - 3);

    const historicalSkills = await Job.aggregate([
      { $match: { active: true, scraped_at: { $gte: historicalStartDate, $lt: startDate } } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills' },
          historicalCount: { $sum: 1 }
        }
      }
    ]);

    // Calculate growth rates
    const historicalMap = {};
    historicalSkills.forEach(skill => {
      historicalMap[skill._id] = skill.historicalCount;
    });

    const skillsWithGrowth = emergingSkills.map(skill => {
      const historicalCount = historicalMap[skill.skill] || 1;
      const growthRate = ((skill.demand - historicalCount) / historicalCount) * 100;
      
      return {
        ...skill,
        growth_rate: Math.round(growthRate * 10) / 10,
        trend: growthRate > 50 ? 'high_growth' : growthRate > 20 ? 'moderate_growth' : 'stable'
      };
    });

    // Sort by growth rate
    skillsWithGrowth.sort((a, b) => b.growth_rate - a.growth_rate);

    res.json({
      emerging_skills: skillsWithGrowth,
      timeframe,
      analysis_period: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching emerging skills:', error);
    res.status(500).json({ error: 'Failed to fetch emerging skills' });
  }
});

/**
 * @swagger
 * /api/trends/market:
 *   get:
 *     summary: Get overall market trends and insights
 *     tags: [Trends]
 *     responses:
 *       200:
 *         description: Market trends data
 */
router.get('/market', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const lastYear = new Date(now.getFullYear() - 1, 0, 1);

    // Job posting trends
    const monthlyTrends = await Job.aggregate([
      { $match: { active: true, scraped_at: { $gte: lastQuarter } } },
      {
        $group: {
          _id: {
            year: { $year: '$scraped_at' },
            month: { $month: '$scraped_at' }
          },
          count: { $sum: 1 },
          uniqueCountries: { $addToSet: '$country' },
          uniqueCompanies: { $addToSet: '$company' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          period: '$_id',
          postings: '$count',
          countries: { $size: '$uniqueCountries' },
          companies: { $size: '$uniqueCompanies' },
          _id: 0
        }
      }
    ]);

    // Country-wise growth
    const countryGrowth = await Job.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: {
            country: '$country',
            period: {
              $cond: {
                if: { $gte: ['$scraped_at', lastMonth] },
                then: 'current',
                else: {
                  $cond: {
                    if: { $gte: ['$scraped_at', lastQuarter] },
                    then: 'recent',
                    else: 'historical'
                  }
                }
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.country',
          current: { $sum: { $cond: [{ $eq: ['$_id.period', 'current'] }, '$count', 0] } },
          recent: { $sum: { $cond: [{ $eq: ['$_id.period', 'recent'] }, '$count', 0] } },
          historical: { $sum: { $cond: [{ $eq: ['$_id.period', 'historical'] }, '$count', 0] } }
        }
      },
      { $match: { current: { $gt: 0 } } },
      { $sort: { current: -1 } },
      { $limit: 10 },
      {
        $project: {
          country: '$_id',
          current: 1,
          recent: 1,
          historical: 1,
          growth_rate: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ['$current', '$recent'] }, '$recent'] },
                  100
                ]
              },
              1
            ]
          },
          _id: 0
        }
      }
    ]);

    // Remote work trends
    const remoteTrends = await Job.aggregate([
      { $match: { active: true, scraped_at: { $gte: lastQuarter } } },
      {
        $group: {
          _id: {
            year: { $year: '$scraped_at' },
            month: { $month: '$scraped_at' },
            remote: '$remote_option'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          total: { $sum: '$count' },
          remote: { $sum: { $cond: [{ $eq: ['$_id.remote', true] }, '$count', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          period: '$_id',
          total_postings: '$total',
          remote_postings: '$remote',
          remote_percentage: {
            $round: [
              { $multiply: [{ $divide: ['$remote', '$total'] }, 100] },
              1
            ]
          },
          _id: 0
        }
      }
    ]);

    // Market insights
    const totalJobs = await Job.countDocuments({ active: true });
    const avgSalary = await Job.aggregate([
      { $match: { active: true, salary_numeric: { $exists: true, $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$salary_numeric' } } }
    ]);

    const insights = {
      total_active_postings: totalJobs,
      average_salary: avgSalary[0]?.avg || 0,
      top_countries: countryGrowth.slice(0, 5),
      remote_adoption: remoteTrends[remoteTrends.length - 1]?.remote_percentage || 0,
      market_growth: monthlyTrends.length > 1 ? 
        ((monthlyTrends[monthlyTrends.length - 1].postings - monthlyTrends[0].postings) / monthlyTrends[0].postings * 100).toFixed(1) : 0
    };

    res.json({
      insights,
      monthly_trends: monthlyTrends,
      country_growth: countryGrowth,
      remote_trends: remoteTrends,
      analysis_period: {
        start: lastQuarter.toISOString(),
        end: now.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching market trends:', error);
    res.status(500).json({ error: 'Failed to fetch market trends' });
  }
});

/**
 * @swagger
 * /api/trends/regions:
 *   get:
 *     summary: Get regional job market trends
 *     tags: [Trends]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [north-africa, west-africa, east-africa, southern-africa, central-africa]
 *         description: Specific region to analyze
 *     responses:
 *       200:
 *         description: Regional trends data
 */
router.get('/regions', async (req, res) => {
  try {
    const { region } = req.query;

    // Country mapping by region
    const regionCountries = {
      'north-africa': ['egypt', 'morocco', 'algeria', 'tunisia', 'libya', 'sudan'],
      'west-africa': ['nigeria', 'ghana', 'senegal', 'ivory coast', 'mali', 'burkina faso'],
      'east-africa': ['kenya', 'ethiopia', 'uganda', 'tanzania', 'rwanda', 'somalia'],
      'southern-africa': ['south africa', 'zimbabwe', 'zambia', 'botswana', 'namibia', 'mozambique'],
      'central-africa': ['cameroon', 'congo', 'democratic republic of congo', 'central african republic', 'chad']
    };

    let countries = [];
    if (region && regionCountries[region]) {
      countries = regionCountries[region];
    }

    const matchQuery = { active: true };
    if (countries.length > 0) {
      matchQuery.country = { $in: countries.map(c => new RegExp(c, 'i')) };
    }

    // Regional analysis
    const regionalData = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$country',
          totalJobs: { $sum: 1 },
          avgSalary: { $avg: '$salary_numeric' },
          uniqueSkills: { $addToSet: '$skills' },
          remoteJobs: { $sum: { $cond: ['$remote_option', 1, 0] } },
          seniorityDistribution: {
            $push: '$seniority_level'
          }
        }
      },
      { $sort: { totalJobs: -1 } },
      {
        $project: {
          country: '$_id',
          total_jobs: '$totalJobs',
          average_salary: { $round: ['$avgSalary', 0] },
          unique_skills_count: { $size: '$uniqueSkills' },
          remote_percentage: {
            $round: [
              { $multiply: [{ $divide: ['$remoteJobs', '$totalJobs'] }, 100] },
              1
            ]
          },
          seniority_distribution: '$seniorityDistribution',
          _id: 0
        }
      }
    ]);

    // Process seniority distribution
    regionalData.forEach(country => {
      const seniorityCounts = {};
      country.seniority_distribution.forEach(level => {
        seniorityCounts[level] = (seniorityCounts[level] || 0) + 1;
      });
      country.seniority_distribution = seniorityCounts;
    });

    // Regional summary
    const summary = {
      total_jobs: regionalData.reduce((sum, c) => sum + c.total_jobs, 0),
      total_countries: regionalData.length,
      average_salary: Math.round(regionalData.reduce((sum, c) => sum + (c.average_salary || 0), 0) / regionalData.length),
      remote_adoption: Math.round(regionalData.reduce((sum, c) => sum + c.remote_percentage, 0) / regionalData.length)
    };

    res.json({
      region: region || 'all',
      summary,
      countries: regionalData,
      analysis_date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching regional trends:', error);
    res.status(500).json({ error: 'Failed to fetch regional trends' });
  }
});

// Helper function to generate mock predictions
function generateMockPredictions(horizon, limit) {
  const skills = [
    'react', 'python', 'aws', 'docker', 'kubernetes', 'typescript', 
    'node.js', 'machine learning', 'azure', 'mongodb', 'graphql',
    'microservices', 'devops', 'ci/cd', 'terraform', 'ansible'
  ];

  const predictions = skills.slice(0, limit).map(skill => {
    const currentDemand = Math.floor(Math.random() * 100) + 50;
    const growthRate = Math.random() * 40 - 5; // -5% to 35% growth
    const predictedDemand = Math.round(currentDemand * (1 + growthRate / 100));
    
    return {
      skill: skill,
      current_demand: currentDemand,
      predicted_demand: predictedDemand,
      growth_rate: Math.round(growthRate * 10) / 10,
      confidence: Math.round((Math.random() * 30 + 70) * 10) / 10, // 70-100% confidence
      horizon: horizon,
      category: categorizeSkill(skill)
    };
  });

  return predictions.sort((a, b) => b.growth_rate - a.growth_rate);
}

function categorizeSkill(skill) {
  const categories = {
    'Programming Languages': ['python', 'java', 'javascript', 'typescript'],
    'Cloud & DevOps': ['aws', 'azure', 'docker', 'kubernetes', 'devops', 'terraform', 'ansible'],
    'Frontend': ['react', 'angular', 'vue'],
    'Backend': ['node.js', 'express', 'django', 'flask'],
    'Data Science': ['machine learning', 'data analysis', 'tensorflow'],
    'Databases': ['mongodb', 'postgresql', 'mysql'],
    'Tools & Others': ['graphql', 'microservices', 'ci/cd']
  };

  const skillLower = skill.toLowerCase();
  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => skillLower.includes(s))) {
      return category;
    }
  }
  return 'Other';
}

module.exports = router;
