const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

/**
 * @swagger
 * /api/salaries/analytics:
 *   get:
 *     summary: Get comprehensive salary analytics
 *     tags: [Salaries]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Filter by skill
 *       - in: query
 *         name: seniority
 *         schema:
 *           type: string
 *           enum: [junior, mid-level, senior, lead, architect]
 *         description: Filter by seniority level
 *     responses:
 *       200:
 *         description: Salary analytics data
 */
router.get('/analytics', async (req, res) => {
  try {
    const { country, skill, seniority } = req.query;

    const matchQuery = { 
      active: true, 
      salary_numeric: { $exists: true, $gt: 0 }
    };

    if (country) {
      matchQuery.country = new RegExp(country, 'i');
    }

    if (skill) {
      matchQuery.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (seniority) {
      matchQuery.seniority_level = seniority;
    }

    // Overall salary statistics
    const overallStats = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          medianSalary: { $avg: '$salary_numeric' },
          count: { $sum: 1 },
          stdDev: { $stdDevPop: '$salary_numeric' }
        }
      }
    ]);

    // Salary by country
    const byCountry = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$country',
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gte: 3 } } },
      { $sort: { avgSalary: -1 } },
      {
        $project: {
          country: '$_id',
          avgSalary: { $round: ['$avgSalary', 0] },
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);

    // Salary by seniority level
    const bySeniority = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$seniority_level',
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgSalary: -1 } },
      {
        $project: {
          seniority: '$_id',
          avgSalary: { $round: ['$avgSalary', 0] },
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);

    // Salary distribution (percentiles)
    const distribution = await Job.aggregate([
      { $match: matchQuery },
      { $sort: { salary_numeric: 1 } },
      {
        $group: {
          _id: null,
          salaries: { $push: '$salary_numeric' }
        }
      }
    ]);

    let percentiles = {};
    if (distribution.length > 0 && distribution[0].salaries) {
      const salaries = distribution[0].salaries;
      const len = salaries.length;
      
      percentiles = {
        p10: salaries[Math.floor(len * 0.1)],
        p25: salaries[Math.floor(len * 0.25)],
        p50: salaries[Math.floor(len * 0.5)],
        p75: salaries[Math.floor(len * 0.75)],
        p90: salaries[Math.floor(len * 0.9)]
      };
    }

    res.json({
      overall: overallStats[0] || {},
      byCountry,
      bySeniority,
      distribution: percentiles,
      filters: { country, skill, seniority }
    });
  } catch (error) {
    console.error('Error fetching salary analytics:', error);
    res.status(500).json({ error: 'Failed to fetch salary analytics' });
  }
});

/**
 * @swagger
 * /api/salaries/trends:
 *   get:
 *     summary: Get salary trends over time
 *     tags: [Salaries]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly]
 *           default: monthly
 *         description: Time period for trend analysis
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *     responses:
 *       200:
 *         description: Salary trends data
 */
router.get('/trends', async (req, res) => {
  try {
    const { period = 'monthly', country } = req.query;

    const matchQuery = { 
      active: true, 
      salary_numeric: { $exists: true, $gt: 0 }
    };

    if (country) {
      matchQuery.country = new RegExp(country, 'i');
    }

    let groupBy;
    switch (period) {
      case 'monthly':
        groupBy = {
          year: { $year: '$scraped_at' },
          month: { $month: '$scraped_at' }
        };
        break;
      case 'quarterly':
        groupBy = {
          year: { $year: '$scraped_at' },
          quarter: { $quarter: '$scraped_at' }
        };
        break;
    }

    const trends = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupBy,
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.quarter': 1 } },
      {
        $project: {
          period: '$_id',
          avgSalary: { $round: ['$avgSalary', 0] },
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      trends,
      period,
      filters: { country }
    });
  } catch (error) {
    console.error('Error fetching salary trends:', error);
    res.status(500).json({ error: 'Failed to fetch salary trends' });
  }
});

/**
 * @swagger
 * /api/salaries/compare:
 *   post:
 *     summary: Compare salaries across different dimensions
 *     tags: [Salaries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               countries:
 *                 type: array
 *                 items:
 *                   type: string
 *               seniority:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Salary comparison data
 */
