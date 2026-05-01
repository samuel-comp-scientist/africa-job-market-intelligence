const Job = require('../models/Job');
const JobScraperService = require('../services/scraper');

// Get all jobs with pagination and filters
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, country, skill, minSalary, maxSalary, search } = req.query;
    
    const query = { isActive: true };
    
    if (country) query.country = country;
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (minSalary) query.salaryMin = { $gte: parseInt(minSalary) };
    if (maxSalary) query.salaryMax = { $lte: parseInt(maxSalary) };
    if (search) {
      query.$or = [
        { jobTitle: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { jobDescription: new RegExp(search, 'i') }
      ];
    }

    const jobs = await Job.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ postedDate: -1 })
      .exec();

    const count = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get job statistics
exports.getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const jobsByCountry = await Job.getJobsByCountry();
    const topSkills = await Job.getTopSkills();
    const salaryStats = await Job.getSalaryStats();

    res.json({
      totalJobs,
      jobsByCountry,
      topSkills,
      salaryStats: salaryStats[0] || { overallAvg: 0, overallMin: 0, overallMax: 0, count: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Scrape new jobs
exports.scrapeJobs = async (req, res) => {
  try {
    const { keywords = ['software developer', 'data scientist', 'web developer'] } = req.body;
    
    const scraper = new JobScraperService();
    const scrapedJobs = await scraper.scrapeAllSources(keywords);
    
    res.json({
      message: 'Jobs scraped successfully',
      jobsFound: scrapedJobs.length,
      data: scrapedJobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get jobs by country
exports.getJobsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const jobs = await Job.find({ 
      country: country, 
      isActive: true 
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ postedDate: -1 })
      .exec();

    const count = await Job.countDocuments({ country, isActive: true });

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get jobs by skill
exports.getJobsBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const jobs = await Job.find({ 
      skills: { $in: [new RegExp(skill, 'i')] },
      isActive: true 
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ postedDate: -1 })
      .exec();

    const count = await Job.countDocuments({ 
      skills: { $in: [new RegExp(skill, 'i')] },
      isActive: true 
    });

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get top skills
exports.getTopSkills = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const topSkills = await Job.getTopSkills(parseInt(limit));
    
    res.json(topSkills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search jobs
exports.searchJobs = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, country, skill } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const query = {
      $text: { $search: q },
      isActive: true
    };
    
    if (country) query.country = country;
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };

    const jobs = await Job.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: { $meta: 'textScore' }, postedDate: -1 })
      .exec();

    const count = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete job (admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update job status (admin only)
exports.updateJobStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};