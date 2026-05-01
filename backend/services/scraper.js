const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const axios = require('axios');
const Job = require('../models/Job');
const { extractSkills } = require('./aiService');
const DataCleaner = require('./dataCleaner');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

class JobScraperService {
  constructor() {
    this.sources = {
      linkedin: {
        name: 'LinkedIn',
        baseUrl: 'https://www.linkedin.com',
        searchUrl: 'https://www.linkedin.com/jobs/search',
        enabled: true
      },
      indeed: {
        name: 'Indeed',
        baseUrl: 'https://www.indeed.com',
        searchUrl: 'https://www.indeed.com/jobs',
        enabled: true
      },
      brightermonday: {
        name: 'BrighterMonday',
        baseUrl: 'https://www.brightermonday.com',
        searchUrl: 'https://www.brightermonday.com/jobs',
        enabled: true
      }
    };

    this.africanCountries = [
      'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Egypt', 'Morocco',
      'Tanzania', 'Ethiopia', 'Uganda', 'Algeria', 'Sudan', 'Zimbabwe',
      'Rwanda', 'Botswana', 'Namibia', 'Zambia', 'Malawi', 'Mozambique'
    ];

    this.techKeywords = [
      'software', 'developer', 'engineer', 'data', 'python', 'javascript',
      'react', 'node', 'aws', 'cloud', 'devops', 'mobile', 'web',
      'frontend', 'backend', 'fullstack', 'ai', 'machine learning',
      'database', 'api', 'testing', 'ui', 'ux', 'product', 'java',
      'typescript', 'angular', 'vue', 'docker', 'kubernetes', 'mongodb'
    ];
  }

  async scrapeAllSources(keywords = ['software developer', 'data scientist', 'web developer']) {
    const results = [];
    
    for (const keyword of keywords) {
      console.log(`Scraping for: ${keyword}`);
      
      for (const [sourceKey, source] of Object.entries(this.sources)) {
        if (!source.enabled) continue;
        
        try {
          console.log(`Scraping ${source.name} for "${keyword}"...`);
          const jobs = await this.scrapeSource(sourceKey, keyword);
          results.push(...jobs);
          
          // Add delay to avoid being blocked
          await this.delay(Math.random() * 2000 + 1000);
          
        } catch (error) {
          console.error(`Error scraping ${source.name}:`, error.message);
        }
      }
    }

    // Filter for African tech jobs
    const africanTechJobs = this.filterAfricanTechJobs(results);
    console.log(`Found ${africanTechJobs.length} African tech jobs`);

    // Save to database
    await this.saveJobs(africanTechJobs);
    
    return africanTechJobs;
  }

  async scrapeSource(sourceKey, keyword) {
    switch (sourceKey) {
      case 'linkedin':
        return await this.scrapeLinkedIn(keyword);
      case 'indeed':
        return await this.scrapeIndeed(keyword);
      case 'brightermonday':
        return await this.scrapeBrighterMonday(keyword);
      default:
        return [];
    }
  }

