const cron = require('node-cron');
const scraperController = require('./scraperController');
const ScraperLog = require('../models/ScraperLog');

/**
 * Scraper Scheduler - Automated scraping operations
 */
class ScraperScheduler {
  constructor() {
    this.isRunning = false;
    this.schedules = new Map();
    this.customSchedules = new Map(); // For dynamically created schedules
    this.initSchedules();
  }

  /**
   * Initialize all scheduled tasks
   */
  initSchedules() {
    // Daily scraping at 2 AM
    this.schedules.set('daily', cron.schedule('0 2 * * *', async () => {
      console.log('🌙 Starting daily scraping...');
      await this.runDailyScraping();
    }, {
      scheduled: false,
      timezone: 'UTC'
    }));

    // Weekly full scraping on Sunday at 3 AM
    this.schedules.set('weekly', cron.schedule('0 3 * * 0', async () => {
      console.log('📅 Starting weekly full scraping...');
      await this.runWeeklyScraping();
    }, {
      scheduled: false,
      timezone: 'UTC'
    }));

    // Hourly data quality check
    this.schedules.set('quality', cron.schedule('0 * * * *', async () => {
      console.log('🔍 Running hourly data quality check...');
      await this.runQualityCheck();
    }, {
      scheduled: false,
      timezone: 'UTC'
    }));

    console.log('⏰ Scraper scheduler initialized');
  }

  /**
   * Start all schedules
   */
  startAllSchedules() {
    this.schedules.forEach((schedule, name) => {
      schedule.start();
      console.log(`✅ Started ${name} schedule`);
    });
  }

  /**
   * Stop all schedules
   */
  stopAllSchedules() {
    this.schedules.forEach((schedule, name) => {
      schedule.stop();
      console.log(`⏹️ Stopped ${name} schedule`);
    });
  }

  /**
   * Start specific schedule
   */
  startSchedule(scheduleName) {
    const schedule = this.schedules.get(scheduleName);
    if (schedule) {
      schedule.start();
      console.log(`✅ Started ${scheduleName} schedule`);
      return true;
    }
    return false;
  }

  /**
   * Stop specific schedule
   */
  stopSchedule(scheduleName) {
    const schedule = this.schedules.get(scheduleName);
    if (schedule) {
      schedule.stop();
      console.log(`⏹️ Stopped ${scheduleName} schedule`);
      return true;
    }
    return false;
  }

  /**
   * Get schedule status
   */
  getScheduleStatus() {
    const status = [];
    this.schedules.forEach((schedule, name) => {
      status.push({
        name,
        running: schedule.running,
        nextRun: this.getNextRunTime(name)
      });
    });
    return status;
  }

