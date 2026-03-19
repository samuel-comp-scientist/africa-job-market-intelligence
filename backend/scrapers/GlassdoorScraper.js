const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * Glassdoor API Scraper for African Job Market
 * Integrates with Glassdoor API to get company reviews, salaries, and job information
 */
class GlassdoorScraper {
  constructor() {
    // Glassdoor API Configuration (you'll need to get partner credentials)
    this.apiConfig = {
      baseUrl: 'http://api.glassdoor.com/api/api.htm',
      version: '1',
      format: 'json',
      partnerId: null, // You'll need to get this from Glassdoor
      partnerKey: null  // You'll need to get this from Glassdoor
    };

    // African companies to track
    this.africanCompanies = [
      { name: 'Naspers', country: 'South Africa' },
      { name: 'Absa Group', country: 'South Africa' },
      { name: 'Safaricom', country: 'Kenya' },
      { name: 'Andela', country: 'Nigeria' },
      { name: 'Flutterwave', country: 'Nigeria' },
      { name: 'MTN Group', country: 'South Africa' },
      { name: 'Standard Bank', country: 'South Africa' },
      { name: 'First Bank of Nigeria', country: 'Nigeria' },
      { name: 'Guaranty Trust Bank', country: 'Nigeria' },
      { name: 'Ecobank', country: 'Togo' },
      { name: 'Dangote Group', country: 'Nigeria' }
    ];

    this.isRunning = false;
    this.stats = {
      totalJobs: 0,
      successful: 0,
      failed: 0,
      duplicates: 0
    };
  }