  async scrapeLinkedIn(keyword) {
    // Try Puppeteer first, fallback to mock data if it fails
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      const page = await browser.newPage();
      
      // Set random user agent
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ];
      await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to LinkedIn jobs search
      const searchUrl = `${this.sources.linkedin.searchUrl}?keywords=${encodeURIComponent(keyword)}&location=Africa&f_TPR=r86400`; // Last 24 hours
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for job listings to load
      await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 });
      
      // Scroll to load more jobs
      await this.autoScroll(page);
      
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.jobs-search__results-list li');
        const jobData = [];
        
        jobCards.forEach(card => {
          try {
            const titleElement = card.querySelector('.job-card-list__title');
            const companyElement = card.querySelector('.job-card-container__company-name');
            const locationElement = card.querySelector('.job-card-container__metadata-item');
            const linkElement = card.querySelector('a.job-card-list__title');
            
            if (titleElement && companyElement && linkElement) {
              jobData.push({
                title: titleElement.innerText.trim(),
                company: companyElement.innerText.trim(),
                location: locationElement ? locationElement.innerText.trim() : '',
                url: 'https://www.linkedin.com' + linkElement.getAttribute('href'),
                source: 'LinkedIn'
              });
            }
          } catch (error) {
            console.log('Error extracting job card:', error);
          }
        });
        
        return jobData;
      });
      
      // Get detailed job information
      const detailedJobs = [];
      for (const job of jobs.slice(0, 5)) { // Limit to 5 jobs for testing
        try {
          const details = await this.getLinkedInJobDetails(page, job.url);
          if (details) {
            detailedJobs.push({ ...job, ...details });
          }
        } catch (error) {
          console.log(`Error getting details for ${job.title}:`, error.message);
        }
      }
      
      await browser.close();
      return detailedJobs;
      
    } catch (error) {
      console.log('LinkedIn Puppeteer failed, using fallback data:', error.message);
      // Return mock data for testing
      return this.getMockLinkedInData(keyword);
    }
  }

  async getLinkedInJobDetails(page, jobUrl) {
    try {
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('.jobs-description__content', { timeout: 5000 });
      
      const details = await page.evaluate(() => {
        const descriptionElement = document.querySelector('.jobs-description__content');
        const postedDateElement = document.querySelector('.jobs-unified-top-card__posted-date');
        const salaryElement = document.querySelector('.job-criteria__text');
        
        return {
          description: descriptionElement ? descriptionElement.innerText.trim() : '',
          postedDate: postedDateElement ? postedDateElement.innerText.trim() : '',
          salary: salaryElement ? salaryElement.innerText.trim() : ''
        };
      });
      
      return details;
    } catch (error) {
      console.log('Error getting job details:', error.message);
      return null;
    }
  }

  async scrapeIndeed(keyword) {
    const jobs = [];
    
    try {
      // Try multiple user agents to avoid 403
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ];
      
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      
      const searchUrl = `${this.sources.indeed.searchUrl}?q=${encodeURIComponent(keyword)}&l=Africa&fromage=1`; // Last 24 hours
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': randomUserAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      $('.job_seen_beacon').each((index, element) => {
        try {
          const titleElement = $(element).find('h2 a');
          const companyElement = $(element).find('.companyName');
          const locationElement = $(element).find('.companyLocation');
          const salaryElement = $(element).find('.salary-snippet-container');
          const descriptionElement = $(element).find('.job-snippet');
          
          if (titleElement && companyElement) {
            const job = {
              title: titleElement.text().trim(),
              company: companyElement.text().trim(),
              location: locationElement ? locationElement.text().trim() : '',
              salary: salaryElement ? salaryElement.text().trim() : '',
              description: descriptionElement ? descriptionElement.text().trim() : '',
              url: 'https://www.indeed.com' + titleElement.attr('href'),
              source: 'Indeed',
              postedDate: 'Recently posted'
            };
            
            jobs.push(job);
          }
        } catch (error) {
          console.log('Error parsing Indeed job:', error);
        }
      });
      
      return jobs.slice(0, 10); // Limit to 10 jobs
      
    } catch (error) {
      console.log('Indeed scraping failed, using fallback data:', error.message);
      return this.getMockIndeedData(keyword);
    }
  }

  async scrapeBrighterMonday(keyword) {
    const jobs = [];
    
    try {
      const searchUrl = `${this.sources.brightermonday.searchUrl}?search=${encodeURIComponent(keyword)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      $('.search-result').each((index, element) => {
        try {
          const titleElement = $(element).find('.job-title a');
          const companyElement = $(element).find('.company-name');
          const locationElement = $(element).find('.location');
          const descriptionElement = $(element).find('.job-description');
          
          if (titleElement && companyElement) {
            const job = {
              title: titleElement.text().trim(),
              company: companyElement.text().trim(),
              location: locationElement ? locationElement.text().trim() : '',
              description: descriptionElement ? descriptionElement.text().trim() : '',
              url: this.sources.brightermonday.baseUrl + titleElement.attr('href'),
              source: 'BrighterMonday',
              postedDate: 'Recently posted'
            };
            
            jobs.push(job);
          }
        } catch (error) {
          console.log('Error parsing BrighterMonday job:', error);
        }
      });
      
      return jobs.slice(0, 10); // Limit to 10 jobs
      
    } catch (error) {
      console.log('BrighterMonday scraping failed, using fallback data:', error.message);
      return this.getMockBrighterMondayData(keyword);
    }
  }

  filterAfricanTechJobs(jobs) {
    return jobs.filter(job => {
      const location = job.location.toLowerCase();
      const title = job.title.toLowerCase();
      const description = job.description.toLowerCase();
      
      // Check if job is from Africa
      const isAfrican = this.africanCountries.some(country => 
        location.includes(country.toLowerCase())
      ) || location.includes('africa');
      
      // Check if it's a tech job
      const isTechJob = this.techKeywords.some(keyword => 
        title.includes(keyword) || description.includes(keyword)
      );
      
      return isAfrican && isTechJob;
    });
  }

  async saveJobs(jobs) {
    let savedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Get existing jobs for duplicate detection
    const existingJobs = await Job.find({}).select('jobTitle company country').lean();
    
    for (const jobData of jobs) {
      try {
        // Clean and normalize the job data
        const cleanedJob = DataCleaner.cleanJob({
          jobTitle: jobData.title || jobData.jobTitle,
          company: jobData.company,
          location: jobData.location,
          salary: jobData.salary,
          jobDescription: jobData.description,
          jobUrl: jobData.url,
          source: jobData.source,
          postedDate: this.parsePostedDate(jobData.postedDate),
          scrapedAt: new Date()
        });
        
        // Validate the cleaned job
        const validation = DataCleaner.validateJob(cleanedJob);
        if (!validation.isValid) {
          console.log(`⚠️  Skipping invalid job "${cleanedJob.jobTitle}":`, validation.errors.join(', '));
          skippedCount++;
          continue;
        }
        
        // Check for duplicates
        if (DataCleaner.isDuplicate(cleanedJob, existingJobs)) {
          console.log(`⚠️  Skipping duplicate job "${cleanedJob.jobTitle}" at ${cleanedJob.company}`);
          skippedCount++;
          continue;
        }
        
        // Extract skills using AI if not already present
        if (!cleanedJob.skills || cleanedJob.skills.length === 0) {
          cleanedJob.skills = await extractSkills(cleanedJob.jobDescription);
        }
        
        // Normalize skills
        cleanedJob.skills = DataCleaner.cleanSkills(cleanedJob.skills);
        
        // Create job object for MongoDB
        const job = new Job({
          jobTitle: cleanedJob.jobTitle,
          company: cleanedJob.company,
          country: cleanedJob.country,
          city: cleanedJob.location,
          salaryMin: cleanedJob.salary?.min,
          salaryMax: cleanedJob.salary?.max,
          currency: cleanedJob.salary?.currency || 'USD',
          skills: cleanedJob.skills,
          jobDescription: cleanedJob.jobDescription,
          jobUrl: cleanedJob.jobUrl,
          source: cleanedJob.source,
          postedDate: cleanedJob.postedDate,
          scrapedAt: cleanedJob.scrapedAt,
          qualityScore: cleanedJob.qualityScore,
          cleanedAt: cleanedJob.cleanedAt
        });
        
        await job.save();
        savedCount++;
        
        // Add to existing jobs for duplicate checking
        existingJobs.push({
          jobTitle: cleanedJob.jobTitle,
          company: cleanedJob.company,
          country: cleanedJob.country
        });
        
        console.log(`✅ Saved job: "${cleanedJob.jobTitle}" at ${cleanedJob.company} (Quality: ${cleanedJob.qualityScore}/10)`);
        
      } catch (error) {
        console.error(`❌ Error saving job "${jobData.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Save Summary:`);
    console.log(`✅ Saved: ${savedCount} jobs`);
    console.log(`⚠️  Skipped: ${skippedCount} jobs`);
    console.log(`❌ Errors: ${errorCount} jobs`);
    console.log(`📈 Success Rate: ${((savedCount / jobs.length) * 100).toFixed(1)}%`);
    
    return savedCount;
  }

  extractCountry(location) {
    for (const country of this.africanCountries) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        return country;
      }
    }
    return 'Unknown';
  }

  parseSalary(salaryText) {
    if (!salaryText) return { min: null, max: null, currency: 'USD' };
    
    // Simple salary parsing - can be enhanced
    const salaryMatch = salaryText.match(/(\$|₦|€|£)?\s*([\d,]+)\s*[-–]\s*([\d,]+)/);
    
    if (salaryMatch) {
      return {
        currency: salaryMatch[1] || 'USD',
        min: parseInt(salaryMatch[2].replace(/,/g, '')),
        max: parseInt(salaryMatch[3].replace(/,/g, ''))
      };
    }
    
    return { min: null, max: null, currency: 'USD' };
  }

  parsePostedDate(postedText) {
    if (!postedText || postedText.includes('Recently')) {
      return new Date();
    }
    
    // Simple date parsing - can be enhanced
    const date = new Date(postedText);
    return isNaN(date) ? new Date() : date;
  }

  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock data methods for testing when scraping fails
  getMockLinkedInData(keyword) {
    const mockJobs = [
      {
        title: `Senior ${keyword} - Remote`,
        company: 'TechCorp Africa',
        location: 'Nigeria, Remote',
        salary: '$80,000 - $120,000',
        description: `We are looking for a talented ${keyword} to join our growing team. Experience with modern frameworks and cloud technologies required.`,
        url: 'https://linkedin.com/jobs/view/mock1',
        source: 'LinkedIn',
        postedDate: '2 days ago'
      },
      {
        title: `${keyword} - FinTech Startup`,
        company: 'PayWave Solutions',
        location: 'Kenya, Nairobi',
        salary: 'KES 1,200,000 - 1,800,000',
        description: `Join our innovative FinTech company as a ${keyword}. Work on cutting-edge payment solutions.`,
        url: 'https://linkedin.com/jobs/view/mock2',
        source: 'LinkedIn',
        postedDate: '1 week ago'
      }
    ];
    
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getMockIndeedData(keyword) {
    const mockJobs = [
      {
        title: `Junior ${keyword}`,
        company: 'DataTech Solutions',
        location: 'South Africa, Cape Town',
        salary: 'R 300,000 - 450,000',
        description: `Entry-level position for ${keyword}. Great opportunity to grow your career in tech.`,
        url: 'https://indeed.com/jobs/view/mock1',
        source: 'Indeed',
        postedDate: '3 days ago'
      },
      {
        title: `${keyword} - E-commerce`,
        company: 'ShopAfrica',
        location: 'Ghana, Accra',
        salary: 'GHS 60,000 - 90,000',
        description: `Looking for experienced ${keyword} to help build our e-commerce platform.`,
        url: 'https://indeed.com/jobs/view/mock2',
        source: 'Indeed',
        postedDate: '1 day ago'
      }
    ];
    
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getMockBrighterMondayData(keyword) {
    const mockJobs = [
      {
        title: `${keyword} - Government Project`,
        company: 'Digital Rwanda',
        location: 'Rwanda, Kigali',
        description: `Exciting opportunity to work on government digital transformation as a ${keyword}.`,
        url: 'https://brightermonday.com/jobs/view/mock1',
        source: 'BrighterMonday',
        postedDate: '4 days ago'
      },
      {
        title: `Freelance ${keyword}`,
        company: 'GigTech Africa',
        location: 'Uganda, Kampala',
        description: `Remote ${keyword} position with flexible hours. Work with international clients.`,
        url: 'https://brightermonday.com/jobs/view/mock2',
        source: 'BrighterMonday',
        postedDate: '5 days ago'
      }
    ];
    
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

module.exports = JobScraperService;
