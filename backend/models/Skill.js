const mongoose = require('mongoose');

/**
 * Skill Schema - Represents technical skills and their analytics
 */
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
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
    ]
  },
  description: {
    type: String,
    maxlength: 1000
  },
  aliases: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  demand: {
    current: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' }
    },
    historical: [{
      date: Date,
      count: Number,
      percentage: Number
    }]
  },
  salary: {
    average: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    median: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    lastUpdated: { type: Date, default: Date.now }
  },
  distribution: {
    byCountry: [{
      country: String,
      count: Number,
      percentage: Number,
      avgSalary: Number
    }],
    bySeniority: [{
      level: String,
      count: Number,
      percentage: Number,
      avgSalary: Number
    }],
    byJobType: [{
      type: String,
      count: Number,
      percentage: Number
    }]
  },
  relatedSkills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    coOccurrence: Number,
    strength: { type: Number, min: 0, max: 1 }
  }],
  growth: {
    monthly: { type: Number, default: 0 },
    quarterly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
    projected: { type: Number, default: 0 }
  },
  popularity: {
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    lastCalculated: { type: Date, default: Date.now }
  },
  learningResources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['course', 'tutorial', 'documentation', 'book'] },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    rating: { type: Number, min: 0, max: 5 }
  }],
  certifications: [{
    name: String,
    provider: String,
    url: String,
    level: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'skills'
});

// Indexes
skillSchema.index({ category: 1, 'demand.current.count': -1 });
skillSchema.index({ category: 1 });
skillSchema.index({ 'demand.current.trend': -1 });
skillSchema.index({ 'salary.average': -1 });
skillSchema.index({ 'growth.yearly': -1 });
skillSchema.index({ 'popularity.score': -1 });
skillSchema.index({ isActive: 1, lastAnalyzed: -1 });

// Virtual for trend indicator
skillSchema.virtual('trendIndicator').get(function() {
  const monthlyGrowth = this.growth.monthly;
  if (monthlyGrowth > 10) return '🚀 High Growth';
  if (monthlyGrowth > 5) return '📈 Growing';
  if (monthlyGrowth < -5) return '📉 Declining';
  return '➡️ Stable';
});

// Static methods
skillSchema.statics.getTopSkills = function(limit = 20, category = null) {
  const match = { isActive: true };
  if (category) {
    match.category = category;
  }
  
  return this.find(match)
    .sort({ 'demand.current.count': -1 })
    .limit(limit)
    .select('name category demand salary growth popularity');
};

skillSchema.statics.getSkillsByGrowth = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ 'growth.monthly': -1 })
    .limit(limit)
    .select('name category demand growth popularity');
};

skillSchema.statics.getSkillsBySalary = function(limit = 20) {
  return this.find({ isActive: true, 'salary.average': { $gt: 0 } })
    .sort({ 'salary.average': -1 })
    .limit(limit)
    .select('name category salary demand');
};

skillSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalDemand: { $sum: '$demand.current.count' },
        avgSalary: { $avg: '$salary.average' },
        avgGrowth: { $avg: '$growth.monthly' }
      }
    },
    { $sort: { totalDemand: -1 } },
    {
      $project: {
        category: '$_id',
        skillCount: '$count',
        totalDemand: '$totalDemand',
        avgSalary: { $round: ['$avgSalary', 0] },
        avgGrowth: { $round: ['$avgGrowth', 2] },
        _id: 0
      }
    }
  ]);
};

// Pre-save middleware
skillSchema.pre('save', function(next) {
  // Update popularity score based on demand and growth
  this.popularity.score = (
    this.demand.current.count * 0.4 +
    this.growth.monthly * 0.3 +
    this.salary.average / 1000 * 0.2 +
    this.distribution.byCountry.length * 0.1
  );
  
  this.lastAnalyzed = new Date();
  next();
});

module.exports = mongoose.model('Skill', skillSchema);
