const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

/**
 * @swagger
 * /api/skills/top:
 *   get:
 *     summary: Get top demanded skills
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of top skills to return
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Timeframe for analysis
 *     responses:
 *       200:
 *         description: Top demanded skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skill:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       percentage:
 *                         type: number
 *                       category:
 *                         type: string
 *                 total:
 *                   type: integer
 */
router.get('/top', async (req, res) => {
  try {
    const { limit = 20, country, timeframe = 'month' } = req.query;
    
    // Build date filter based on timeframe
    const dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case 'week':
        dateFilter.scraped_at = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter.scraped_at = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        dateFilter.scraped_at = { $gte: quarterStart };
        break;
      case 'year':
        dateFilter.scraped_at = { $gte: new Date(now.getFullYear(), 0, 1) };
        break;
    }

    // Build query
    const query = { active: true, ...dateFilter };
    if (country) {
      query.country = new RegExp(country, 'i');
    }

    // Get top skills
    const skills = await Job.aggregate([
      { $match: query },
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills' },
          count: { $sum: 1 },
          countries: { $addToSet: '$country' },
          seniority_levels: { $addToSet: '$seniority_level' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          skill: '$_id',
          count: 1,
          countryCount: { $size: '$countries' },
          countries: 1,
          seniority_levels: 1,
          _id: 0
        }
      }
    ]);

    // Get total jobs for percentage calculation
    const totalJobs = await Job.countDocuments(query);

    // Add categories and percentages
    const categorizedSkills = skills.map(skill => ({
      ...skill,
      percentage: ((skill.count / totalJobs) * 100).toFixed(2),
      category: categorizeSkill(skill.skill)
    }));

    res.json({
      skills: categorizedSkills,
      total: totalJobs,
      timeframe
    });
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ error: 'Failed to fetch top skills' });
  }
});

/**
 * @swagger
 * /api/skills/trends:
 *   get:
 *     summary: Get skill demand trends over time
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Specific skill to analyze
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: weekly
 *         description: Time period for trend analysis
 *     responses:
 *       200:
 *         description: Skill demand trends
 */
router.get('/trends', async (req, res) => {
  try {
    const { skill, period = 'weekly' } = req.query;

    let groupBy;
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$scraped_at' },
          month: { $month: '$scraped_at' },
          day: { $dayOfMonth: '$scraped_at' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$scraped_at' },
          week: { $week: '$scraped_at' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$scraped_at' },
          month: { $month: '$scraped_at' }
        };
        break;
    }

    const matchQuery = { active: true };
    if (skill) {
      matchQuery.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const trends = await Job.aggregate([
      { $match: matchQuery },
      { $unwind: '$skills' },
      {
        $group: {
          _id: groupBy,
          skillCounts: {
            $push: {
              skill: { $toLower: '$skills' },
              count: 1
            }
          },
          totalJobs: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    // Process trends data
    const processedTrends = trends.map(trend => {
      const skillMap = {};
      trend.skillCounts.forEach(item => {
        if (!skillMap[item.skill]) {
          skillMap[item.skill] = 0;
        }
        skillMap[item.skill] += item.count;
      });

      return {
        period: trend._id,
        skills: skillMap,
        totalJobs: trend.totalJobs
      };
    });

    res.json({
      trends: processedTrends,
      period
    });
  } catch (error) {
    console.error('Error fetching skill trends:', error);
    res.status(500).json({ error: 'Failed to fetch skill trends' });
  }
});

/**
 * @swagger
 * /api/skills/salary:
 *   get:
 *     summary: Get salary information by skill
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Specific skill to analyze
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *     responses:
 *       200:
 *         description: Salary information by skill
 */
router.get('/salary', async (req, res) => {
  try {
    const { skill, country } = req.query;

    const matchQuery = { 
      active: true, 
      salary_numeric: { $exists: true, $gt: 0 }
    };

    if (skill) {
      matchQuery.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (country) {
      matchQuery.country = new RegExp(country, 'i');
    }

    const salaryBySkill = await Job.aggregate([
      { $match: matchQuery },
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills' },
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          medianSalary: { $avg: '$salary_numeric' },
          count: { $sum: 1 },
          countries: { $addToSet: '$country' }
        }
      },
      { $match: { count: { $gte: 3 } } }, // Only include skills with 3+ data points
      { $sort: { avgSalary: -1 } },
      {
        $project: {
          skill: '$_id',
          avgSalary: { $round: ['$avgSalary', 0] },
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          medianSalary: { $round: ['$medianSalary', 0] },
          count: 1,
          countryCount: { $size: '$countries' },
          _id: 0
        }
      }
    ]);

    res.json({
      salaryBySkill,
      totalSkills: salaryBySkill.length
    });
  } catch (error) {
    console.error('Error fetching salary by skill:', error);
    res.status(500).json({ error: 'Failed to fetch salary information' });
  }
});

/**
 * @swagger
 * /api/skills/categories:
 *   get:
 *     summary: Get skills grouped by categories
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Skills by categories
 */
router.get('/categories', async (req, res) => {
  try {
    const skills = await Job.getTopSkills(100);
    
    const categorizedSkills = {};
    
    skills.forEach(skillObj => {
      const category = categorizeSkill(skillObj.skill);
      if (!categorizedSkills[category]) {
        categorizedSkills[category] = [];
      }
      categorizedSkills[category].push({
        skill: skillObj.skill,
        count: skillObj.count
      });
    });

    // Sort skills within each category
    Object.keys(categorizedSkills).forEach(category => {
      categorizedSkills[category].sort((a, b) => b.count - a.count);
    });

    res.json({
      categories: categorizedSkills,
      totalCategories: Object.keys(categorizedSkills).length
    });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    res.status(500).json({ error: 'Failed to fetch skill categories' });
  }
});

// Helper function to categorize skills
function categorizeSkill(skill) {
  const categories = {
    'Programming Languages': ['python', 'java', 'javascript', 'typescript', 'php', 'ruby', 'go', 'rust', 'c++', 'c#'],
    'Frontend': ['react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'next.js'],
    'Backend': ['nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi', 'nest.js'],
    'Databases': ['sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'oracle'],
    'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd'],
    'Mobile': ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'xamarin'],
    'Data Science': ['machine learning', 'ai', 'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn'],
    'Tools & Others': ['git', 'linux', 'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'jira']
  };

  const skillLower = skill.toLowerCase();
  
  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => skillLower.includes(s) || s.includes(skillLower))) {
      return category;
    }
  }
  
  return 'Other';
}

module.exports = router;
