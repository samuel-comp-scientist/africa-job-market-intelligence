const mongoose = require('mongoose');

/**
 * SkillTrends Schema - Tracks skill demand trends over time
 */
const skillTrendsSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Programming Languages',
      'Frontend',
      'Backend',
      'Databases',
      'Cloud & DevOps',
      'Mobile',
      'Data Science',
      'Tools & Others'
    ],
    index: true
  },
  timeframe: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  demand: {
    count: { type: Number, required: true },
    percentage: { type: Number, required: true },
    rank: { type: Number, required: true }
  },
  growth: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    quarterly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 }
  },
  distribution: {
    byCountry: [{
      country: String,
      count: Number,
      percentage: Number
    }],
    bySeniority: [{
      level: String,
      count: Number,
      percentage: Number
    }],
    byRegion: [{
      region: String,
      count: Number,
      percentage: Number
    }]
  },
  relatedSkills: [{
    skill: String,
    coOccurrence: Number,
    correlation: Number
  }],
  predictions: {
    nextMonth: { type: Number },
    nextQuarter: { type: Number },
    nextYear: { type: Number },
    confidence: { type: Number, min: 0, max: 1, default: 0.5 }
  },
  marketSignals: {
    emerging: { type: Boolean, default: false },
    declining: { type: Boolean, default: false },
    stable: { type: Boolean, default: true },
    hot: { type: Boolean, default: false }
  },
  seasonality: {
    pattern: { type: String, enum: ['none', 'quarterly', 'semi-annual', 'annual'], default: 'none' },
    peakMonths: [Number],
    lowMonths: [Number]
  },
  metadata: {
    totalJobsAnalyzed: { type: Number, default: 0 },
    dataPoints: { type: Number, default: 0 },
    lastCalculated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true,
  collection: 'skillTrends'
});

// Compound indexes
skillTrendsSchema.index({ skill: 1, timeframe: 1, date: -1 });
skillTrendsSchema.index({ category: 1, timeframe: 1, date: -1 });
skillTrendsSchema.index({ timeframe: 1, date: -1, 'demand.count': -1 });
skillTrendsSchema.index({ 'growth.monthly': -1, date: -1 });

// Static methods
skillTrendsSchema.statics.getTopTrending = function(limit = 20, timeframe = 'monthly') {
  return this.find({ timeframe })
    .sort({ 'growth.monthly': -1, 'demand.count': -1 })
    .limit(limit)
    .select('skill category demand growth predictions marketSignals');
};

skillTrendsSchema.statics.getEmergingSkills = function(limit = 20, timeframe = 'monthly') {
  return this.find({ 
    timeframe, 
    'marketSignals.emerging': true,
    'growth.monthly': { $gt: 10 }
  })
    .sort({ 'growth.monthly': -1 })
    .limit(limit)
    .select('skill category demand growth predictions');
};

skillTrendsSchema.statics.getDecliningSkills = function(limit = 20, timeframe = 'monthly') {
  return this.find({ 
    timeframe, 
    'marketSignals.declining': true,
    'growth.monthly': { $lt: -5 }
  })
    .sort({ 'growth.monthly': 1 })
    .limit(limit)
    .select('skill category demand growth');
};

skillTrendsSchema.statics.getSkillHistory = function(skill, timeframe = 'monthly', months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.find({ 
    skill: skill.toLowerCase(), 
    timeframe,
    date: { $gte: startDate } 
  })
    .sort({ date: 1 })
    .select('date demand growth predictions');
};

skillTrendsSchema.statics.getCategoryTrends = function(category, timeframe = 'monthly', months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    { $match: { category, timeframe, date: { $gte: startDate } } },
    {
      $group: {
        _id: '$date',
        totalDemand: { $sum: '$demand.count' },
        avgGrowth: { $avg: '$growth.monthly' },
        skillCount: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } },
    {
      $project: {
        date: '$_id',
        totalDemand: 1,
        avgGrowth: { $round: ['$avgGrowth', 2] },
        skillCount: 1,
        _id: 0
      }
    }
  ]);
};

skillTrendsSchema.statics.getRegionalTrends = function(timeframe = 'monthly', months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.findOne({ timeframe, date: { $gte: startDate } })
    .sort({ date: -1 })
    .select('distribution.byRegion')
    .then(doc => {
      if (!doc || !doc.distribution || !doc.distribution.byRegion) return [];
      return doc.distribution.byRegion.sort((a, b) => b.count - a.count);
    });
};

skillTrendsSchema.statics.getPredictions = function(horizon = 'monthly', limit = 20) {
  const predictionField = horizon === 'monthly' ? 'nextMonth' : 
                        horizon === 'quarterly' ? 'nextQuarter' : 'nextYear';
  
  return this.find({ timeframe: 'monthly' })
    .sort({ [`predictions.${predictionField}`]: -1, 'predictions.confidence': -1 })
    .limit(limit)
    .select('skill category predictions growth marketSignals');
};

// Virtual for trend status
skillTrendsSchema.virtual('trendStatus').get(function() {
  const monthlyGrowth = this.growth.monthly;
  if (this.marketSignals.hot) return '🔥 Hot';
  if (this.marketSignals.emerging) return '🌱 Emerging';
  if (this.marketSignals.declining) return '📉 Declining';
  if (monthlyGrowth > 10) return '📈 Fast Growing';
  if (monthlyGrowth > 5) return '⬆️ Growing';
  if (monthlyGrowth < -5) return '⬇️ Declining';
  return '➡️ Stable';
});

// Pre-save middleware
skillTrendsSchema.pre('save', function(next) {
  // Update market signals based on growth and demand
  const monthlyGrowth = this.growth.monthly;
  const demandCount = this.demand.count;
  
  this.marketSignals.emerging = monthlyGrowth > 15 && demandCount < 50;
  this.marketSignals.hot = monthlyGrowth > 25 && demandCount > 20;
  this.marketSignals.declining = monthlyGrowth < -10;
  this.marketSignals.stable = Math.abs(monthlyGrowth) <= 5;
  
  this.metadata.lastCalculated = new Date();
  next();
});

module.exports = mongoose.model('SkillTrends', skillTrendsSchema);
