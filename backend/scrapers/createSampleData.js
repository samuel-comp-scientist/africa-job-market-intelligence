const mongoose = require('mongoose');
require('dotenv').config();

// Sample job data for testing
const sampleJobs = [
  {
    jobTitle: 'Senior Software Engineer',
    company: 'Naspers',
    description: 'We are looking for a Senior Software Engineer to join our team in Johannesburg.',
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
    requirements: ['5+ years experience', 'Degree in Computer Science'],
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
    requirements: ['3+ years in data science', 'Python expertise'],
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
    requirements: ['3+ years experience', 'Full stack development'],
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
    skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development'],
    requirements: ['2+ years mobile development', 'React Native or Flutter'],
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
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis'],
    requirements: ['5+ years backend experience', 'Java expertise'],
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
  }
];

// Transform to match Job schema
const transformedJobs = sampleJobs.map(job => ({
  jobTitle: job.jobTitle,
  company: job.company,
  country: job.location.country,
  city: job.location.city,
  salaryMin: job.salary.min,
  salaryMax: job.salary.max,
  currency: job.salary.currency,
  skills: job.skills,
  jobDescription: job.description,
  jobUrl: job.applicationUrl,
  source: job.source,
  postedDate: job.postedDate,
  scrapedAt: new Date(),
  isActive: job.isActive,
  jobType: job.jobType,
  seniorityLevel: job.experienceLevel === 'senior' ? 'senior' : job.experienceLevel === 'mid' ? 'mid-level' : 'junior',
  experienceRequired: job.requirements.join(', '),
  educationRequired: 'Bachelor degree preferred'
}));

async function createSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Get Job model
    const Job = require('../models/Job');
    
    // Clear existing adzuna jobs
    await Job.deleteMany({ source: 'adzuna' });
    console.log('🗑️ Cleared existing Adzuna jobs');

    // Insert sample jobs
    const result = await Job.insertMany(transformedJobs);
    console.log(`✅ Created ${result.length} sample Adzuna jobs`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Closed MongoDB connection');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

createSampleData();
