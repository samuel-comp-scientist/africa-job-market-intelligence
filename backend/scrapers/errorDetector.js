const ScraperLog = require('../models/ScraperLog');
const EventEmitter = require('events');

/**
 * Error Detection and Alerting System
 * Monitors scraper performance and detects anomalies
 */
class ErrorDetector extends EventEmitter {
  constructor() {
    super();
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.thresholds = {
      errorRate: 10, // 10% error rate threshold
      consecutiveFailures: 3, // 3 consecutive failures
      responseTime: 30000, // 30 seconds response time threshold
      dataQuality: 70, // 70% data quality threshold
      jobCountDrop: 50 // 50% drop in job count
    };
    this.lastRunStats = new Map();
    this.alertHistory = [];
  }

  /**
   * Start monitoring
   */
  startMonitoring(intervalMinutes = 5) {
    if (this.isMonitoring) {
      console.log('⚠️ Error monitoring already running');
      return;
    }

    this.isMonitoring = true;
    console.log(`🔍 Starting error detection monitoring (interval: ${intervalMinutes} minutes)`);

    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, intervalMinutes * 60 * 1000);

    // Perform initial check
    this.performHealthCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('⏹️ Error detection monitoring stopped');
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get recent logs
      const recentLogs = await ScraperLog.find({
        startTime: { $gte: oneHourAgo }
      }).sort({ startTime: -1 });

      // Get 24-hour logs for comparison
      const dailyLogs = await ScraperLog.find({
        startTime: { $gte: twentyFourHoursAgo }
      }).sort({ startTime: -1 });

