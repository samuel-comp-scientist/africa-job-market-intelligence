const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * Adzuna API Scraper for African Job Market
 * Integrates with Adzuna API to get real job listings with salary data
 */
class AdzunaScraper {
  constructor() {
    // Adzuna API Configuration
    this.apiConfig = {
      appId: '90570fb6',
      appKey: '9f58889cb86b85c956c489810815c9c1',
      baseUrl: 'https://api.adzuna.com/v1/api/jobs',
      version: 1
    };

    // African countries supported by Adzuna
    this.africanCountries = [
      { code: 'za', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'] },
      { code: 'ng', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt'] },
      { code: 'ke', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu'] },
      { code: 'gh', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Takoradi'] },
      { code: 'eg', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza'] },
      { code: 'ma', name: 'Morocco', cities: ['Casablanca', 'Rabat', 'Marrakech'] },
      { code: 'tn', name: 'Tunisia', cities: ['Tunis', 'Sfax', 'Sousse'] }
    ];

    // Tech job categories and keywords
    this.techCategories = [
      'it-jobs',
      'software-engineer-jobs',
      'developer-jobs',
      'data-science-jobs',
      'python-jobs',
      'javascript-jobs',
      'java-jobs',
      'web-development-jobs',
      'mobile-development-jobs',
      'devops-jobs',
      'cloud-jobs',
      'cyber-security-jobs',
      'ai-ml-jobs'
    ];

    // Common tech skills for filtering
    this.techSkills = [
      'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift',
      'Kotlin', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Spring',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL', 'NoSQL',
      'Machine Learning', 'AI', 'Data Science', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'DevOps', 'CI/CD', 'Linux', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices'
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
   * Start Adzuna scraping process
   */
  async startScraping() {
    if (this.isRunning) {
      throw new Error('Adzuna scraping is already running');
    }

    this.isRunning = true;
    this.stats = {
      totalJobs: 0,
      successful: 0,
      failed: 0,
      duplicates: 0
    };

    console.log('🚀 Starting Adzuna API scraping for African job market...');

    try {
      const allJobs = [];

      // Scrape each country
      for (const country of this.africanCountries) {
        console.log(`📍 Scraping ${country.name}...`);
        
        const countryJobs = await this.scrapeCountry(country);
        allJobs.push(...countryJobs);
        
        // Add delay to respect API rate limits
        await this.delay(1000);
      }

      console.log(`✅ Adzuna scraping completed. Found ${allJobs.length} jobs`);
      return allJobs;

    } catch (error) {
      console.error('❌ Adzuna scraping failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Scrape jobs for a specific country
   */
  async scrapeCountry(country) {
    const countryJobs = [];

    for (const category of this.techCategories.slice(0, 5)) { // Limit to 5 categories per country
      for (const city of country.cities.slice(0, 2)) { // Limit to 2 cities per country
        try {
          const jobs = await this.fetchJobsFromAPI(country.code, city, category);
          
          for (const job of jobs) {
            const processedJob = await this.processJob(job, {
              source: 'adzuna',
              country: country.name,
              city: city
            });
            
            if (processedJob) {
              countryJobs.push(processedJob);
              this.stats.successful++;
            }
          }

          // Rate limiting
          await this.delay(500);

        } catch (error) {
          console.error(`Error scraping ${country.name}, ${city}, ${category}:`, error.message);
          this.stats.failed++;
        }
      }
    }

    return countryJobs;
  }

  /**
   * Fetch jobs from Adzuna API
   */
  async fetchJobsFromAPI(countryCode, city, category) {
    // Adzuna API uses different URL structures
    let url;
    
    if (countryCode === 'za') {
      // South Africa has full API support
      url = `${this.apiConfig.baseUrl}/${countryCode}/${category}/${city}`;
    } else if (countryCode === 'ng') {
      // Nigeria - try different endpoint structure
      url = `${this.apiConfig.baseUrl}/${countryCode}/${category}`;
    } else {
      // For other countries, try generic endpoint
      url = `${this.apiConfig.baseUrl}/${countryCode}/${category}`;
    }
    
    const params = {
      app_id: this.apiConfig.appId,
      app_key: this.apiConfig.appKey,
      results_per_page: 50,
      content_type: 'application/json'
    };

    // Add city parameter if not already in URL
    if (!url.includes(`/${city}`) && city) {
      params.where = city;
    }

    try {
      console.log(`Fetching from: ${url}`);
      const response = await axios.get(url, { params, timeout: 10000 });
      
      if (response.data && response.data.results) {
        console.log(`Found ${response.data.results.length} jobs for ${countryCode}, ${city}, ${category}`);
        return response.data.results;
      }
      
      console.log(`No results found for ${countryCode}, ${city}, ${category}`);
      return [];

    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Endpoint not found for ${countryCode}, ${city}, ${category} - trying fallback`);
        
        // Try fallback search without city
        try {
          const fallbackParams = { ...params };
          delete fallbackParams.where;
          
          const fallbackResponse = await axios.get(url, { params: fallbackParams, timeout: 10000 });
          
          if (fallbackResponse.data && fallbackResponse.data.results) {
            console.log(`Fallback found ${fallbackResponse.data.results.length} jobs for ${countryCode}, ${category}`);
            return fallbackResponse.data.results;
          }
        } catch (fallbackError) {
          console.log(`Fallback also failed for ${countryCode}, ${category}`);
        }
      }
      
      if (error.response && error.response.status === 429) {
        console.log('Rate limit reached, waiting...');
        await this.delay(5000);
        return this.fetchJobsFromAPI(countryCode, city, category);
      }
      
      console.error(`API Error for ${countryCode}, ${city}, ${category}:`, error.message);
      return [];
    }
  }

  /**
   * Process and normalize job data
   */
  async processJob(job, metadata) {
    try {
      // Extract and normalize data
      const jobData = {
        jobTitle: this.cleanText(job.title || ''),
        company: this.cleanText(job.company?.display_name || ''),
        description: this.cleanText(job.description || ''),
        location: {
          country: metadata.country,
          city: metadata.city,
          address: job.location?.display_name || ''
        },
        salary: {
          min: job.salary_min || null,
          max: job.salary_max || null,
          currency: job.salary_currency || 'USD'
        },
        jobType: this.determineJobType(job.contract_type, job.contract_time),
        experienceLevel: this.determineExperienceLevel(job.title, job.description),
        skills: this.extractSkills(job.title + ' ' + job.description),
        requirements: this.extractRequirements(job.description),
        benefits: this.extractBenefits(job.description),
        applicationUrl: job.redirect_url || '',
        postedDate: new Date(job.created || Date.now()),
        expiryDate: job.expires ? new Date(job.expires) : null,
        isActive: true,
        source: metadata.source,
        sourceId: job.id || '',
        category: this.determineCategory(job.title, job.description),
        remote: this.isRemoteJob(job.title, job.description),
        metadata: {
          adzunaId: job.id,
          adzunaCategory: job.category?.label || '',
          adzunaContractType: job.contract_type || '',
          adzunaContractTime: job.contract_time || '',
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
        'location.country': jobData.location.country
      });

      if (existingJob) {
        this.stats.duplicates++;
        return null;
      }

      // Save to database
      const newJob = new Job(jobData);
      await newJob.save();

      // Create or update company
      await this.updateCompanyInfo(jobData.company, jobData.location.country);

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
   * Determine job type from contract information
   */
  determineJobType(contractType, contractTime) {
    const type = contractType?.toLowerCase() || '';
    const time = contractTime?.toLowerCase() || '';

    if (type.includes('permanent') || time.includes('permanent')) return 'full-time';
    if (type.includes('contract') || time.includes('contract')) return 'contract';
    if (type.includes('temporary') || time.includes('temporary')) return 'temporary';
    if (type.includes('internship') || time.includes('internship')) return 'internship';
    if (type.includes('part-time') || time.includes('part-time')) return 'part-time';
    
    return 'full-time'; // Default
  }

  /**
   * Determine experience level from job title and description
   */
  determineExperienceLevel(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('senior') || text.includes('sr.') || text.includes('lead') || text.includes('principal')) {
      return 'senior';
    }
    if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('graduate')) {
      return 'entry';
    }
    if (text.includes('mid') || text.includes('intermediate')) {
      return 'mid';
    }
    if (text.includes('intern') || text.includes('trainee')) {
      return 'internship';
    }
    
    return 'mid'; // Default
  }

  /**
   * Extract skills from job text
   */
  extractSkills(text) {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    this.techSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return [...new Set(foundSkills)]; // Remove duplicates
  }

  /**
   * Extract requirements from description
   */
  extractRequirements(description) {
    if (!description) return [];
    
    const requirements = [];
    const lines = description.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('requirement') || 
          line.toLowerCase().includes('qualification') ||
          line.toLowerCase().includes('skill')) {
        requirements.push(this.cleanText(line));
      }
    }
    
    return requirements.slice(0, 10); // Limit to 10 requirements
  }

  /**
   * Extract benefits from description
   */
  extractBenefits(description) {
    if (!description) return [];
    
    const benefits = [];
    const lowerText = description.toLowerCase();
    
    const benefitKeywords = ['health insurance', 'bonus', 'vacation', 'remote', 'flexible', 'training', 'pension'];
    
    benefitKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        benefits.push(keyword);
      }
    });
    
    return benefits;
  }

  /**
   * Determine job category
   */
  determineCategory(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('data science') || text.includes('machine learning') || text.includes('ai')) return 'Data Science';
    if (text.includes('frontend') || text.includes('react') || text.includes('vue') || text.includes('angular')) return 'Frontend';
    if (text.includes('backend') || text.includes('node') || text.includes('python') || text.includes('java')) return 'Backend';
    if (text.includes('mobile') || text.includes('ios') || text.includes('android')) return 'Mobile';
    if (text.includes('devops') || text.includes('cloud') || text.includes('aws') || text.includes('azure')) return 'DevOps';
    if (text.includes('security') || text.includes('cyber')) return 'Security';
    if (text.includes('qa') || text.includes('testing')) return 'QA/Testing';
    if (text.includes('design') || text.includes('ui') || text.includes('ux')) return 'Design';
    
    return 'General';
  }

  /**
   * Check if job is remote
   */
  isRemoteJob(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    return text.includes('remote') || 
           text.includes('work from home') || 
           text.includes('wfh') ||
           text.includes('telecommute');
  }

  /**
   * Update company information
   */
  async updateCompanyInfo(companyName, country) {
    try {
      const existingCompany = await Company.findOne({ name: companyName });
      
      if (!existingCompany) {
        const newCompany = new Company({
          name: companyName,
          country: country,
          isActive: true,
          metadata: {
            source: 'adzuna',
            createdAt: new Date()
          }
        });
        
        await newCompany.save();
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
      sourcesCount: this.africanCountries.length,
      countriesCount: this.africanCountries.length
    };
  }

  /**
   * Stop scraping
   */
  stopScraping() {
    this.isRunning = false;
    console.log('⏹️ Adzuna scraping stopped');
  }

  /**
   * Delay utility for rate limiting
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get salary trends by country
   */
  async getSalaryTrends(countryCode) {
    try {
      const jobs = await Job.find({
        'location.country': this.getCountryName(countryCode),
        'salary.min': { $gt: 0 }
      }).sort({ postedDate: -1 }).limit(100);

      const trends = jobs.reduce((acc, job) => {
        const month = new Date(job.postedDate).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = { count: 0, totalMin: 0, totalMax: 0 };
        }
        acc[month].count++;
        acc[month].totalMin += job.salary.min;
        acc[month].totalMax += job.salary.max;
        return acc;
      }, {});

      return Object.entries(trends).map(([month, data]) => ({
        month,
        avgMinSalary: Math.round(data.totalMin / data.count),
        avgMaxSalary: Math.round(data.totalMax / data.count),
        jobCount: data.count
      }));

    } catch (error) {
      console.error('Error getting salary trends:', error);
      return [];
    }
  }

  /**
   * Get country name from code
   */
  getCountryName(code) {
    const country = this.africanCountries.find(c => c.code === code);
    return country ? country.name : code;
  }

  /**
   * Get job market insights
   */
  async getMarketInsights() {
    try {
      const insights = {
        totalJobs: await Job.countDocuments({ source: 'adzuna' }),
        avgSalary: await this.getAverageSalary(),
        topSkills: await this.getTopSkills(),
        jobTypes: await this.getJobTypeDistribution(),
        remoteJobs: await Job.countDocuments({ source: 'adzuna', remote: true })
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
        { $match: { source: 'adzuna', 'salary.min': { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgMin: { $avg: '$salary.min' },
            avgMax: { $avg: '$salary.max' }
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
        { $match: { source: 'adzuna' } },
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
        { $match: { source: 'adzuna' } },
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

module.exports = AdzunaScraper;
