const cron = require('node-cron');
const scraperController = require('./scraperController');

/**
 * Scraper Scheduler - Automated scraping operations
 */
class ScraperScheduler {
  constructor() {
    this.isRunning = false;
    this.schedules = new Map();
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
      scheduled: false
    }));

    // Weekly full scraping on Sunday at 3 AM
    this.schedules.set('weekly', cron.schedule('0 3 * * 0', async () => {
      console.log('📅 Starting weekly full scraping...');
      await this.runWeeklyScraping();
    }, {
      scheduled: false
    }));

    // Hourly data quality check
    this.schedules.set('quality', cron.schedule('0 * * * *', async () => {
      console.log('🔍 Running hourly data quality check...');
      await this.runQualityCheck();
    }, {
      scheduled: false
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
      lastUpdate: new Date()
    };
  }
}

module.exports = new ScraperScheduler();
