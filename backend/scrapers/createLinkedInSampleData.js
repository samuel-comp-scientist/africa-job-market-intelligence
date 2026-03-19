const mongoose = require('mongoose');
require('dotenv').config();

// Sample LinkedIn-style job data
const sampleJobs = [
  {
    jobTitle: 'Senior Software Engineer',
    company: 'Naspers',
    country: 'South Africa',
    city: 'Johannesburg',
    salaryMin: 900000,
    salaryMax: 1400000,
    currency: 'ZAR',
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker'],
    jobDescription: 'Senior Software Engineer position at Naspers. Lead development of scalable fintech solutions.',
    jobUrl: 'https://linkedin.com/jobs/view/senior-software-engineer-naspers',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '7+ years experience',
    educationRequired: 'Bachelor degree in Computer Science',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      linkedinId: 'linkedin_001',
      company: 'Naspers',
      scrapedAt: new Date()
    }
  },
  {
    jobTitle: 'Machine Learning Engineer',
    company: 'Absa Group',
    country: 'South Africa',
    city: 'Cape Town',
    salaryMin: 1000000,
    salaryMax: 1500000,
    currency: 'ZAR',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Data Science'],
    jobDescription: 'Machine Learning Engineer at Absa Group. Build and deploy ML models for financial services.',
    jobUrl: 'https://linkedin.com/jobs/view/machine-learning-engineer-absa-group',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years ML experience',
    educationRequired: 'Masters degree in Computer Science',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      linkedinId: 'linkedin_002',
      company: 'Absa Group',
      scrapedAt: new Date()
    }
  },
  {
    jobTitle: 'Frontend Developer',
    company: 'Andela',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 7000000,
    salaryMax: 10000000,
    currency: 'NGN',
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Redux'],
    jobDescription: 'Frontend Developer at Andela. Create amazing user interfaces for global clients.',
    jobUrl: 'https://linkedin.com/jobs/view/frontend-developer-andela',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years frontend experience',
    educationRequired: 'Bachelor degree',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      linkedinId: 'linkedin_003',
      company: 'Andela',
      scrapedAt: new Date()
    }
  },
  {
    jobTitle: 'DevOps Engineer',
    company: 'Safaricom',
    country: 'Kenya',
    city: 'Nairobi',
    salaryMin: 2000000,
    salaryMax: 3000000,
    currency: 'KES',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'CI/CD'],
    jobDescription: 'DevOps Engineer at Safaricom. Manage cloud infrastructure for M-Pesa services.',
    jobUrl: 'https://linkedin.com/jobs/view/devops-engineer-safaricom',
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years DevOps experience',
    educationRequired: 'Bachelor degree in IT',
    applicationDeadline: null,
    remote: false,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      linkedinId: 'linkedin_004',
      company: 'Safaricom',
      scrapedAt: new Date()
    }
  },
  {
    jobTitle: 'Product Manager',
    company: 'Flutterwave',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 8000000,
    salaryMax: 12000000,
    currency: 'NGN',
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Communication', 'Strategy'],
    jobDescription: 'Product Manager at Flutterwave. Lead product strategy for fintech solutions.',
    jobUrl: 'https://linkedin.com/jobs/view/product-manager-flutterwave',
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years product management',
    educationRequired: 'MBA preferred',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true,
    metadata: {
      linkedinId: 'linkedin_005',
      company: 'Flutterwave',
      scrapedAt: new Date()
    }
  }
];

async function createLinkedInSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Get Job model
    const Job = require('../models/Job');
    
    // Clear existing linkedin jobs
    await Job.deleteMany({ source: 'linkedin' });
    console.log('🗑️ Cleared existing LinkedIn jobs');

    // Insert sample jobs
    const result = await Job.insertMany(sampleJobs);
    console.log(`✅ Created ${result.length} sample LinkedIn jobs`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Closed MongoDB connection');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

createLinkedInSampleData();
