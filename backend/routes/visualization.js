const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const { authenticate } = require('../middleware/auth');

// Simple middleware that just checks if user is admin
const requireAdmin = (req, res, next) => {
  // For now, just pass through - you can add real admin check later
  next();
};

// Get job statistics for visualization
router.get('/job-stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const { timeframe = '30' } = req.query; // Default to 30 days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));
    
    // Jobs by country
    const jobsByCountry = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Jobs by skill
    const jobsBySkill = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Jobs by job type
    const jobsByType = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Jobs by experience level
    const jobsByExperience = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$experienceLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Salary distribution
    const salaryDistribution = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate }, salaryMin: { $gt: 0 } } },
      {
        $bucket: {
          groupBy: '$salaryMin',
          boundaries: [0, 100000, 500000, 1000000, 2000000, 4000000],
          default: '4000000+',
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $project: {
          _id: { 
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 0] }, then: '0-100K' },
                { case: { $eq: ['$_id', 100000] }, then: '100K-500K' },
                { case: { $eq: ['$_id', 500000] }, then: '500K-1M' },
                { case: { $eq: ['$_id', 1000000] }, then: '1M-2M' },
                { case: { $eq: ['$_id', 2000000] }, then: '2M-4M' }
              ],
              default: '4M+'
            }
          },
          count: '$count'
        }
      }
    ]);

    // Daily job postings trend
    const dailyTrend = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$postedDate' },
            month: { $month: '$postedDate' },
            day: { $dayOfMonth: '$postedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top companies
    const topCompanies = await Job.aggregate([
      { $match: { postedDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      jobsByCountry,
      jobsBySkill,
      jobsByType,
      jobsByExperience,
      salaryDistribution,
      dailyTrend,
      topCompanies,
      timeframe: parseInt(timeframe),
      generatedAt: new Date()
    });
    
    // Debug logging
    console.log('📊 Visualization Data Summary:');
    console.log('- Jobs by Country:', jobsByCountry.length, 'items');
    console.log('- Jobs by Skill:', jobsBySkill.length, 'items');
    console.log('- Jobs by Type:', jobsByType.length, 'items');
    console.log('- Salary Distribution:', salaryDistribution.length, 'items');
    console.log('- Daily Trend:', dailyTrend.length, 'items');
    console.log('- Top Companies:', topCompanies.length, 'items');

  } catch (error) {
    console.error('Visualization stats error:', error);
    res.status(500).json({ error: 'Failed to fetch visualization data' });
  }
});

// Get detailed job data for export/analysis
router.get('/job-details', authenticate, requireAdmin, async (req, res) => {
  try {
    const { 
      limit = 1000, 
      skip = 0, 
      country, 
      skill, 
      minSalary, 
      maxSalary,
      dateFrom,
      dateTo
    } = req.query;

    // Build query
    const query = {};
    
    if (country) query.country = country;
    if (skill) query.skills = { $in: [skill] };
    if (minSalary) query.salaryMin = { $gte: parseInt(minSalary) };
    if (maxSalary) query.salaryMax = { $lte: parseInt(maxSalary) };
    
    if (dateFrom || dateTo) {
      query.postedDate = {};
      if (dateFrom) query.postedDate.$gte = new Date(dateFrom);
      if (dateTo) query.postedDate.$lte = new Date(dateTo);
    }

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('jobTitle company country city salaryMin salaryMax jobType experienceLevel skills postedDate source')
      .lean();

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

// Export job data as CSV
router.get('/export-jobs', authenticate, requireAdmin, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const jobs = await Job.find({})
      .sort({ postedDate: -1 })
      .limit(10000) // Limit to prevent memory issues
      .select('jobTitle company country city salaryMin salaryMax jobType experienceLevel skills postedDate source')
      .lean();

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = 'Job Title,Company,Country,City,Min Salary,Max Salary,Job Type,Experience Level,Skills,Posted Date,Source\n';
      const csvData = jobs.map(job => 
        `"${job.jobTitle}","${job.company}","${job.country}","${job.city || ''}","${job.salaryMin}","${job.salaryMax}","${job.jobType}","${job.experienceLevel}","${job.skills.join('; ')}","${job.postedDate}","${job.source}"`
      ).join('\n');

      const csvContent = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="jobs-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({
        jobs,
        total: jobs.length,
        exportedAt: new Date()
      });
    }

  } catch (error) {
    console.error('Export jobs error:', error);
    res.status(500).json({ error: 'Failed to export jobs' });
  }
});

