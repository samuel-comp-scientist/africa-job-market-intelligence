const mongoose = require('mongoose');
require('dotenv').config();

// Diverse sample job data with multiple job types and countries
const diverseJobs = [
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
    jobUrl: 'https://example.com/job1',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years experience',
    educationRequired: 'Bachelor degree preferred',
    applicationDeadline: null,
    remote: false,
    source: 'adzuna',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Frontend Developer',
    company: 'Absa Group',
    country: 'South Africa',
    city: 'Cape Town',
    salaryMin: 750000,
    salaryMax: 1100000,
    currency: 'ZAR',
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'],
    jobDescription: 'Frontend Developer at Absa Group, building user interfaces.',
    jobUrl: 'https://example.com/job2',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    jobType: 'contract',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years experience',
    educationRequired: 'Bachelor degree',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Data Science Intern',
    company: 'Andela',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 3000000,
    salaryMax: 4500000,
    currency: 'NGN',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    jobDescription: 'Data Science Intern at Andela, learning from experienced mentors.',
    jobUrl: 'https://example.com/job3',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    jobType: 'internship',
    seniorityLevel: 'junior',
    experienceRequired: '0-1 years experience',
    educationRequired: 'Current student',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'DevOps Engineer',
    company: 'Safaricom',
    country: 'Kenya',
    city: 'Nairobi',
    salaryMin: 1800000,
    salaryMax: 2800000,
    currency: 'KES',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Linux'],
    jobDescription: 'DevOps Engineer at Safaricom, managing cloud infrastructure.',
    jobUrl: 'https://example.com/job4',
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '4+ years DevOps experience',
    educationRequired: 'Bachelor degree in IT',
    applicationDeadline: null,
    remote: true,
    source: 'adzuna',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Mobile App Developer',
    company: 'Flutterwave',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 4000000,
    salaryMax: 6000000,
    currency: 'NGN',
    skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development'],
    jobDescription: 'Mobile App Developer at Flutterwave, building fintech apps.',
    jobUrl: 'https://example.com/job5',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    jobType: 'part-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '2+ years mobile development',
    educationRequired: 'Bachelor degree',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Backend Developer',
    company: 'MTN Group',
    country: 'South Africa',
    city: 'Johannesburg',
    salaryMin: 900000,
    salaryMax: 1400000,
    currency: 'ZAR',
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
    jobDescription: 'Backend Developer at MTN Group, building telecom services.',
    jobUrl: 'https://example.com/job6',
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    jobType: 'freelance',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years backend experience',
    educationRequired: 'Bachelor degree in Computer Science',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'UX Designer',
    company: 'Standard Bank',
    country: 'South Africa',
    city: 'Cape Town',
    salaryMin: 650000,
    salaryMax: 950000,
    currency: 'ZAR',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
    jobDescription: 'UX Designer at Standard Bank, improving banking app experiences.',
    jobUrl: 'https://example.com/job7',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    jobType: 'contract',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years UX design',
    educationRequired: 'Design degree preferred',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Cloud Architect',
    company: 'Ecobank',
    country: 'Togo',
    city: 'Lomé',
    salaryMin: 800000,
    salaryMax: 1200000,
    currency: 'XOF',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Cloud Architecture'],
    jobDescription: 'Cloud Architect at Ecobank, designing cloud infrastructure for Pan-African banking.',
    jobUrl: 'https://example.com/job8',
    postedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '7+ years cloud experience',
    educationRequired: 'Masters degree preferred',
    applicationDeadline: null,
    remote: true,
    source: 'adzuna',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Product Manager',
    company: 'Dangote Group',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 5500000,
    salaryMax: 8500000,
    currency: 'NGN',
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Strategy'],
    jobDescription: 'Product Manager at Dangote Group, managing product development for industrial conglomerate.',
    jobUrl: 'https://example.com/job9',
    postedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years product management',
    educationRequired: 'MBA preferred',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Cybersecurity Analyst',
    company: 'Guaranty Trust Bank',
    country: 'Nigeria',
    city: 'Lagos',
    salaryMin: 4800000,
    salaryMax: 7200000,
    currency: 'NGN',
    skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'SIEM', 'Risk Assessment'],
    jobDescription: 'Cybersecurity Analyst at GTBank, protecting banking infrastructure and customer data.',
    jobUrl: 'https://example.com/job10',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years cybersecurity',
    educationRequired: 'Security certifications preferred',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Machine Learning Engineer',
    company: 'First Bank of Nigeria',
    country: 'Nigeria',
    city: 'Abuja',
    salaryMin: 5200000,
    salaryMax: 7800000,
    currency: 'NGN',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
    jobDescription: 'Machine Learning Engineer at First Bank, developing AI models for financial services.',
    jobUrl: 'https://example.com/job11',
    postedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '4+ years ML experience',
    educationRequired: 'Masters degree in Computer Science',
    applicationDeadline: null,
    remote: true,
    source: 'adzuna',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Full Stack Developer',
    company: 'M-Pesa',
    country: 'Kenya',
    city: 'Nairobi',
    salaryMin: 1600000,
    salaryMax: 2400000,
    currency: 'KES',
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express'],
    jobDescription: 'Full Stack Developer at M-Pesa, building mobile money platforms.',
    jobUrl: 'https://example.com/job12',
    postedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '3+ years full stack experience',
    educationRequired: 'Bachelor degree in Computer Science',
    applicationDeadline: null,
    remote: false,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Data Analyst',
    company: 'Ghana Commercial Bank',
    country: 'Ghana',
    city: 'Accra',
    salaryMin: 120000,
    salaryMax: 180000,
    currency: 'GHS',
    skills: ['SQL', 'Excel', 'Data Analysis', 'Python', 'Tableau'],
    jobDescription: 'Data Analyst at Ghana Commercial Bank, analyzing business data and generating insights.',
    jobUrl: 'https://example.com/job13',
    postedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'mid-level',
    experienceRequired: '2+ years data analysis',
    educationRequired: 'Bachelor degree in Statistics or Economics',
    applicationDeadline: null,
    remote: true,
    source: 'linkedin',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'Blockchain Developer',
    company: 'Paxful',
    country: 'South Africa',
    city: 'Cape Town',
    salaryMin: 950000,
    salaryMax: 1450000,
    currency: 'ZAR',
    skills: ['Blockchain', 'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
    jobDescription: 'Blockchain Developer at Paxful, building cryptocurrency trading platforms.',
    jobUrl: 'https://example.com/job14',
    postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '3+ years blockchain development',
    educationRequired: 'Bachelor degree in Computer Science',
    applicationDeadline: null,
    remote: true,
    source: 'adzuna',
    scrapedAt: new Date(),
    isActive: true
  },
  {
    jobTitle: 'AI Research Scientist',
    company: 'Jumia',
    country: 'Kenya',
    city: 'Nairobi',
    salaryMin: 1400000,
    salaryMax: 2100000,
    currency: 'KES',
    skills: ['Python', 'Machine Learning', 'Research', 'Statistics', 'Academic Writing'],
    jobDescription: 'AI Research Scientist at Jumia, conducting cutting-edge AI research for African markets.',
    jobUrl: 'https://example.com/job15',
    postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    jobType: 'full-time',
    seniorityLevel: 'senior',
    experienceRequired: '5+ years research experience',
    educationRequired: 'PhD in Computer Science or related field',
    applicationDeadline: null,
    remote: true,
    source: 'glassdoor',
    scrapedAt: new Date(),
    isActive: true
  }
];

async function createDiverseSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Get Job model
    const Job = require('../models/Job');
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared all existing jobs');

    // Insert diverse sample jobs
    const result = await Job.insertMany(diverseJobs);
    console.log(`✅ Created ${result.length} diverse sample jobs`);
    
    // Log distribution
    console.log('📊 Job Distribution:');
    const jobTypes = {};
    const countries = {};
    diverseJobs.forEach(job => {
      jobTypes[job.jobType] = (jobTypes[job.jobType] || 0) + 1;
      countries[job.country] = (countries[job.country] || 0) + 1;
    });
    
    console.log('Job Types:', jobTypes);
    console.log('Countries:', countries);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Closed MongoDB connection');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

createDiverseSampleData();
