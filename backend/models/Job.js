const mongoose = require('mongoose');

/**
 * Job Schema - Represents a job posting in the database
 */
const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  city: {
    type: String,
    trim: true,
    maxlength: 100
  },
  salaryMin: {
    type: Number,
    min: 0
  },
  salaryMax: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    trim: true,
    maxlength: 3
  },
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  jobDescription: {
    type: String,
    required: true,
    maxlength: 10000
  },
  jobUrl: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  postedDate: {
    type: Date,
    required: true,
    index: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'remote'],
    default: 'full-time'
  },
  seniorityLevel: {
    type: String,
    enum: ['junior', 'mid-level', 'senior', 'lead', 'architect', 'manager'],
    default: 'mid-level'
  },
  experienceRequired: {
    type: String,
    trim: true
  },
  educationRequired: {
    type: String,
    trim: true
  },
  applicationDeadline: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'jobs'
});

// Compound indexes for better query performance
jobSchema.index({ country: 1, postedDate: -1 });
jobSchema.index({ skills: 1, postedDate: -1 });
jobSchema.index({ company: 1, postedDate: -1 });
jobSchema.index({ source: 1, scrapedAt: -1 });
jobSchema.index({ isActive: 1, postedDate: -1 });

// Text index for search functionality
jobSchema.index({ 
  jobTitle: 'text', 
  jobDescription: 'text',
  skills: 'text'
});

// Virtual for formatted salary range
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salaryMin && !this.salaryMax) return 'Not specified';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  if (this.salaryMin && this.salaryMax) {
    return `${formatter.format(this.salaryMin)} - ${formatter.format(this.salaryMax)}`;
  } else if (this.salaryMin) {
    return `From ${formatter.format(this.salaryMin)}`;
  } else {
    return `Up to ${formatter.format(this.salaryMax)}`;
  }
});

// Virtual for average salary
jobSchema.virtual('avgSalary').get(function() {
  if (this.salaryMin && this.salaryMax) {
    return (this.salaryMin + this.salaryMax) / 2;
  }
  return this.salaryMin || this.salaryMax;
});

// Static methods
jobSchema.statics.getTopSkills = function(limit = 20) {
  return this.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$skills' },
    { $group: { _id: '$skills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { skill: '$_id', count: 1, _id: 0 } }
  ]);
};

jobSchema.statics.getSalaryStats = function() {
  return this.aggregate([
    { $match: { isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    {
      $project: {
        avgSalary: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] },
        minSalary: { $min: ['$salaryMin', '$salaryMax'] },
        maxSalary: { $max: ['$salaryMin', '$salaryMax'] }
      }
    },
    {
      $group: {
        _id: null,
        overallAvg: { $avg: '$avgSalary' },
        overallMin: { $min: '$minSalary' },
        overallMax: { $max: '$maxSalary' },
        count: { $sum: 1 }
      }
    }
  ]);
};

jobSchema.statics.getJobsByCountry = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

jobSchema.statics.getSalaryBySkill = function() {
  return this.aggregate([
    { $match: { isActive: true, skills: { $exists: true, $ne: [] }, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills',
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgSalary: -1 } },
    { $project: { skill: '$_id', avgSalary: { $round: ['$avgSalary', 0] }, count: 1, _id: 0 } }
  ]);
};

jobSchema.statics.getJobTrends = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: '$postedDate' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

jobSchema.statics.getTopCompanies = function(limit = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$company',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

jobSchema.statics.getSalaryByCountry = function() {
  return this.aggregate([
    { $match: { isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    {
      $group: {
        _id: '$country',
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } },
        minSalary: { $min: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } },
        maxSalary: { $max: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgSalary: -1 } },
    { $project: { country: '$_id', avgSalary: { $round: ['$avgSalary', 0] }, minSalary: { $round: ['$minSalary', 0] }, maxSalary: { $round: ['$maxSalary', 0] }, count: 1, _id: 0 } }
  ]);
};

jobSchema.statics.getSalaryBySeniority = function() {
  return this.aggregate([
    { $match: { isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    {
      $group: {
        _id: '$seniorityLevel',
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgSalary: -1 } },
    { $project: { level: '$_id', avgSalary: { $round: ['$avgSalary', 0] }, count: 1, _id: 0 } }
  ]);
};

jobSchema.statics.getSalaryByJobTitle = function(limit = 15) {
  return this.aggregate([
    { $match: { isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    {
      $project: {
        role: {
          $trim: {
            input: {
              $regexFind: {
                input: '$jobTitle',
                regex: '(?i)(software engineer|data scientist|devops|data engineer|machine learning|frontend|backend|full stack|fullstack|mobile developer|cloud architect|security engineer|qa engineer|test engineer|product manager|ui ux|designer|system administrator|network engineer|blockchain|ai engineer|ml engineer|analyst|developer|programmer|tech lead|engineering manager|cto|vp of engineering)'
              }
            }
          }
        },
        avgJobSalary: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] },
        jobTitle: 1,
        salaryMin: 1,
        salaryMax: 1
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$jobTitle', 'Other'] },
        avgSalary: { $avg: '$avgJobSalary' },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgSalary: -1 } },
    { $limit: limit },
    { $project: { role: '$_id', avgSalary: { $round: ['$avgSalary', 0] }, count: 1, _id: 0 } }
  ]);
};

jobSchema.statics.getSalaryDistribution = function() {
  return this.aggregate([
    { $match: { isActive: true, $or: [{ salaryMin: { $gt: 0 } }, { salaryMax: { $gt: 0 } }] } },
    {
      $project: {
        avgSalary: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] }
      }
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$avgSalary', 1000] }, then: 'Under $1K' },
              { case: { $lt: ['$avgSalary', 2000] }, then: '$1K-$2K' },
              { case: { $lt: ['$avgSalary', 3000] }, then: '$2K-$3K' },
              { case: { $lt: ['$avgSalary', 5000] }, then: '$3K-$5K' },
              { case: { $lt: ['$avgSalary', 8000] }, then: '$5K-$8K' },
              { case: { $lt: ['$avgSalary', 12000] }, then: '$8K-$12K' }
            ],
            default: '$12K+'
          }
        },
        count: { $sum: 1 },
        avgInBucket: { $avg: '$avgSalary' }
      }
    },
    { $sort: { avgInBucket: 1 } },
    { $project: { range: '$_id', count: 1, avgSalary: { $round: ['$avgInBucket', 0] }, _id: 0 } }
  ]);
};

