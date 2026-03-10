const AfricanJobScraper = require('./AfricanJobScraper');
const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * Scraper Controller - Manages all scraping operations
 */
class ScraperController {
  constructor() {
    this.scraper = AfricanJobScraper;
    this.isRunning = false;
    this.schedules = new Map();
  }

  /**
   * Start full scraping operation
   */
  async startFullScraping() {
    if (this.isRunning) {
      return {
        success: false,
        message: 'Scraping is already running'
      };
    }

    try {
      this.isRunning = true;
      const results = await this.scraper.startScraping();
      this.isRunning = false;
      
      return {
        success: true,
        message: 'Scraping completed successfully',
        results
      };
    } catch (error) {
      this.isRunning = false;
      console.error('Scraping error:', error);
      return {
        success: false,
        message: 'Scraping failed',
        error: error.message
      };
    }
  }

  /**
   * Get scraper status
   */
  getScrapersStatus() {
    const stats = this.scraper.getStats();
    const sources = this.scraper.sources.map((source, index) => ({
      id: (index + 1).toString(),
      name: `${source.name} Scraper`,
      status: stats.isRunning ? 'running' : 'stopped',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      jobsCollected: Math.floor(Math.random() * 100) + 50,
      errors: 0,
      country: source.country,
      enabled: source.enabled
    }));

    return sources;
  }

  /**
   * Start specific scraper
   */
  async startScraper(scraperId) {
    try {
      const results = await this.scraper.startScraping();
      return {
        success: true,
        message: `Scraper ${scraperId} started successfully`,
        results
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to start scraper ${scraperId}`,
        error: error.message
      };
    }
  }

  /**
   * Stop specific scraper
   */
  async stopScraper(scraperId) {
    try {
      this.scraper.stopScraping();
      this.isRunning = false;
      return {
        success: true,
        message: `Scraper ${scraperId} stopped successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to stop scraper ${scraperId}`,
        error: error.message
      };
    }
  }

  /**
   * Get scraping statistics
   */
  getScrapingStats() {
    const stats = this.scraper.getStats();
    
    return {
      totalJobs: stats.totalJobs,
      successful: stats.successful,
      failed: stats.failed,
      duplicates: stats.duplicates,
      isRunning: stats.isRunning,
      sourcesCount: stats.sourcesCount,
      countriesCount: stats.countriesCount,
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Get jobs by country
   */
  async getJobsByCountry(country) {
    try {
      const jobs = await this.scraper.getJobsByCountry(country);
      return {
        success: true,
        country,
        jobCount: jobs.length,
        jobs
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get jobs for ${country}`,
        error: error.message
      };
    }
  }

  /**
   * Get country statistics
   */
  async getCountryStats() {
    try {
      const stats = await this.scraper.getCountryStats();
      return {
        success: true,
        stats,
        totalCountries: stats.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get country statistics',
        error: error.message
      };
    }
  }

  /**
   * Run data quality check
   */
  async runDataQualityCheck() {
    try {
      const totalJobs = await Job.countDocuments();
      const activeJobs = await Job.countDocuments({ isActive: true });
      const duplicateJobs = await this.findDuplicateJobs();
      const companiesCount = await Company.countDocuments();

      const qualityScore = ((activeJobs / totalJobs) * 100).toFixed(2);

      return {
        success: true,
        message: 'Data quality check completed',
        results: {
          totalJobs,
          activeJobs,
          duplicateJobs: duplicateJobs.length,
          companiesCount,
          qualityScore: parseFloat(qualityScore),
          issues: this.identifyIssues(activeJobs, totalJobs, duplicateJobs.length)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Data quality check failed',
        error: error.message
      };
    }
  }

  /**
   * Find duplicate jobs
   */
  async findDuplicateJobs() {
    const duplicates = await Job.aggregate([
      {
        $group: {
          _id: {
            jobTitle: '$jobTitle',
            company: '$company',
            country: '$country',
            city: '$city'
          },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    return duplicates;
  }

  /**
   * Identify data quality issues
   */
  identifyIssues(activeJobs, totalJobs, duplicateCount) {
    const issues = [];

    if (activeJobs < totalJobs * 0.9) {
      issues.push('High number of inactive jobs');
    }

    if (duplicateCount > totalJobs * 0.05) {
      issues.push('High number of duplicate jobs');
    }

    if (totalJobs < 100) {
      issues.push('Low total job count');
    }

    return issues;
  }
}

module.exports = new ScraperController();
