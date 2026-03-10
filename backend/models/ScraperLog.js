const mongoose = require('mongoose');

/**
 * ScraperLog Schema - Logs scraping activities and performance
 */
const scraperLogSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'partial', 'skipped'],
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in milliseconds
    required: true
  },
  jobsFound: {
    type: Number,
    default: 0
  },
  jobsProcessed: {
    type: Number,
    default: 0
  },
  jobsSaved: {
    type: Number,
    default: 0
  },
  errors: [{
    type: {
      type: String,
      enum: ['network', 'parsing', 'validation', 'database', 'unknown']
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
    stack: String
  }],
  warnings: [{
    message: String,
    timestamp: { type: Date, default: Date.now },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  performance: {
    requestsPerSecond: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    dataQuality: { type: Number, default: 0 } // 0-100 score
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    proxyUsed: String,
    dataSize: Number, // in bytes
    memoryUsage: Number, // in MB
    cpuUsage: Number, // percentage
    nodeVersion: String
  },
  configuration: {
    maxPages: Number,
    delayBetweenRequests: Number,
    timeout: Number,
    retryAttempts: Number,
    filters: [String],
    selectors: mongoose.Schema.Types.Mixed
  },
  results: {
    newJobs: { type: Number, default: 0 },
    updatedJobs: { type: Number, default: 0 },
    duplicateJobs: { type: Number, default: 0 },
    invalidJobs: { type: Number, default: 0 },
    skippedJobs: { type: Number, default: 0 }
  },
  quality: {
    completenessScore: { type: Number, default: 0 }, // 0-100
    accuracyScore: { type: Number, default: 0 }, // 0-100
    freshnessScore: { type: Number, default: 0 } // 0-100
  },
  scheduledRun: {
    type: Boolean,
    default: false
  },
  runId: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'scraperLogs'
});

// Indexes
scraperLogSchema.index({ source: 1, startTime: -1 });
scraperLogSchema.index({ status: 1, startTime: -1 });
scraperLogSchema.index({ startTime: -1, duration: -1 });
scraperLogSchema.index({ 'performance.successRate': -1 });
scraperLogSchema.index({ scheduledRun: 1, startTime: -1 });

// Static methods
scraperLogSchema.statics.getRecentLogs = function(limit = 50, source = null) {
  const query = {};
  if (source) {
    query.source = source;
  }
  
  return this.find(query)
    .sort({ startTime: -1 })
    .limit(limit)
    .select('source status startTime duration jobsFound jobsSaved performance errors');
};

scraperLogSchema.statics.getPerformanceStats = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { startTime: { $gte: startDate } } },
    {
      $group: {
        _id: '$source',
        totalRuns: { $sum: 1 },
        successfulRuns: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
        totalJobs: { $sum: '$jobsFound' },
        avgDuration: { $avg: '$duration' },
        avgSuccessRate: { $avg: '$performance.successRate' },
        avgDataQuality: { $avg: '$performance.dataQuality' }
      }
    },
    { $sort: { totalJobs: -1 } },
    {
      $project: {
        source: '$_id',
        totalRuns: 1,
        successRate: { $multiply: [{ $divide: ['$successfulRuns', '$totalRuns'] }, 100] },
        totalJobs: 1,
        avgDuration: { $round: ['$avgDuration', 0] },
        avgPerformance: { $round: ['$avgSuccessRate', 2] },
        avgDataQuality: { $round: ['$avgDataQuality', 1] },
        _id: 0
      }
    }
  ]);
};

scraperLogSchema.statics.getErrorAnalysis = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { startTime: { $gte: startDate }, status: { $ne: 'success' } } },
    { $unwind: '$errors' },
    {
      $group: {
        _id: {
          source: '$source',
          errorType: '$errors.type'
        },
        count: { $sum: 1 },
        recentErrors: {
          $push: {
            message: '$errors.message',
            timestamp: '$errors.timestamp'
          }
        }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        source: '$_id.source',
        errorType: '$_id.errorType',
        count: 1,
        recentErrors: { $slice: ['$recentErrors', 3] },
        _id: 0
      }
    }
  ]);
};

scraperLogSchema.statics.getDailyStats = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { startTime: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$startTime' },
          month: { $month: '$startTime' },
          day: { $dayOfMonth: '$startTime' }
        },
        totalRuns: { $sum: 1 },
        successfulRuns: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
        totalJobs: { $sum: '$jobsFound' },
        avgDuration: { $avg: '$duration' },
        totalErrors: { $sum: { $size: '$errors' } }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        totalRuns: 1,
        successRate: { $multiply: [{ $divide: ['$successfulRuns', '$totalRuns'] }, 100] },
        totalJobs: 1,
        avgDuration: { $round: ['$avgDuration', 0] },
        errorCount: 1,
        _id: 0
      }
    }
  ]);
};

scraperLogSchema.statics.getTopPerformers = function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$source',
        totalJobs: { $sum: '$jobsFound' },
        avgDuration: { $avg: '$duration' },
        successRate: { $avg: '$performance.successRate' },
        runCount: { $sum: 1 }
      }
    },
    { $match: { runCount: { $gte: 5 } } }, // Minimum 5 runs
    {
      $addFields: {
        performanceScore: {
          $add: [
            { $multiply: ['$successRate', 0.4] },
            { $multiply: [{ $divide: ['$totalJobs', '$runCount'] }, 0.3] },
            { $multiply: [{ $divide: [1000, '$avgDuration'] }, 0.3] }
          ]
        }
      }
    },
    { $sort: { performanceScore: -1 } },
    { $limit: limit },
    {
      $project: {
        source: '$_id',
        totalJobs: 1,
        avgJobsPerRun: { $round: [{ $divide: ['$totalJobs', '$runCount'] }, 1] },
        avgDuration: { $round: ['$avgDuration', 0] },
        successRate: { $round: ['$successRate', 2] },
        performanceScore: { $round: ['$performanceScore', 2] },
        _id: 0
      }
    }
  ]);
};

// Virtual for success rate
scraperLogSchema.virtual('successRate').get(function() {
  return this.jobsSaved > 0 ? (this.jobsSaved / this.jobsFound) * 100 : 0;
});

// Virtual for efficiency
scraperLogSchema.virtual('efficiency').get(function() {
  return this.duration > 0 ? (this.jobsSaved / (this.duration / 1000)) : 0; // jobs per second
});

// Pre-save middleware
scraperLogSchema.pre('save', function(next) {
  // Calculate performance metrics
  this.performance.successRate = this.jobsFound > 0 ? (this.jobsSaved / this.jobsFound) * 100 : 0;
  
  // Calculate quality scores
  this.quality.completenessScore = Math.min(100, (this.jobsSaved / Math.max(1, this.jobsFound)) * 100);
  this.quality.accuracyScore = this.performance.successRate;
  this.quality.freshnessScore = Math.min(100, (this.jobsSaved / Math.max(1, this.duration / 60000)) * 100); // jobs per minute
  
  next();
});

module.exports = mongoose.model('ScraperLog', scraperLogSchema);
