const mongoose = require('mongoose');

/**
 * Company Schema - Represents hiring companies
 */
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  website: {
    type: String,
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    maxlength: 2000
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 100
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  headquarters: {
    country: String,
    city: String,
    address: String
  },
  locations: [{
    country: String,
    city: String,
    officeType: {
      type: String,
      enum: ['headquarters', 'branch', 'remote']
    }
  }],
  founded: {
    type: Date
  },
  logo: {
    type: String,
    trim: true
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  contact: {
    email: String,
    phone: String,
    website: String
  },
  benefits: [{
    type: String,
    trim: true
  }],
  techStack: [{
    type: String,
    trim: true
  }],
  jobCount: {
    type: Number,
    default: 0
  },
  activeJobs: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'companies'
});

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ 'headquarters.country': 1 });
companySchema.index({ isActive: 1, lastScraped: -1 });
companySchema.index({ jobCount: -1 });

// Virtual for formatted company size
companySchema.virtual('formattedSize').get(function() {
  if (!this.size) return 'Unknown';
  return this.size;
});

// Static methods
companySchema.statics.getTopHiring = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ activeJobs: -1 })
    .limit(limit)
    .select('name industry headquarters jobCount activeJobs logo');
};

companySchema.statics.getByIndustry = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalJobs: { $sum: '$jobCount' },
        avgJobs: { $avg: '$jobCount' }
      }
    },
    { $sort: { totalJobs: -1 } },
    { $limit: 20 },
    {
      $project: {
        industry: '$_id',
        companyCount: '$count',
        totalJobs: '$totalJobs',
        avgJobsPerCompany: { $round: ['$avgJobs', 1] },
        _id: 0
      }
    }
  ]);
};

module.exports = mongoose.model('Company', companySchema);