router.post('/compare', async (req, res) => {
  try {
    const { skills, countries, seniority } = req.body;

    const matchQuery = { 
      active: true, 
      salary_numeric: { $exists: true, $gt: 0 }
    };

    if (skills && skills.length > 0) {
      matchQuery.skills = { $in: skills.map(s => new RegExp(s, 'i')) };
    }

    if (countries && countries.length > 0) {
      matchQuery.country = { $in: countries.map(c => new RegExp(c, 'i')) };
    }

    if (seniority && seniority.length > 0) {
      matchQuery.seniority_level = { $in: seniority };
    }

    // Multi-dimensional comparison
    const comparison = await Job.aggregate([
      { $match: matchQuery },
      { $unwind: '$skills' },
      {
        $group: {
          _id: {
            skill: { $toLower: '$skills' },
            country: '$country',
            seniority: '$seniority_level'
          },
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gte: 2 } } },
      { $sort: { avgSalary: -1 } },
      {
        $project: {
          skill: '$_id.skill',
          country: '$_id.country',
          seniority: '$_id.seniority',
          avgSalary: { $round: ['$avgSalary', 0] },
          minSalary: { $round: ['$minSalary', 0] },
          maxSalary: { $round: ['$maxSalary', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);

    // Group by different dimensions for easier comparison
    const bySkill = {};
    const byCountry = {};
    const bySeniority = {};

    comparison.forEach(item => {
      // Group by skill
      if (!bySkill[item.skill]) {
        bySkill[item.skill] = [];
      }
      bySkill[item.skill].push(item);

      // Group by country
      if (!byCountry[item.country]) {
        byCountry[item.country] = [];
      }
      byCountry[item.country].push(item);

      // Group by seniority
      if (!bySeniority[item.seniority]) {
        bySeniority[item.seniority] = [];
      }
      bySeniority[item.seniority].push(item);
    });

    res.json({
      comparison,
      bySkill,
      byCountry,
      bySeniority,
      filters: { skills, countries, seniority }
    });
  } catch (error) {
    console.error('Error comparing salaries:', error);
    res.status(500).json({ error: 'Failed to compare salaries' });
  }
});

/**
 * @swagger
 * /api/salaries/benchmark:
 *   get:
 *     summary: Get salary benchmark for specific criteria
 *     tags: [Salaries]
 *     parameters:
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *           required: true
 *         description: Skill to benchmark
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country for benchmark
 *       - in: query
 *         name: seniority
 *         schema:
 *           type: string
 *           enum: [junior, mid-level, senior, lead, architect]
 *         description: Seniority level for benchmark
 *     responses:
 *       200:
 *         description: Salary benchmark data
 */
router.get('/benchmark', async (req, res) => {
  try {
    const { skill, country, seniority } = req.query;

    if (!skill) {
      return res.status(400).json({ error: 'Skill parameter is required' });
    }

    const matchQuery = { 
      active: true, 
      salary_numeric: { $exists: true, $gt: 0 },
      skills: { $in: [new RegExp(skill, 'i')] }
    };

    if (country) {
      matchQuery.country = new RegExp(country, 'i');
    }

    if (seniority) {
      matchQuery.seniority_level = seniority;
    }

    // Get benchmark data
    const benchmark = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary_numeric' },
          minSalary: { $min: '$salary_numeric' },
          maxSalary: { $max: '$salary_numeric' },
          medianSalary: { $avg: '$salary_numeric' },
          count: { $sum: 1 },
          salaries: { $push: '$salary_numeric' }
        }
      }
    ]);

    if (benchmark.length === 0) {
      return res.status(404).json({ error: 'No salary data found for the specified criteria' });
    }

    const data = benchmark[0];
    const salaries = data.salaries.sort((a, b) => a - b);
    const len = salaries.length;

    // Calculate percentiles
    const percentiles = {
      p10: salaries[Math.floor(len * 0.1)],
      p25: salaries[Math.floor(len * 0.25)],
      p50: salaries[Math.floor(len * 0.5)],
      p75: salaries[Math.floor(len * 0.75)],
      p90: salaries[Math.floor(len * 0.9)]
    };

    // Market position indicators
    const marketPosition = {
      entry_level: percentiles.p25,
      market_average: data.avgSalary,
      senior_level: percentiles.p75,
      top_quartile: percentiles.p90
    };

    res.json({
      skill,
      country,
      seniority,
      benchmark: {
        average: { $round: [data.avgSalary, 0] },
        minimum: data.minSalary,
        maximum: data.maxSalary,
        median: { $round: [data.medianSalary, 0] },
        sample_size: data.count,
        percentiles,
        market_position: marketPosition
      }
    });
  } catch (error) {
    console.error('Error generating salary benchmark:', error);
    res.status(500).json({ error: 'Failed to generate salary benchmark' });
  }
});

module.exports = router;