      await this.checkErrorRates(recentLogs);
      await this.checkConsecutiveFailures(recentLogs);
      await this.checkResponseTimes(recentLogs);
      await this.checkDataQuality(recentLogs);
      await this.checkJobCountTrends(dailyLogs);
      await this.checkSystemHealth();

    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.emitAlert('system', 'Health check failed', error.message, 'critical');
    }
  }

  /**
   * Check error rates across sources
   */
  async checkErrorRates(logs) {
    const sourceStats = new Map();

    logs.forEach(log => {
      const source = log.source;
      if (!sourceStats.has(source)) {
        sourceStats.set(source, { total: 0, failed: 0 });
      }
      const stats = sourceStats.get(source);
      stats.total++;
      if (log.status !== 'success') {
        stats.failed++;
      }
    });

    for (const [source, stats] of sourceStats) {
      const errorRate = (stats.failed / stats.total) * 100;
      
      if (errorRate > this.thresholds.errorRate) {
        this.emitAlert(
          'error_rate',
          `High error rate detected for ${source}`,
          `Error rate: ${errorRate.toFixed(2)}% (threshold: ${this.thresholds.errorRate}%)`,
          'warning',
          { source, errorRate, threshold: this.thresholds.errorRate }
        );
      }
    }
  }

  /**
   * Check for consecutive failures
   */
  async checkConsecutiveFailures(logs) {
    const failureGroups = new Map();

    logs.forEach(log => {
      const source = log.source;
      if (log.status !== 'success') {
        if (!failureGroups.has(source)) {
          failureGroups.set(source, 0);
        }
        failureGroups.set(source, failureGroups.get(source) + 1);
      } else {
        failureGroups.set(source, 0);
      }
    });

    for (const [source, consecutiveFailures] of failureGroups) {
      if (consecutiveFailures >= this.thresholds.consecutiveFailures) {
        this.emitAlert(
          'consecutive_failures',
          `Consecutive failures detected for ${source}`,
          `${consecutiveFailures} consecutive failures (threshold: ${this.thresholds.consecutiveFailures})`,
          'critical',
          { source, consecutiveFailures }
        );
      }
    }
  }

  /**
   * Check response times
   */
  async checkResponseTimes(logs) {
    logs.forEach(log => {
      if (log.duration > this.thresholds.responseTime) {
        this.emitAlert(
          'response_time',
          `Slow response detected for ${log.source}`,
          `Response time: ${(log.duration / 1000).toFixed(2)}s (threshold: ${this.thresholds.responseTime / 1000}s)`,
          'warning',
          { source: log.source, duration: log.duration }
        );
      }
    });
  }

  /**
   * Check data quality scores
   */
  async checkDataQuality(logs) {
    logs.forEach(log => {
      if (log.performance && log.performance.dataQuality < this.thresholds.dataQuality) {
        this.emitAlert(
          'data_quality',
          `Low data quality detected for ${log.source}`,
          `Data quality: ${log.performance.dataQuality}% (threshold: ${this.thresholds.dataQuality}%)`,
          'warning',
          { source: log.source, quality: log.performance.dataQuality }
        );
      }
    });
  }

  /**
   * Check job count trends
   */
  async checkJobCountTrends(logs) {
    const sourceJobCounts = new Map();

    // Calculate job counts for recent period
    const recentPeriod = new Date(Date.now() - 2 * 60 * 60 * 1000); // Last 2 hours
    const previousPeriod = new Date(Date.now() - 4 * 60 * 60 * 1000); // 2-4 hours ago

    logs.forEach(log => {
      if (log.startTime >= recentPeriod) {
        const source = log.source;
        sourceJobCounts.set(source, (sourceJobCounts.get(source) || 0) + log.jobsSaved);
      }
    });

    // Compare with previous period (simplified - in production, you'd query DB for previous period)
    for (const [source, currentCount] of sourceJobCounts) {
      const previousCount = this.lastRunStats.get(source) || currentCount;
      
      if (previousCount > 0) {
        const dropPercentage = ((previousCount - currentCount) / previousCount) * 100;
        
        if (dropPercentage > this.thresholds.jobCountDrop) {
          this.emitAlert(
            'job_count_drop',
            `Significant job count drop for ${source}`,
              `Job count dropped by ${dropPercentage.toFixed(2)}% from ${previousCount} to ${currentCount}`,
            'warning',
            { source, previousCount, currentCount, dropPercentage }
          );
        }
      }
      
      this.lastRunStats.set(source, currentCount);
    }
  }

  /**
   * Check overall system health
   */
  async checkSystemHealth() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const totalRuns = await ScraperLog.countDocuments({
      startTime: { $gte: oneHourAgo }
    });

    const successfulRuns = await ScraperLog.countDocuments({
      startTime: { $gte: oneHourAgo },
      status: 'success'
    });

    const overallErrorRate = totalRuns > 0 ? ((totalRuns - successfulRuns) / totalRuns) * 100 : 0;

    if (totalRuns === 0) {
      this.emitAlert(
        'no_activity',
        'No scraper activity detected',
        'No scraper runs in the last hour',
        'critical'
      );
    } else if (overallErrorRate > this.thresholds.errorRate * 2) {
      this.emitAlert(
        'system_health',
        'System-wide high error rate',
        `Overall error rate: ${overallErrorRate.toFixed(2)}%`,
        'critical',
        { totalRuns, successfulRuns, errorRate: overallErrorRate }
      );
    }
  }

  /**
   * Emit alert with deduplication
   */
  emitAlert(type, title, message, severity = 'warning', metadata = {}) {
    const alertKey = `${type}_${metadata.source || 'global'}`;
    const now = Date.now();

    // Check if we've recently sent the same alert (avoid spam)
    const recentAlert = this.alertHistory.find(alert => 
      alert.key === alertKey && 
      (now - alert.timestamp) < 30 * 60 * 1000 // 30 minutes
    );

    if (recentAlert) {
      return; // Skip duplicate alert
    }

    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: alertKey,
      type,
      title,
      message,
      severity,
      metadata,
      timestamp: now,
      resolved: false
    };

    this.alertHistory.push(alert);
    
    // Keep only last 100 alerts in memory
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }

    console.log(`🚨 ALERT [${severity.toUpperCase()}] ${title}: ${message}`);
    
    // Emit event for real-time notifications
    this.emit('alert', alert);

    // Log to database for persistence
    this.logAlertToDatabase(alert);
  }

  /**
   * Log alert to database
   */
  async logAlertToDatabase(alert) {
    try {
      // In a real implementation, you might have an Alert model
      // For now, we'll just log it to console
      console.log(`📝 Alert logged: ${JSON.stringify(alert)}`);
    } catch (error) {
      console.error('Failed to log alert to database:', error);
    }
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit = 50, severity = null) {
    let alerts = [...this.alertHistory].reverse();
    
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }
    
    return alerts.slice(0, limit);
  }

  /**
   * Get alert statistics
   */
  getAlertStats(hours = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recentAlerts = this.alertHistory.filter(alert => alert.timestamp >= cutoff);

    const stats = {
      total: recentAlerts.length,
      bySeverity: {
        critical: 0,
        warning: 0,
        info: 0
      },
      byType: {},
      activeSources: new Set()
    };

    recentAlerts.forEach(alert => {
      stats.bySeverity[alert.severity]++;
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
      if (alert.metadata.source) {
        stats.activeSources.add(alert.metadata.source);
      }
    });

    stats.activeSources = Array.from(stats.activeSources);
    return stats;
  }

  /**
   * Update thresholds
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('📊 Error detection thresholds updated:', this.thresholds);
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return { ...this.thresholds };
  }
}

module.exports = new ErrorDetector();
