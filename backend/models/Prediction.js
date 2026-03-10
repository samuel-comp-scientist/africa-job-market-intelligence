const mongoose = require('mongoose');

/**
 * Prediction Schema - AI-powered predictions for job market trends
 */
const predictionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['skill_demand', 'salary_trend', 'job_market', 'regional_growth'],
    index: true
  },
  target: {
    skill: String,
    country: String,
    region: String,
    industry: String
  },
  timeframe: {
    type: String,
    required: true,
    enum: ['1_month', '3_months', '6_months', '12_months', '24_months'],
    index: true
  },
  predictions: [{
    date: Date,
    value: Number,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    upper_bound: Number,
    lower_bound: Number
  }],
  current_value: {
    type: Number,
    required: true
  },
  predicted_value: {
    type: Number,
    required: true
  },
  growth_rate: {
    type: Number,
    required: true
  },
  accuracy: {
    historical_accuracy: { type: Number, default: 0 },
    model_confidence: { type: Number, default: 0 },
    data_quality: { type: Number, default: 0 }
  },
  model: {
    name: { type: String, required: true },
    version: { type: String, required: true },
    algorithm: { type: String, required: true },
    trained_at: { type: Date, required: true },
    features_used: [String]
  },
  factors: [{
    name: String,
    impact: Number,
    description: String
  }],
  metadata: {
    data_points_used: { type: Number, required: true },
    time_range: {
      start: Date,
      end: Date
    },
    last_updated: { type: Date, default: Date.now },
    created_by: String
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'training', 'failed'],
    default: 'active'
  },
  tags: [String]
}, {
  timestamps: true,
  collection: 'predictions'
});

// Indexes
predictionSchema.index({ type: 1, timeframe: 1, 'target.skill': 1 });
predictionSchema.index({ type: 1, timeframe: 1, 'target.country': 1 });
predictionSchema.index({ timeframe: 1, 'predicted_value': -1 });
predictionSchema.index({ 'model.trained_at': -1 });
predictionSchema.index({ status: 1, 'metadata.last_updated': -1 });

// Static methods
predictionSchema.statics.getSkillPredictions = function(timeframe = '6_months', limit = 20) {
  return this.find({ 
    type: 'skill_demand', 
    timeframe,
    status: 'active'
  })
    .sort({ growth_rate: -1, 'accuracy.model_confidence': -1 })
    .limit(limit)
    .select('target timeframe predictions growth_rate accuracy model');
};

predictionSchema.statics.getSalaryPredictions = function(timeframe = '6_months', limit = 20) {
  return this.find({ 
    type: 'salary_trend', 
    timeframe,
    status: 'active'
  })
    .sort({ growth_rate: -1 })
    .limit(limit)
    .select('target timeframe predictions growth_rate accuracy factors');
};

predictionSchema.statics.getMarketPredictions = function(timeframe = '6_months') {
  return this.find({ 
    type: 'job_market', 
    timeframe,
    status: 'active'
  })
    .sort({ 'metadata.last_updated': -1 })
    .select('predictions factors accuracy metadata');
};

predictionSchema.statics.getRegionalPredictions = function(timeframe = '6_months') {
  return this.find({ 
    type: 'regional_growth', 
    timeframe,
    status: 'active'
  })
    .sort({ growth_rate: -1 })
    .select('target timeframe predictions growth_rate accuracy');
};

predictionSchema.statics.getPredictionBySkill = function(skill, timeframe = '6_months') {
  return this.findOne({ 
    type: 'skill_demand',
    'target.skill': skill.toLowerCase(),
    timeframe,
    status: 'active'
  })
    .select('target timeframe predictions growth_rate accuracy factors model');
};

predictionSchema.statics.getPredictionByCountry = function(country, timeframe = '6_months') {
  return this.find({ 
    'target.country': country,
    timeframe,
    status: 'active'
  })
    .sort({ type: 1 })
    .select('type target timeframe predictions growth_rate accuracy');
};

predictionSchema.statics.getModelPerformance = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: {
          model: '$model.name',
          version: '$model.version'
        },
        avg_accuracy: { $avg: '$accuracy.historical_accuracy' },
        avg_confidence: { $avg: '$accuracy.model_confidence' },
        prediction_count: { $sum: 1 },
        last_trained: { $max: '$model.trained_at' }
      }
    },
    { $sort: { avg_accuracy: -1 } },
    {
      $project: {
        model: '$_id.model',
        version: '$_id.version',
        avg_accuracy: { $round: ['$avg_accuracy', 3] },
        avg_confidence: { $round: ['$avg_confidence', 3] },
        prediction_count: 1,
        last_trained: 1,
        _id: 0
      }
    }
  ]);
};

predictionSchema.statics.getTopGrowthPredictions = function(timeframe = '6_months', limit = 10) {
  return this.find({ 
    timeframe,
    status: 'active',
    growth_rate: { $gt: 0 }
  })
    .sort({ growth_rate: -1 })
    .limit(limit)
    .select('type target timeframe predicted_value growth_rate accuracy');
};

// Virtual for prediction quality
predictionSchema.virtual('quality').get(function() {
  const accuracy = this.accuracy.historical_accuracy || 0;
  const confidence = this.accuracy.model_confidence || 0;
  const dataQuality = this.accuracy.data_quality || 0;
  
  return Math.round((accuracy * 0.4 + confidence * 0.4 + dataQuality * 0.2) * 100);
});

// Virtual for risk level
predictionSchema.virtual('riskLevel').get(function() {
  const confidence = this.accuracy.model_confidence || 0;
  const accuracy = this.accuracy.historical_accuracy || 0;
  const avgConfidence = (confidence + accuracy) / 2;
  
  if (avgConfidence >= 0.8) return 'Low Risk';
  if (avgConfidence >= 0.6) return 'Medium Risk';
  return 'High Risk';
});

// Pre-save middleware
predictionSchema.pre('save', function(next) {
  this.metadata.last_updated = new Date();
  
  // Calculate overall accuracy score
  this.accuracy.overall = (
    this.accuracy.historical_accuracy * 0.5 +
    this.accuracy.model_confidence * 0.3 +
    this.accuracy.data_quality * 0.2
  );
  
  next();
});

module.exports = mongoose.model('Prediction', predictionSchema);