  /**
   * Run daily scraping
   */
  async runDailyScraping() {
    if (this.isRunning) {
      console.log('⚠️ Daily scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      // Only scrape top 3 sources for daily update
      const dailySources = ['1', '2', '3']; // LinkedIn, Jobberman, BrighterMonday
      
      for (const sourceId of dailySources) {
        console.log(`📡 Running daily scrape for source ${sourceId}...`);
        await scraperController.startScraper(sourceId);
        
        // Add delay between sources
        await this.delay(5000);
      }

      console.log('✅ Daily scraping completed');
    } catch (error) {
      console.error('❌ Daily scraping failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run weekly full scraping
   */
  async runWeeklyScraping() {
    if (this.isRunning) {
      console.log('⚠️ Weekly scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      console.log('🚀 Starting weekly full scraping operation...');
      const result = await scraperController.startFullScraping();
      
      if (result.success) {
        console.log(`✅ Weekly scraping completed: ${result.jobsProcessed} jobs processed`);
      } else {
        console.error('❌ Weekly scraping failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Weekly scraping failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run data quality check
   */
  async runQualityCheck() {
    try {
      const result = await scraperController.runDataQualityCheck();
      
      if (result.status === 'completed') {
        console.log('✅ Data quality check completed successfully');
      } else {
        console.error('❌ Data quality check failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Data quality check failed:', error);
    }
  }

  /**
   * Get next run time for schedule
   */
  getNextRunTime(scheduleName) {
    const now = new Date();
    
    switch (scheduleName) {
      case 'daily':
        const nextDaily = new Date(now);
        nextDaily.setDate(now.getDate() + 1);
        nextDaily.setHours(2, 0, 0, 0);
        return nextDaily;
        
      case 'weekly':
        const nextWeekly = new Date(now);
        const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
        nextWeekly.setDate(now.getDate() + daysUntilSunday);
        nextWeekly.setHours(3, 0, 0, 0);
        return nextWeekly;
        
      case 'quality':
        const nextHourly = new Date(now);
        nextHourly.setHours(now.getHours() + 1, 0, 0, 0);
        return nextHourly;
        
      default:
        return null;
    }
  }

  /**
   * Utility: delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get scheduler statistics
   */
  getSchedulerStats() {
    return {
      isRunning: this.isRunning,
      activeSchedules: Array.from(this.schedules.entries())
        .filter(([name, schedule]) => schedule.running)
        .map(([name]) => name),
      totalSchedules: this.schedules.size,
      customSchedules: this.customSchedules.size,
      lastUpdate: new Date()
    };
  }

  /**
   * Create a new custom schedule
   */
  createSchedule(config) {
    const {
      scraperId,
      frequency,
      time,
      timezone = 'UTC',
      enabled = true
    } = config;

    if (!scraperId || !frequency || !time) {
      return null;
    }

    // Generate cron expression based on frequency
    let cronExpression;
    switch (frequency) {
      case 'hourly':
        cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        break;
      case 'daily':
        cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        break;
      case 'weekly':
        cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} * * 0`;
        break;
      case 'monthly':
        cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} 1 * *`;
        break;
      default:
        return null;
    }

    const scheduleId = `custom_${scraperId}_${Date.now()}`;
    
    const schedule = cron.schedule(cronExpression, async () => {
      console.log(`🚀 Running custom schedule for scraper ${scraperId}...`);
      await this.runCustomScraping(scraperId, scheduleId);
    }, {
      scheduled: enabled,
      timezone
    });

    // Store schedule metadata
    this.customSchedules.set(scheduleId, {
      id: scheduleId,
      scraperId,
      frequency,
      time,
      timezone,
      enabled,
      cronExpression,
      schedule,
      createdAt: new Date(),
      lastRun: null,
      nextRun: this.getNextCustomRunTime(cronExpression, timezone)
    });

    console.log(`✅ Created custom schedule ${scheduleId} for scraper ${scraperId}`);
    return scheduleId;
  }

  /**
   * Toggle custom schedule enabled/disabled
   */
  toggleSchedule(scheduleId, enabled) {
    const scheduleData = this.customSchedules.get(scheduleId);
    if (!scheduleData) {
      return false;
    }

    try {
      if (enabled) {
        scheduleData.schedule.start();
        scheduleData.enabled = true;
        console.log(`✅ Enabled schedule ${scheduleId}`);
      } else {
        scheduleData.schedule.stop();
        scheduleData.enabled = false;
        console.log(`⏹️ Disabled schedule ${scheduleId}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to toggle schedule ${scheduleId}:`, error);
      return false;
    }
  }

  /**
   * Delete custom schedule
   */
  deleteSchedule(scheduleId) {
    const scheduleData = this.customSchedules.get(scheduleId);
    if (!scheduleData) {
      return false;
    }

    try {
      scheduleData.schedule.stop();
      scheduleData.schedule.destroy();
      this.customSchedules.delete(scheduleId);
      console.log(`🗑️ Deleted schedule ${scheduleId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete schedule ${scheduleId}:`, error);
      return false;
    }
  }

  /**
   * Get all schedules including custom ones
   */
  getAllSchedules() {
    const schedules = [];

    // Add default schedules
    this.schedules.forEach((schedule, name) => {
      schedules.push({
        id: name,
        scraperId: name,
        scraperName: `${name.charAt(0).toUpperCase() + name.slice(1)} Schedule`,
        frequency: name === 'quality' ? 'hourly' : name,
        nextRun: this.getNextRunTime(name),
        enabled: schedule.running,
        lastRun: null,
        timezone: 'UTC',
        isDefault: true
      });
    });

    // Add custom schedules
    this.customSchedules.forEach((scheduleData, id) => {
      schedules.push({
        id: scheduleData.id,
        scraperId: scheduleData.scraperId,
        scraperName: `Scraper ${scheduleData.scraperId}`,
        frequency: scheduleData.frequency,
        nextRun: scheduleData.nextRun,
        enabled: scheduleData.enabled,
        lastRun: scheduleData.lastRun,
        timezone: scheduleData.timezone,
        isDefault: false
      });
    });

    return schedules;
  }

  /**
   * Run custom scraping for specific scraper
   */
  async runCustomScraping(scraperId, scheduleId) {
    const startTime = new Date();
    let logData = {
      source: `scraper_${scraperId}`,
      url: 'custom_schedule',
      status: 'running',
      startTime,
      endTime: startTime,
      duration: 0,
      jobsFound: 0,
      jobsSaved: 0,
      errors: [],
      performance: {
        successRate: 0,
        requestsPerSecond: 0,
        dataQuality: 0
      },
      scheduledRun: true,
      runId: `custom_${scheduleId}_${Date.now()}`
    };

    try {
      const result = await scraperController.startScraper(scraperId);
      
      if (result.success) {
        logData.status = 'success';
        logData.jobsFound = result.results?.jobsFound || 0;
        logData.jobsSaved = result.results?.jobsSaved || 0;
        logData.performance.successRate = result.results?.successRate || 100;
      } else {
        logData.status = 'failed';
        logData.errors.push({
          type: 'scraping',
          message: result.message || 'Unknown error',
          timestamp: new Date()
        });
      }

      // Update schedule metadata
      const scheduleData = this.customSchedules.get(scheduleId);
      if (scheduleData) {
        scheduleData.lastRun = startTime;
        scheduleData.nextRun = this.getNextCustomRunTime(scheduleData.cronExpression, scheduleData.timezone);
      }

    } catch (error) {
      logData.status = 'failed';
      logData.errors.push({
        type: 'system',
        message: error.message,
        timestamp: new Date()
      });
      console.error(`Custom schedule ${scheduleId} failed:`, error);
    } finally {
      logData.endTime = new Date();
      logData.duration = logData.endTime - logData.startTime;
      
      // Save to database
      try {
        await ScraperLog.create(logData);
      } catch (logError) {
        console.error('Failed to save scraper log:', logError);
      }
    }
  }

  /**
   * Get next run time for custom schedule
   */
  getNextCustomRunTime(cronExpression, timezone = 'UTC') {
    // This is a simplified implementation
    // In production, you might want to use a library like 'cron-parser'
    const now = new Date();
    const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // Default to 1 hour later
    return nextRun;
  }

  /**
   * Get schedule status including custom schedules
   */
  getScheduleStatus() {
    return this.getAllSchedules();
  }
}

module.exports = new ScraperScheduler();