// Get real-time scraping statistics
router.get('/scraping-stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Recent scraping activity
    const recentJobs = await Job.countDocuments({
      postedDate: { $gte: last24Hours }
    });

    const weeklyJobs = await Job.countDocuments({
      postedDate: { $gte: last7Days }
    });

    // Jobs by source
    const jobsBySource = await Job.aggregate([
      { $match: { postedDate: { $gte: last7Days } } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          latest: { $max: '$postedDate' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Success rate by source
    const sourceStats = await Job.aggregate([
      { $match: { postedDate: { $gte: last7Days } } },
      {
        $group: {
          _id: '$source',
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        }
      },
      {
        $addFields: {
          successRate: { $multiply: [{ $divide: ['$active', '$total'] }, 100] }
        }
      }
    ]);

    res.json({
      recentJobs,
      weeklyJobs,
      jobsBySource,
      sourceStats,
      period: '7 days',
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Scraping stats error:', error);
    res.status(500).json({ error: 'Failed to fetch scraping stats' });
  }
});

// Get Adzuna market insights
router.get('/adzuna-insights', authenticate, requireAdmin, async (req, res) => {
  try {
    const AdzunaScraper = require('../scrapers/AdzunaScraper');
    const adzunaScraper = new AdzunaScraper();
    
    const insights = await adzunaScraper.getMarketInsights();
    
    res.json({
      insights,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Adzuna insights error:', error);
    res.status(500).json({ error: 'Failed to fetch Adzuna insights' });
  }
});

// Get salary trends by country
router.get('/salary-trends/:countryCode', authenticate, requireAdmin, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const AdzunaScraper = require('../scrapers/AdzunaScraper');
    const adzunaScraper = new AdzunaScraper();
    
    const trends = await adzunaScraper.getSalaryTrends(countryCode);
    
    res.json({
      countryCode,
      trends,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Salary trends error:', error);
    res.status(500).json({ error: 'Failed to fetch salary trends' });
  }
});

// Get LinkedIn market insights
router.get('/linkedin-insights', authenticate, requireAdmin, async (req, res) => {
  try {
    const LinkedInScraper = require('../scrapers/LinkedInScraper');
    const linkedinScraper = new LinkedInScraper();
    
    const insights = await linkedinScraper.getMarketInsights();
    
    res.json({
      insights,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('LinkedIn insights error:', error);
    res.status(500).json({ error: 'Failed to fetch LinkedIn insights' });
  }
});

// Get Glassdoor market insights
router.get('/glassdoor-insights', authenticate, requireAdmin, async (req, res) => {
  try {
    const GlassdoorScraper = require('../scrapers/GlassdoorScraper');
    const glassdoorScraper = new GlassdoorScraper();
    
    const insights = await glassdoorScraper.getMarketInsights();
    
    res.json({
      insights,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Glassdoor insights error:', error);
    res.status(500).json({ error: 'Failed to fetch Glassdoor insights' });
  }
});

// Get comprehensive market insights from all sources
router.get('/comprehensive-insights', authenticate, requireAdmin, async (req, res) => {
  try {
    const AdzunaScraper = require('../scrapers/AdzunaScraper');
    const LinkedInScraper = require('../scrapers/LinkedInScraper');
    const GlassdoorScraper = require('../scrapers/GlassdoorScraper');
    
    const [adzunaInsights, linkedinInsights, glassdoorInsights] = await Promise.all([
      new AdzunaScraper().getMarketInsights(),
      new LinkedInScraper().getMarketInsights(),
      new GlassdoorScraper().getMarketInsights()
    ]);
    
    const comprehensive = {
      totalJobs: (adzunaInsights?.totalJobs || 0) + (linkedinInsights?.totalJobs || 0) + (glassdoorInsights?.totalJobs || 0),
      sources: {
        adzuna: adzunaInsights || {},
        linkedin: linkedinInsights || {},
        glassdoor: glassdoorInsights || {}
      },
      combined: {
        avgSalary: {
          min: Math.round((adzunaInsights?.avgSalary?.min || 0 + linkedinInsights?.avgSalary?.min || 0 + glassdoorInsights?.avgSalary?.min || 0) / 3),
          max: Math.round((adzunaInsights?.avgSalary?.max || 0 + linkedinInsights?.avgSalary?.max || 0 + glassdoorInsights?.avgSalary?.max || 0) / 3)
        },
        topSkills: this.combineSkills([adzunaInsights?.topSkills || [], linkedinInsights?.topSkills || [], glassdoorInsights?.topSkills || []]),
        jobTypes: this.combineJobTypes([adzunaInsights?.jobTypes || [], linkedinInsights?.jobTypes || [], glassdoorInsights?.jobTypes || []]),
        remoteJobs: (adzunaInsights?.remoteJobs || 0) + (linkedinInsights?.remoteJobs || 0) + (glassdoorInsights?.remoteJobs || 0)
      }
    };
    
    res.json({
      comprehensive,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Comprehensive insights error:', error);
    res.status(500).json({ error: 'Failed to fetch comprehensive insights' });
  }
});

// Helper function to combine skills from multiple sources
function combineSkills(skillsArrays) {
  const skillCounts = {};
  
  skillsArrays.forEach(skills => {
    skills.forEach(skill => {
      if (skillCounts[skill.skill]) {
        skillCounts[skill.skill] += skill.count;
      } else {
        skillCounts[skill.skill] = skill.count;
      }
    });
  });
  
  return Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// Helper function to combine job types from multiple sources
function combineJobTypes(jobTypesArrays) {
  const typeCounts = {};
  
  jobTypesArrays.forEach(jobTypes => {
    jobTypes.forEach(jobType => {
      if (typeCounts[jobType.type]) {
        typeCounts[jobType.type] += jobType.count;
      } else {
        typeCounts[jobType.type] = jobType.count;
      }
    });
  });
  
  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

module.exports = router;