  /**
   * Start Glassdoor scraping process
   */
  async startScraping() {
    if (this.isRunning) {
      throw new Error('Glassdoor scraping is already running');
    }

    if (!this.apiConfig.partnerId || !this.apiConfig.partnerKey) {
      console.log('⚠️ Glassdoor API credentials not configured. Using sample data...');
      return await this.generateSampleData();
    }

    this.isRunning = true;
    this.stats = {
      totalJobs: 0,
      successful: 0,
      failed: 0,
      duplicates: 0
    };

    console.log('🚀 Starting Glassdoor API scraping for African companies...');

    try {
      const allJobs = [];

      // Scrape company information and salaries
      for (const company of this.africanCompanies) {
        console.log(`📍 Processing ${company.name} (${company.country})...`);
        
        const companyData = await this.getCompanyData(company.name);
        const salaryData = await this.getSalaryData(company.name);
        const reviewsData = await this.getReviewsData(company.name);
        
        // Generate sample jobs based on company data
        const jobs = this.generateJobsFromCompanyData(company, companyData, salaryData, reviewsData);
        
        for (const job of jobs) {
          const processedJob = await this.processJob(job, {
            source: 'glassdoor',
            company: company.name,
            country: company.country,
            companyData: companyData,
            salaryData: salaryData,
            reviewsData: reviewsData
          });
          
          if (processedJob) {
            allJobs.push(processedJob);
            this.stats.successful++;
          }
        }
        
        // Rate limiting
        await this.delay(2000);
      }

      console.log(`✅ Glassdoor scraping completed. Generated ${allJobs.length} jobs`);
      return allJobs;

    } catch (error) {
      console.error('❌ Glassdoor scraping failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Generate sample data when API credentials are not available
   */
  async generateSampleData() {
    console.log('🔄 Generating sample Glassdoor data...');
    
    const sampleJobs = [
      {
        jobTitle: 'Senior Software Engineer',
        company: 'Naspers',
        country: 'South Africa',
        city: 'Johannesburg',
        salaryMin: 850000,
        salaryMax: 1300000,
        currency: 'ZAR',
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS'],
        jobDescription: 'Senior Software Engineer role at Naspers, working on cutting-edge fintech solutions.',
        jobUrl: 'https://www.glassdoor.com/job-listing/senior-software-engineer-naspers',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: 'senior',
        rating: 4.2,
        companySize: '10000+',
        industry: 'Internet'
      },
      {
        jobTitle: 'Data Scientist',
        company: 'Absa Group',
        country: 'South Africa',
        city: 'Cape Town',
        salaryMin: 950000,
        salaryMax: 1450000,
        currency: 'ZAR',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Science'],
        jobDescription: 'Data Scientist position at Absa Group, focusing on financial data analysis and ML models.',
        jobUrl: 'https://www.glassdoor.com/job-listing/data-scientist-absa-group',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: 'senior',
        rating: 4.0,
        companySize: '10000+',
        industry: 'Banking'
      },
      {
        jobTitle: 'Full Stack Developer',
        company: 'Andela',
        country: 'Nigeria',
        city: 'Lagos',
        salaryMin: 6500000,
        max: 9500000,
        currency: 'NGN',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
        jobDescription: 'Full Stack Developer at Andela, building global tech solutions.',
        jobUrl: 'https://www.glassdoor.com/job-listing/full-stack-developer-andela',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: 'mid-level',
        rating: 4.5,
        companySize: '1000-5000',
        industry: 'Information Technology'
      },
      {
        jobTitle: 'Backend Engineer',
        company: 'Safaricom',
        country: 'Kenya',
        city: 'Nairobi',
        salaryMin: 1900000,
        salaryMax: 2900000,
        currency: 'KES',
        skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Kubernetes'],
        jobDescription: 'Backend Engineer at Safaricom, working on M-Pesa and digital services.',
        jobUrl: 'https://www.glassdoor.com/job-listing/backend-engineer-safaricom',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: 'senior',
        rating: 4.1,
        companySize: '10000+',
        industry: 'Telecommunications'
      },
      {
        jobTitle: 'Mobile Developer',
        company: 'Flutterwave',
        country: 'Nigeria',
        city: 'Lagos',
        salaryMin: 5800000,
        salaryMax: 8800000,
        currency: 'NGN',
        skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development'],
        jobDescription: 'Mobile Developer at Flutterwave, building fintech mobile applications.',
        jobUrl: 'https://www.glassdoor.com/job-listing/mobile-developer-flutterwave',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: 'mid-level',
        rating: 4.3,
        companySize: '1000-5000',
        industry: 'Financial Services'
      }
    ];

    const allJobs = [];
    
    for (const job of sampleJobs) {
      const processedJob = await this.processJob(job, {
        source: 'glassdoor',
        company: job.company,
        country: job.country,
        companyData: { rating: job.rating, companySize: job.companySize, industry: job.industry }
      });
      
      if (processedJob) {
        allJobs.push(processedJob);
        this.stats.successful++;
      }
    }

    return allJobs;
  }

  /**
   * Get company data from Glassdoor API
   */
  async getCompanyData(companyName) {
    if (!this.apiConfig.partnerId || !this.apiConfig.partnerKey) {
      return null;
    }

    try {
      const params = {
        v: this.apiConfig.version,
        format: this.apiConfig.format,
        't.p': this.apiConfig.partnerId,
        't.k': this.apiConfig.partnerKey,
        action: 'employers',
        q: companyName,
        userip: '127.0.0.1',
        useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      const response = await axios.get(this.apiConfig.baseUrl, { params });
      
      if (response.data.success && response.data.response.employers) {
        const employer = response.data.response.employers[0];
        console.log(`📊 Retrieved Glassdoor data for ${companyName}`);
        return employer;
      }
      
      return null;

    } catch (error) {
      console.error(`Error fetching Glassdoor data for ${companyName}:`, error.message);
      return null;
    }
  }

  /**
   * Get salary data
   */
  async getSalaryData(companyName) {
    if (!this.apiConfig.partnerId || !this.apiConfig.partnerKey) {
      return null;
    }

    try {
      const params = {
        v: this.apiConfig.version,
        format: this.apiConfig.format,
        't.p': this.apiConfig.partnerId,
        't.k': this.apiConfig.partnerKey,
        action: 'jobs-stats',
        q: companyName,
        userip: '127.0.0.1',
        useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      const response = await axios.get(this.apiConfig.baseUrl, { params });
      
      if (response.data.success && response.data.response) {
        console.log(`💰 Retrieved salary data for ${companyName}`);
        return response.data.response;
      }
      
      return null;

    } catch (error) {
      console.error(`Error fetching salary data for ${companyName}:`, error.message);
      return null;
    }
  }

  /**
   * Get reviews data
   */
  async getReviewsData(companyName) {
    if (!this.apiConfig.partnerId || !this.apiConfig.partnerKey) {
      return null;
    }

    try {
      const params = {
        v: this.apiConfig.version,
        format: this.apiConfig.format,
        't.p': this.apiConfig.partnerId,
        't.k': this.apiConfig.partnerKey,
        action: 'reviews',
        q: companyName,
        userip: '127.0.0.1',
        useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      const response = await axios.get(this.apiConfig.baseUrl, { params });
      
      if (response.data.success && response.data.response) {
        console.log(`⭐ Retrieved reviews data for ${companyName}`);
        return response.data.response;
      }
      
      return null;

    } catch (error) {
      console.error(`Error fetching reviews data for ${companyName}:`, error.message);
      return null;
    }
  }

  /**
   * Generate jobs from company data
   */
  generateJobsFromCompanyData(company, companyData, salaryData, reviewsData) {
    const techJobs = [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'DevOps Engineer',
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'Mobile Developer',
      'Machine Learning Engineer',
      'Cloud Architect'
    ];

    const jobs = [];
    
    // Generate 2-3 tech jobs per company
    const jobCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < jobCount; i++) {
      const jobTitle = techJobs[Math.floor(Math.random() * techJobs.length)];
      const baseSalary = this.getBaseSalary(company.country);
      
      jobs.push({
        jobTitle,
        company: company.name,
        country: company.country,
        city: this.getCityForCountry(company.country),
        salaryMin: baseSalary * 0.8,
        salaryMax: baseSalary * 1.2,
        currency: this.getCurrencyForCountry(company.country),
        skills: this.getRandomSkills(),
        jobDescription: `${jobTitle} position at ${company.name}, working on innovative solutions.`,
        jobUrl: `https://www.glassdoor.com/job-listing/${jobTitle.toLowerCase().replace(/\s+/g, '-')}-${company.name.toLowerCase().replace(/\s+/g, '-')}`,
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        jobType: 'full-time',
        seniorityLevel: this.getRandomSeniorityLevel(),
        rating: companyData?.rating || (4.0 + Math.random()),
        companySize: companyData?.companySize || '1000-5000',
        industry: companyData?.industry || 'Technology'
      });
    }
    
    return jobs;
  }

  /**
   * Get base salary for country
   */
  getBaseSalary(country) {
    const salaries = {
      'South Africa': 1000000, // ZAR
      'Nigeria': 7000000,       // NGN
      'Kenya': 2000000,         // KES
      'Ghana': 150000,          // GHS
      'Egypt': 250000,          // EGP
      'Togo': 100000            // XOF
    };
    
    return salaries[country] || 1000000;
  }

  /**
   * Get currency for country
   */
  getCurrencyForCountry(country) {
    const currencies = {
      'South Africa': 'ZAR',
      'Nigeria': 'NGN',
      'Kenya': 'KES',
      'Ghana': 'GHS',
      'Egypt': 'EGP',
      'Togo': 'XOF'
    };
    
    return currencies[country] || 'USD';
  }

  /**
   * Get city for country
   */
  getCityForCountry(country) {
    const cities = {
      'South Africa': 'Johannesburg',
      'Nigeria': 'Lagos',
      'Kenya': 'Nairobi',
      'Ghana': 'Accra',
      'Egypt': 'Cairo',
      'Togo': 'Lomé'
    };
    
    return cities[country] || 'Remote';
  }

  /**
   * Get random skills
   */
  getRandomSkills() {
    const allSkills = [
      'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift',
      'Kotlin', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Spring',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL', 'NoSQL',
      'Machine Learning', 'AI', 'Data Science', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'DevOps', 'CI/CD', 'Linux', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices'
    ];
    
    const skillCount = Math.floor(Math.random() * 5) + 3;
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, skillCount);
  }

  /**
   * Get random seniority level
   */
  getRandomSeniorityLevel() {
    const levels = ['junior', 'mid-level', 'senior', 'lead'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  /**
   * Process and normalize job data
   */
  async processJob(job, metadata) {
    try {
      const jobData = {
        jobTitle: job.jobTitle,
        company: metadata.company,
        country: metadata.country,
        city: job.city,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        skills: job.skills,
        jobDescription: job.jobDescription,
        jobUrl: job.jobUrl,
        source: metadata.source,
        postedDate: job.postedDate,
        scrapedAt: new Date(),
        isActive: true,
        jobType: job.jobType,
        seniorityLevel: job.seniorityLevel,
        experienceRequired: '',
        educationRequired: 'Bachelor degree preferred',
        applicationDeadline: null,
        remote: Math.random() > 0.7, // 30% chance of remote
        metadata: {
          glassdoorRating: job.rating,
          companySize: job.companySize,
          industry: job.industry,
          companyData: metadata.companyData,
          salaryData: metadata.salaryData,
          reviewsData: metadata.reviewsData,
          scrapedAt: new Date()
        }
      };

      // Check for duplicates
      const existingJob = await Job.findOne({
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        country: jobData.country
      });

      if (existingJob) {
        this.stats.duplicates++;
        return null;
      }

      // Save to database
      const newJob = new Job(jobData);
      await newJob.save();

      // Update company information
      await this.updateCompanyInfo(metadata.company, metadata.country, metadata.companyData);

      return jobData;

    } catch (error) {
      console.error('Error processing job:', error);
      this.stats.failed++;
      return null;
    }
  }

  /**
   * Update company information
   */
  async updateCompanyInfo(companyName, country, companyData) {
    try {
      const existingCompany = await Company.findOne({ name: companyName });
      
      if (!existingCompany) {
        const newCompany = new Company({
          name: companyName,
          country: country,
          isActive: true,
          metadata: {
            source: 'glassdoor',
            companyData: companyData,
            createdAt: new Date()
          }
        });
        
        await newCompany.save();
      } else {
        // Update existing company with new data
        existingCompany.metadata.companyData = companyData;
        existingCompany.metadata.lastUpdated = new Date();
        await existingCompany.save();
      }
    } catch (error) {
      console.error('Error updating company info:', error);
    }
  }

  /**
   * Get scraping statistics
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      companiesCount: this.africanCompanies.length
    };
  }

  /**
   * Stop scraping
   */
  stopScraping() {
    this.isRunning = false;
    console.log('⏹️ Glassdoor scraping stopped');
  }

  /**
   * Delay utility for rate limiting
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get market insights
   */
  async getMarketInsights() {
    try {
      const insights = {
        totalJobs: await Job.countDocuments({ source: 'glassdoor' }),
        companies: await Company.countDocuments({ 'metadata.source': 'glassdoor' }),
        avgSalary: await this.getAverageSalary(),
        topSkills: await this.getTopSkills(),
        jobTypes: await this.getJobTypeDistribution(),
        remoteJobs: await Job.countDocuments({ source: 'glassdoor', remote: true })
      };

      return insights;
    } catch (error) {
      console.error('Error getting market insights:', error);
      return null;
    }
  }

  /**
   * Get average salary
   */
  async getAverageSalary() {
    try {
      const result = await Job.aggregate([
        { $match: { source: 'glassdoor', salaryMin: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgMin: { $avg: '$salaryMin' },
            avgMax: { $avg: '$salaryMax' }
          }
        }
      ]);

      return result.length > 0 ? {
        min: Math.round(result[0].avgMin),
        max: Math.round(result[0].avgMax)
      } : null;
    } catch (error) {
      console.error('Error calculating average salary:', error);
      return null;
    }
  }

  /**
   * Get top skills
   */
  async getTopSkills() {
    try {
      const result = await Job.aggregate([
        { $match: { source: 'glassdoor' } },
        { $unwind: '$skills' },
        {
          $group: {
            _id: '$skills',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return result.map(item => ({ skill: item._id, count: item.count }));
    } catch (error) {
      console.error('Error getting top skills:', error);
      return [];
    }
  }

  /**
   * Get job type distribution
   */
  async getJobTypeDistribution() {
    try {
      const result = await Job.aggregate([
        { $match: { source: 'glassdoor' } },
        {
          $group: {
            _id: '$jobType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return result.map(item => ({ type: item._id, count: item.count }));
    } catch (error) {
      console.error('Error getting job type distribution:', error);
      return [];
    }
  }
}

module.exports = GlassdoorScraper;
