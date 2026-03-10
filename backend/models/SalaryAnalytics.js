const mongoose = require('mongoose');

/**
 * SalaryAnalytics Schema - Stores aggregated salary data and trends
 */
const salaryAnalyticsSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  currency: {
    type: String,
    default: 'USD',
    index: true
  },
  overall: {
    average: { type: Number, required: true },
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true },
    median: { type: Number, required: true },
    count: { type: Number, required: 0 },
    standardDeviation: { type: Number, default: 0 }
  },
  bySkill: [{
    skill: { type: String, required: true },
    average: { type: Number, required: true },
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true },
    median: { type: Number, required: true },
    count: { type: Number, required: true },
    growth: { type: Number, default: 0 }
  }],
  byCountry: [{
    country: { type: String, required: true },
    average: { type: Number, required: true },
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true },
    median: { type: Number, required: true },
    count: { type: Number, required: true },
    growth: { type: Number, default: 0 }
  }],
  bySeniority: [{
    level: { type: String, required: true },
    average: { type: Number, required: true },
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true },
    median: { type: Number, required: true },
    count: { type: Number, required: true },
    growth: { type: Number, default: 0 }
  }],
  byJobType: [{
    type: { type: String, required: true },
    average: { type: Number, required: true },
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true },
    median: { type: Number, required: true },
    count: { type: Number, required: true }
  }],
  percentiles: {
    p10: { type: Number },
    p25: { type: Number },
    p50: { type: Number },
    p75: { type: Number },
    p90: { type: Number }
  },
  trends: {
    monthOverMonth: { type: Number, default: 0 },
    quarterOverQuarter: { type: Number, default: 0 },
    yearOverYear: { type: Number, default: 0 }
  },
  metadata: {
    totalJobsAnalyzed: { type: Number, default: 0 },
    dataQuality: { type: Number, default: 0 }, // 0-100 score
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true,
  collection: 'salaryAnalytics'
});

// Compound indexes
salaryAnalyticsSchema.index({ period: 1, date: -1 });
salaryAnalyticsSchema.index({ period: 1, currency: 1, date: -1 });
salaryAnalyticsSchema.index({ date: -1, 'overall.average': -1 });

// Static methods
salaryAnalyticsSchema.statics.getLatest = function(period = 'monthly', currency = 'USD') {
  return this.findOne({ period, currency })
    .sort({ date: -1 })
    .select('overall bySkill byCountry bySeniority percentiles trends metadata');
};

salaryAnalyticsSchema.statics.getHistorical = function(period = 'monthly', months = 12, currency = 'USD') {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.find({ 
    period, 
    currency, 
    date: { $gte: startDate } 
  })
    .sort({ date: 1 })
    .select('date overall trends metadata');
};

salaryAnalyticsSchema.statics.getSalaryBySkill = function(skill, period = 'monthly', months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    { $match: { period, date: { $gte: startDate } } },
    { $unwind: '$bySkill' },
    { $match: { 'bySkill.skill': skill.toLowerCase() } },
    {
      $project: {
        date: 1,
        skill: '$bySkill.skill',
        average: '$bySkill.average',
        minimum: '$bySkill.minimum',
        maximum: '$bySkill.maximum',
        median: '$bySkill.median',
        count: '$bySkill.count',
        growth: '$bySkill.growth'
      }
    },
    { $sort: { date: 1 } }
  ]);
};

salaryAnalyticsSchema.statics.getSalaryByCountry = function(country, period = 'monthly', months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    { $match: { period, date: { $gte: startDate } } },
    { $unwind: '$byCountry' },
    { $match: { 'byCountry.country': country } },
    {
      $project: {
        date: 1,
        country: '$byCountry.country',
        average: '$byCountry.average',
        minimum: '$byCountry.minimum',
        maximum: '$byCountry.maximum',
        median: '$byCountry.median',
        count: '$byCountry.count',
        growth: '$byCountry.growth'
      }
    },
    { $sort: { date: 1 } }
  ]);
};

salaryAnalyticsSchema.statics.getTopPayingSkills = function(limit = 20, period = 'monthly') {
  return this.findOne({ period })
    .sort({ date: -1 })
    .select('bySkill')
    .then(doc => {
      if (!doc || !doc.bySkill) return [];
      return doc.bySkill
        .sort((a, b) => b.average - a.average)
        .slice(0, limit);
    });
};

salaryAnalyticsSchema.statics.getSalaryRanges = function(period = 'monthly') {
  return this.findOne({ period })
    .sort({ date: -1 })
    .select('overall percentiles bySeniority');
};

// Pre-save middleware
salaryAnalyticsSchema.pre('save', function(next) {
  this.metadata.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('SalaryAnalytics', salaryAnalyticsSchema);
