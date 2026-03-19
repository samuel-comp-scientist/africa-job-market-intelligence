const mongoose = require('mongoose');
require('dotenv').config();

// Sample Glassdoor-style job data
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
    experienceRequired: '5+ years experience',
    educationRequired: 'Bachelor degree preferred',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      glassdoorRating: 4.2,
      companySize: '10000+',
      industry: 'Internet',
      scrapedAt: new Date()
    }
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
    experienceRequired: '3+ years in data science',
    educationRequired: 'Masters degree preferred',
    applicationDeadline: null,
    remote: true,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      glassdoorRating: 4.0,
      companySize: '10000+',
      industry: 'Banking',
      scrapedAt: new Date()
    }
  },
  {
    jobTitle: 'Full Stack Developer',
    company: 'Andela',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 6500000,
    salaryMax: 9500000,
    currency: 'NGN',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
    jobDescription: 'Full Stack Developer at Andela, building global tech solutions.',
    jobUrl: 'https://www.glassdoor.com/job-listing/full-stack-developer-andela',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years experience',
    educationRequired: 'Bachelor degree',
    applicationDeadline: null,
    remote: true,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      glassdoorRating: 4.5,
      companySize: '1000-5000',
      industry: 'Information Technology',
      scrapedAt: new Date()
    }
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
    experienceRequired: '5+ years backend experience',
    educationRequired: 'Bachelor degree in Computer Science',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      glassdoorRating: 4.1,
      companySize: '10000+',
      industry: 'Telecommunications',
      scrapedAt: new Date()
    }
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
    experienceRequired: '2+ years mobile development',
    educationRequired: 'Bachelor degree',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      glassdoorRating: 4.3,
      companySize: '1000-5000',
      industry: 'Financial Services',
      scrapedAt: new Date()
    }
  }
];

async function createGlassdoorSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Get Job model
    const Job = require('../models/Job');
    
    // Clear existing glassdoor jobs
    await Job.deleteMany({ source: 'glassdoor' });
    console.log('🗑️ Cleared existing Glassdoor jobs');

    // Insert sample jobs
    const result = await Job.insertMany(sampleJobs);
    console.log(`✅ Created ${result.length} sample Glassdoor jobs`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Closed MongoDB connection');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

createGlassdoorSampleData();
