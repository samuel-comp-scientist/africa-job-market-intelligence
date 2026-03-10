const Job = require('../models/Job');

// Get all jobs with pagination and filters
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, country, skill, minSalary, maxSalary, search } = req.query;
    
    const query = {};
    
    if (country) query.country = country;
    if (skill) query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    if (minSalary) query['salary.min'] = { $gte: parseInt(minSalary) };
    if (maxSalary) query['salary.max'] = { $lte: parseInt(maxSalary) };
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
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
    const totalJobs = await Job.countDocuments();
    const jobsByCountry = await Job.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const avgSalary = await Job.aggregate([
      { $match: { 'salary.min': { $exists: true, $ne: null } } },
      { $group: { _id: null, avgMin: { $avg: '$salary.min' }, avgMax: { $avg: '$salary.max' } } }
    ]);

    res.json({
      totalJobs,
      jobsByCountry,
      averageSalary: avgSalary[0] || { avgMin: 0, avgMax: 0 }
    });
  } catch (error) {
    res.status(500