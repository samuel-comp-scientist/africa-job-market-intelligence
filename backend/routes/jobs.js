const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { validateJobQuery } = require('../middleware/validation');

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job postings with optional filtering
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of jobs to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
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
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *         description: Filter for remote jobs only
 *     responses:
 *       200:
 *         description: List of job postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', validateJobQuery, async (req, res) => {
  try {
    const {
      limit = 50,
      page = 1,
      country,
      skill,
      seniority,
      remote,
      sortBy = 'scraped_at',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { active: true };

    if (country) {
      query.country = new RegExp(country, 'i');
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (seniority) {
      query.seniority_level = seniority;
    }

    if (remote === 'true') {
      query.remote_option = true;
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a specific job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select('-__v');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

/**
 * @swagger
 * /api/jobs/stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Job statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 byCountry:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 bySeniority:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: string
 *                       count:
 *                         type: integer
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Job.countDocuments({ active: true });
    
    const byCountry = await Job.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { country: '$_id', count: 1, _id: 0 } }
    ]);

    const bySeniority = await Job.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$seniority_level', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { level: '$_id', count: 1, _id: 0 } }
    ]);

    const byJobType = await Job.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$job_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);

    const remoteStats = await Job.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$remote_option', count: { $sum: 1 } } },
      { $project: { remote: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      total,
      byCountry,
      bySeniority,
      byJobType,
      remoteStats
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job statistics' });
  }
});

/**
 * @swagger
 * /api/jobs/search:
 *   post:
 *     summary: Search jobs with advanced filters
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keywords:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               countries:
 *                 type: array
 *                 items:
 *                   type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               seniority:
 *                 type: array
 *                 items:
 *                   type: string
 *               remote:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Search results
 */
router.post('/search', async (req, res) => {
  try {
    const {
      keywords,
      skills,
      countries,
      salaryMin,
      salaryMax,
      seniority,
      remote,
      limit = 50,
      page = 1
    } = req.body;

    const query = { active: true };

    // Keywords search in title and description
    if (keywords) {
      const keywordRegex = new RegExp(keywords, 'i');
      query.$or = [
        { title: keywordRegex },
        { description: keywordRegex }
      ];
    }

    // Skills filter
    if (skills && skills.length > 0) {
      query.skills = { $in: skills };
    }

    // Countries filter
    if (countries && countries.length > 0) {
      query.country = { $in: countries };
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query.salary_numeric = {};
      if (salaryMin) query.salary_numeric.$gte = salaryMin;
      if (salaryMax) query.salary_numeric.$lte = salaryMax;
    }

    // Seniority filter
    if (seniority && seniority.length > 0) {
      query.seniority_level = { $in: seniority };
    }

    // Remote filter
    if (remote !== undefined) {
      query.remote_option = remote;
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .sort({ scraped_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

module.exports = router;
