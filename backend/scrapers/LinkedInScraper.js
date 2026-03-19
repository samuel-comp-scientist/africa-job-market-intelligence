const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * LinkedIn Data API Scraper for African Job Market
 * Integrates with LinkedIn Data API to get company and job information
 */
class LinkedInScraper {
  constructor() {
    // RapidAPI Configuration
    this.rapidApiConfig = {
      key: '56159a32f8msh88ff05ce63794a0p150f59jsn51c9ba464269',
      linkedinDataHost: 'linkedin-data-api.p.rapidapi.com',
      jobsApiHost: 'jobs-api14.p.rapidapi.com'
    };

    // African companies to track
    this.africanCompanies = [
      { domain: 'naspers.com', name: 'Naspers', country: 'South Africa' },
      { domain: 'absa.co.za', name: 'Absa Group', country: 'South Africa' },
      { domain: 'safaricom.co.ke', name: 'Safaricom', country: 'Kenya' },
      { domain: 'm-pesa.com', name: 'M-Pesa', country: 'Kenya' },
      { domain: 'andela.com', name: 'Andela', country: 'Nigeria' },
      { domain: 'flutterwave.com', name: 'Flutterwave', country: 'Nigeria' },
      { domain: 'mtn.com', name: 'MTN Group', country: 'South Africa' },
      { domain: 'standardbank.co.za', name: 'Standard Bank', country: 'South Africa' },
      { domain: 'firstbanknigeria.com', name: 'First Bank of Nigeria', country: 'Nigeria' },
      { domain: 'gtbank.com', name: 'Guaranty Trust Bank', country: 'Nigeria' },
      { domain: 'ecobank.com', name: 'Ecobank', country: 'Togo' },
      { domain: 'dangote.com', name: 'Dangote Group', country: 'Nigeria' }
    ];

    // Tech job keywords for LinkedIn search
    this.techKeywords = [
      'software engineer', 'data scientist', 'product manager', 'devops engineer',
      'full stack developer', 'frontend developer', 'backend developer',
      'mobile developer', 'machine learning engineer', 'cloud architect',
      'cybersecurity analyst', 'qa engineer', 'technical lead', 'cto'
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
   * Start LinkedIn scraping process
   */
  async startScraping() {
    if (this.isRunning) {
      throw new Error('LinkedIn scraping is already running');
    }

    this.isRunning = true;
    this.stats = {
      totalJobs: 0,
      successful: 0,
      failed: 0,
      duplicates: 0
    };

    console.log('🚀 Starting LinkedIn API scraping for African companies...');

    try {
      const allJobs = [];

      // Scrape company information and jobs
      for (const company of this.africanCompanies) {
        console.log(`📍 Processing ${company.name} (${company.country})...`);
        
        const companyData = await this.getCompanyData(company.domain);
        if (companyData) {
          const jobs = await this.getCompanyJobs(company.name);
          
          for (const job of jobs) {
            const processedJob = await this.processJob(job, {
              source: 'linkedin',
              company: company.name,
              country: company.country,
              companyData: companyData
            });
            
            if (processedJob) {
              allJobs.push(processedJob);
              this.stats.successful++;
            }
          }
        }
        
        // Rate limiting
        await this.delay(1000);
      }

      console.log(`✅ LinkedIn scraping completed. Found ${allJobs.length} jobs`);
      return allJobs;

    } catch (error) {
      console.error('❌ LinkedIn scraping failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get company data from LinkedIn API
   */
  async getCompanyData(domain) {
    try {
      const options = {
        method: 'GET',
        url: `https://${this.rapidApiConfig.linkedinDataHost}/get-company-by-domain`,
        params: { domain },
        headers: {
          'x-rapidapi-key': this.rapidApiConfig.key,
          'x-rapidapi-host': this.rapidApiConfig.linkedinDataHost,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.request(options);
      
      if (response.data) {
        console.log(`📊 Retrieved data for ${domain}`);
        return response.data;
      }
      
      return null;

    } catch (error) {
      console.error(`Error fetching company data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get jobs for a specific company
   */
  async getCompanyJobs(companyName) {
    try {
      const options = {
        method: 'GET',
        url: `https://${this.rapidApiConfig.jobsApiHost}/v2/linkedin/organizations`,
        params: { query: companyName },
        headers: {
          'x-rapidapi-key': this.rapidApiConfig.key,
          'x-rapidapi-host': this.rapidApiConfig.jobsApiHost,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.request(options);
      
      if (response.data && response.data.data) {
        const jobs = response.data.data.filter(job => 
          this.isTechJob(job.title || '')
        );
        
        console.log(`💼 Found ${jobs.length} tech jobs for ${companyName}`);
        return jobs;
      }
      
      return [];

    } catch (error) {
      console.error(`Error fetching jobs for ${companyName}:`, error.message);
      return [];
    }
  }

  /**
   * Get salary data
   */
  async getSalaryData() {
    try {
      const options = {
        method: 'GET',
        url: `https://${this.rapidApiConfig.jobsApiHost}/v2/salary/range`,
        headers: {
          'x-rapidapi-key': this.rapidApiConfig.key,
          'x-rapidapi-host': this.rapidApiConfig.jobsApiHost,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.request(options);
      
      if (response.data) {
        console.log('💰 Retrieved salary data');
        return response.data;
      }
      
      return null;

    } catch (error) {
      console.error('Error fetching salary data:', error.message);
      return null;
    }
  }

  /**
   * Check if job is tech-related
   */
  isTechJob(title) {
    const lowerTitle = title.toLowerCase();
    return this.techKeywords.some(keyword => 
      lowerTitle.includes(keyword)
    );
  }

  /**
   * Process and normalize job data
   */
  async processJob(job, metadata) {
    try {
      // Extract and normalize data
      const jobData = {
        jobTitle: this.cleanText(job.title || ''),
        company: metadata.company,
        country: metadata.country,
        city: job.location || 'Remote',
        salaryMin: job.salaryMin || null,
        salaryMax: job.salaryMax || null,
        currency: job.currency || 'USD',
        skills: this.extractSkills(job.title + ' ' + (job.description || '')),
        jobDescription: this.cleanText(job.description || ''),
        jobUrl: job.link || job.url || '',
        source: metadata.source,
        postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
        scrapedAt: new Date(),
        isActive: true,
        jobType: this.determineJobType(job.employmentType || ''),
        seniorityLevel: this.determineSeniorityLevel(job.title || ''),
        experienceRequired: job.experience || '',
        educationRequired: job.education || '',
        applicationDeadline: job.deadline ? new Date(job.deadline) : null,
        remote: this.isRemoteJob(job.title + ' ' + (job.description || '')),
        metadata: {
          linkedinId: job.id,
          company: metadata.company,
          companyData: metadata.companyData,
          scrapedAt: new Date()
        }
      };

      // Validate required fields
      if (!jobData.jobTitle || !jobData.company) {
        console.warn('Skipping job - missing required fields');
        return null;
      }

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
   * Clean and normalize text
   */
  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Extract skills from job text
   */
  extractSkills(text) {
    const techSkills = [
      'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift',
      'Kotlin', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Spring',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL', 'NoSQL',
      'Machine Learning', 'AI', 'Data Science', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'DevOps', 'CI/CD', 'Linux', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices'
    ];

    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    techSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return [...new Set(foundSkills)]; // Remove duplicates
  }

  /**
   * Determine job type
   */
  determineJobType(employmentType) {
    const type = employmentType.toLowerCase();
    
    if (type.includes('full-time') || type.includes('permanent')) return 'full-time';
    if (type.includes('part-time')) return 'part-time';
    if (type.includes('contract') || type.includes('temporary')) return 'contract';
    if (type.includes('internship') || type.includes('intern')) return 'internship';
    if (type.includes('freelance')) return 'freelance';
    if (type.includes('remote')) return 'remote';
    
    return 'full-time'; // Default
  }

  /**
   * Determine seniority level
   */
  determineSeniorityLevel(title) {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('senior') || lowerTitle.includes('sr.') || lowerTitle.includes('lead') || lowerTitle.includes('principal')) {
      return 'senior';
    }
    if (lowerTitle.includes('junior') || lowerTitle.includes('jr.') || lowerTitle.includes('entry') || lowerTitle.includes('graduate')) {
      return 'junior';
    }
    if (lowerTitle.includes('mid') || lowerTitle.includes('intermediate')) {
      return 'mid-level';
    }
    if (lowerTitle.includes('lead') || lowerTitle.includes('principal')) {
      return 'lead';
    }
    if (lowerTitle.includes('architect')) {
      return 'architect';
    }
    if (lowerTitle.includes('manager') || lowerTitle.includes('head')) {
      return 'manager';
    }
    
    return 'mid-level'; // Default
  }

  /**
   * Check if job is remote
   */
  isRemoteJob(text) {
    const lowerText = text.toLowerCase();
    
    return lowerText.includes('remote') || 
           lowerText.includes('work from home') || 
           lowerText.includes('wfh') ||
           lowerText.includes('telecommute') ||
           lowerText.includes('virtual');
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
            source: 'linkedin',
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
    console.log('⏹️ LinkedIn scraping stopped');
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
        totalJobs: await Job.countDocuments({ source: 'linkedin' }),
        companies: await Company.countDocuments({ 'metadata.source': 'linkedin' }),
        avgSalary: await this.getAverageSalary(),
        topSkills: await this.getTopSkills(),
        jobTypes: await this.getJobTypeDistribution(),
        remoteJobs: await Job.countDocuments({ source: 'linkedin', remote: true })
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
        { $match: { source: 'linkedin', salaryMin: { $gt: 0 } } },
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
        { $match: { source: 'linkedin' } },
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
        { $match: { source: 'linkedin' } },
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

module.exports = LinkedInScraper;