jobSchema.statics.getJobGrowthByCountry = function(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  return this.aggregate([
    { $match: { isActive: true, postedDate: { $gte: startDate } } },
    {
      $group: {
        _id: {
          country: '$country',
          month: { $dateToString: { format: "%Y-%m", date: '$postedDate' } }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.country': 1, '_id.month': 1 } },
    {
      $project: {
        country: '$_id.country',
        month: '$_id.month',
        count: 1,
        _id: 0
      }
    }
  ]);
};

jobSchema.statics.getSkillDemandByCategory = function() {
  return this.aggregate([
    { $match: { isActive: true, skills: { $exists: true, $ne: [] } } },
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills',
        count: { $sum: 1 },
        countries: { $addToSet: '$country' }
      }
    },
    {
      $project: {
        skill: '$_id',
        count: 1,
        countryCount: { $size: '$countries' },
        _id: 0
      }
    },
    { $sort: { count: -1 } },
    { $limit: 30 }
  ]);
};

jobSchema.statics.getJobsByCity = function(country) {
  const match = { isActive: true };
  if (country) match.country = country;
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { country: '$country', city: '$city' },
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 50 },
    {
      $project: {
        country: '$_id.country',
        city: { $ifNull: ['$_id.city', 'Unknown'] },
        count: 1,
        avgSalary: { $round: ['$avgSalary', 0] },
        _id: 0
      }
    }
  ]);
};

jobSchema.statics.getTrendsBySkill = function(skill) {
  return this.aggregate([
    { $match: { isActive: true, skills: skill.toLowerCase() } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: '$postedDate' } },
        count: { $sum: 1 },
        avgSalary: { $avg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] } }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: '$_id',
        count: 1,
        avgSalary: { $round: ['$avgSalary', 0] },
        _id: 0
      }
    }
  ]);
};

jobSchema.statics.getIndustryBreakdown = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $project: {
        industry: {
          $switch: {
            branches: [
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'software|developer|engineer|programmer' } }, then: 'Software Development' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'data|analyst|analytics|bi' } }, then: 'Data & Analytics' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'ai|ml|machine learning|deep learning' } }, then: 'AI/ML' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'devops|cloud|infrastructure|sre' } }, then: 'DevOps & Cloud' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'security|cyber' } }, then: 'Cybersecurity' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'design|ui|ux' } }, then: 'Design' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'product|manager|scrum' } }, then: 'Product Management' },
              { case: { $regexMatch: { input: { $toLower: '$jobTitle' }, regex: 'qa|test|quality' } }, then: 'Quality Assurance' }
            ],
            default: 'Other'
          }
        },
        salaryAvg: { $avg: [{ $ifNull: ['$salaryMin', 0] }, { $ifNull: ['$salaryMax', 0] }] }
      }
    },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        avgSalary: { $avg: '$salaryAvg' }
      }
    },
    { $sort: { count: -1 } },
    { $project: { industry: '$_id', count: 1, avgSalary: { $round: ['$avgSalary', 0] }, _id: 0 } }
  ]);
};

// Pre-save middleware to extract additional information
jobSchema.pre('save', function(next) {
  // Extract seniority level from job title
  if (this.isModified('jobTitle')) {
    const title = this.jobTitle.toLowerCase();
    
    if (title.includes('junior') || title.includes('intern') || title.includes('trainee') || title.includes('entry')) {
      this.seniorityLevel = 'junior';
    } else if (title.includes('senior') || title.includes('sr.') || title.includes('lead')) {
      this.seniorityLevel = 'senior';
    } else if (title.includes('architect') || title.includes('principal')) {
      this.seniorityLevel = 'architect';
    } else if (title.includes('manager') || title.includes('head') || title.includes('director')) {
      this.seniorityLevel = 'manager';
    }
  }
  
  // Extract job type
  if (this.isModified('jobTitle') || this.isModified('jobDescription')) {
    const text = `${this.jobTitle} ${this.jobDescription}`.toLowerCase();
    
    if (text.includes('remote') || text.includes('work from home') || text.includes('wfh')) {
      this.jobType = 'remote';
    } else if (text.includes('contract')) {
      this.jobType = 'contract';
    } else if (text.includes('freelance')) {
      this.jobType = 'freelance';
    } else if (text.includes('internship') || text.includes('intern')) {
      this.jobType = 'internship';
    } else if (text.includes('part-time') || text.includes('part time')) {
      this.jobType = 'part-time';
    }
  }
  
  next();
});

module.exports = mongoose.model('Job', jobSchema);
