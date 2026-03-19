const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * Generate sample Adzuna job data for testing visualizations
 */
async function generateSampleAdzunaData() {
  console.log('🔄 Generating sample Adzuna job data...');

  const sampleJobs = [
    // South Africa Jobs
    {
      jobTitle: 'Senior Software Engineer',
      company: 'Naspers',
      description: 'We are looking for a Senior Software Engineer to join our team in Johannesburg. You will work on cutting-edge fintech solutions.',
      location: {
        country: 'South Africa',
        city: 'Johannesburg',
        address: 'Johannesburg, Gauteng'
      },
      salary: {
        min: 800000,
        max: 1200000,
        currency: 'ZAR'
      },
      jobType: 'full-time',
      experienceLevel: 'senior',
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker'],
      requirements: ['5+ years experience', 'Degree in Computer Science', 'Experience with cloud platforms'],
      benefits: ['Health insurance', 'Bonus', 'Flexible working hours'],
      applicationUrl: 'https://adzuna.com/jobs/123',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_001',
      category: 'Backend',
      remote: false,
      metadata: {
        adzunaId: '123',
        adzunaCategory: 'it-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    {
      jobTitle: 'Data Scientist',
      company: 'Absa Group',
      description: 'Join our data science team to work on machine learning models for financial services.',
      location: {
        country: 'South Africa',
        city: 'Cape Town',
        address: 'Cape Town, Western Cape'
      },
      salary: {
        min: 900000,
        max: 1400000,
        currency: 'ZAR'
      },
      jobType: 'full-time',
      experienceLevel: 'senior',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'SQL', 'Data Science'],
      requirements: ['3+ years in data science', 'Python expertise', 'Machine learning experience'],
      benefits: ['Health insurance', 'Training budget', 'Remote work options'],
      applicationUrl: 'https://adzuna.com/jobs/124',
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_002',
      category: 'Data Science',
      remote: true,
      metadata: {
        adzunaId: '124',
        adzunaCategory: 'data-science-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    // Nigeria Jobs
    {
      jobTitle: 'Full Stack Developer',
      company: 'Andela',
      description: 'Looking for talented Full Stack Developers to join our global team.',
      location: {
        country: 'Nigeria',
        city: 'Lagos',
        address: 'Lagos, Nigeria'
      },
      salary: {
        min: 6000000,
        max: 9000000,
        currency: 'NGN'
      },
      jobType: 'full-time',
      experienceLevel: 'mid',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
      requirements: ['3+ years experience', 'Full stack development', 'React and Node.js'],
      benefits: ['Health insurance', 'Remote work', 'Learning opportunities'],
      applicationUrl: 'https://adzuna.com/jobs/125',
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_003',
      category: 'Full Stack',
      remote: true,
      metadata: {
        adzunaId: '125',
        adzunaCategory: 'developer-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    {
      jobTitle: 'Mobile App Developer',
      company: 'Flutterwave',
      description: 'Join our mobile team to build amazing fintech applications for African markets.',
      location: {
        country: 'Nigeria',
        city: 'Lagos',
        address: 'Lagos, Nigeria'
      },
      salary: {
        min: 5500000,
        max: 8500000,
        currency: 'NGN'
      },
      jobType: 'full-time',
      experienceLevel: 'mid',
      skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development', 'iOS', 'Android'],
      requirements: ['2+ years mobile development', 'React Native or Flutter', 'Portfolio required'],
      benefits: ['Stock options', 'Flexible hours', 'Remote work'],
      applicationUrl: 'https://adzuna.com/jobs/126',
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_004',
      category: 'Mobile',
      remote: false,
      metadata: {
        adzunaId: '126',
        adzunaCategory: 'mobile-development-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    // Kenya Jobs
    {
      jobTitle: 'Backend Engineer',
      company: 'Safaricom',
      description: 'Build scalable backend systems for M-Pesa and other digital services.',
      location: {
        country: 'Kenya',
        city: 'Nairobi',
        address: 'Nairobi, Kenya'
      },
      salary: {
        min: 1800000,
        max: 2800000,
        currency: 'KES'
      },
      jobType: 'full-time',
      experienceLevel: 'senior',
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka'],
      requirements: ['5+ years backend experience', 'Java expertise', 'Microservices architecture'],
      benefits: ['Health insurance', 'Pension', 'Performance bonus'],
      applicationUrl: 'https://adzuna.com/jobs/127',
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_005',
      category: 'Backend',
      remote: false,
      metadata: {
        adzunaId: '127',
        adzunaCategory: 'software-engineer-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    {
      jobTitle: 'DevOps Engineer',
      company: 'M-Pesa',
      description: 'Manage and optimize our cloud infrastructure for payment systems.',
      location: {
        country: 'Kenya',
        city: 'Nairobi',
        address: 'Nairobi, Kenya'
      },
      salary: {
        min: 1600000,
        max: 2400000,
        currency: 'KES'
      },
      jobType: 'full-time',
      experienceLevel: 'mid',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
      requirements: ['3+ years DevOps experience', 'Cloud platforms', 'CI/CD pipelines'],
      benefits: ['Training budget', 'Remote options', 'Health cover'],
      applicationUrl: 'https://adzuna.com/jobs/128',
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_006',
      category: 'DevOps',
      remote: true,
      metadata: {
        adzunaId: '128',
        adzunaCategory: 'devops-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    // Ghana Jobs
    {
      jobTitle: 'Frontend Developer',
      company: 'MTN Ghana',
      description: 'Create amazing user interfaces for our digital products and services.',
      location: {
        country: 'Ghana',
        city: 'Accra',
        address: 'Accra, Ghana'
      },
      salary: {
        min: 120000,
        max: 180000,
        currency: 'GHS'
      },
      jobType: 'full-time',
      experienceLevel: 'mid',
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML', 'Redux'],
      requirements: ['3+ years frontend experience', 'React expertise', 'Modern CSS'],
      benefits: ['Health insurance', 'Remote work', 'Training'],
      applicationUrl: 'https://adzuna.com/jobs/129',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_007',
      category: 'Frontend',
      remote: true,
      metadata: {
        adzunaId: '129',
        adzunaCategory: 'web-development-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    },
    // Egypt Jobs
    {
      jobTitle: 'Python Developer',
      company: 'Vezeeta',
      description: 'Join our engineering team to build healthcare technology solutions.',
      location: {
        country: 'Egypt',
        city: 'Cairo',
        address: 'Cairo, Egypt'
      },
      salary: {
        min: 180000,
        max: 300000,
        currency: 'EGP'
      },
      jobType: 'full-time',
      experienceLevel: 'mid',
      skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API', 'Git'],
      requirements: ['3+ years Python experience', 'Django/Flask', 'Database knowledge'],
      benefits: ['Health insurance', 'Remote options', 'Stock options'],
      applicationUrl: 'https://adzuna.com/jobs/130',
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      isActive: true,
      source: 'adzuna',
      sourceId: 'adzuna_008',
      category: 'Backend',
      remote: false,
      metadata: {
        adzunaId: '130',
        adzunaCategory: 'python-jobs',
        adzunaContractType: 'permanent',
        adzunaContractTime: 'full_time',
        scrapedAt: new Date()
      }
    }
  ];

  try {
    let savedCount = 0;
    
    for (const jobData of sampleJobs) {
      // Check if job already exists
      const existingJob = await Job.findOne({
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        'location.country': jobData.location.country
      });

      if (!existingJob) {
        const newJob = new Job(jobData);
        await newJob.save();
        savedCount++;

        // Create or update company
        await Company.findOneAndUpdate(
          { name: jobData.company },
          {
            name: jobData.company,
            country: jobData.location.country,
            isActive: true,
            metadata: {
              source: 'adzuna',
              createdAt: new Date()
            }
          },
          { upsert: true }
        );
      }
    }

    console.log(`✅ Generated ${savedCount} sample Adzuna jobs`);
    return savedCount;

  } catch (error) {
    console.error('❌ Error generating sample data:', error);
    return 0;
  }
}

module.exports = generateSampleAdzunaData;
