require('dotenv').config();
const DataCleaner = require('./services/dataCleaner');
const mongoose = require('mongoose');

async function testDataCleaner() {
  console.log('🧪 Testing Data Cleaning Pipeline...\n');

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return;
  }

  // Test skill normalization
  console.log('🔧 Testing Skill Normalization:');
  const testSkills = [
    'js', 'javascript', 'JavaScript', 'node', 'nodejs', 'Node.js',
    'reactjs', 'react.js', 'React', 'python', 'Py', 'PYTHON',
    'aws', 'AWS', 'Amazon Web Services', 'docker', 'Docker',
    'git', 'Git', 'GitHub', 'ci/cd', 'CI/CD', 'cicd'
  ];

  const normalizedSkills = DataCleaner.cleanSkills(testSkills);
  console.log('Original:', testSkills);
  console.log('Normalized:', normalizedSkills);
  console.log('Unique skills:', normalizedSkills.length, '\n');

  // Test country normalization
  console.log('🌍 Testing Country Normalization:');
  const testLocations = [
    'Nairobi, Kenya', 'Lagos, Nigeria', 'Cape Town, South Africa',
    'Accra', 'Kigali, Rwanda', 'Nairobi', 'Lagos', 'Johannesburg',
    'Unknown Location', 'Remote - Kenya', 'Port Harcourt, Nigeria'
  ];

  testLocations.forEach(location => {
    const normalized = DataCleaner.normalizeCountry(location);
    console.log(`"${location}" → "${normalized}"`);
  });
  console.log();

  // Test salary normalization
  console.log('💰 Testing Salary Normalization:');
  const testSalaries = [
    '$50,000 - $80,000',
    'KSh 1,200,000 - 1,800,000',
    'R 300,000 - 450,000',
    'GHS 60,000 - 90,000',
    '£40,000 per year',
    '$30/hour',
    'KES 150,000 monthly',
    'Not specified',
    'Competitive'
  ];

  testSalaries.forEach(salary => {
    const normalized = DataCleaner.normalizeSalary(salary);
    console.log(`"${salary}" →`, normalized);
  });
  console.log();

  // Test data quality scoring
  console.log('📊 Testing Data Quality Scoring:');
  const testJobs = [
    {
      jobTitle: 'Senior Software Developer',
      company: 'Tech Corp',
      country: 'Nigeria',
      jobDescription: 'We are looking for a senior software developer with experience in React, Node.js, and cloud technologies.',
      skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
      salary: { min: 80000, max: 120000, currency: 'USD' },
      jobUrl: 'https://example.com/job1',
      postedDate: new Date(),
      jobType: 'full-time',
      seniorityLevel: 'senior'
    },
    {
      jobTitle: 'Dev',
      company: 'A',
      country: 'Unknown',
      jobDescription: 'Need dev',
      skills: [],
      salary: null,
      jobUrl: '',
      postedDate: null
    }
  ];

  testJobs.forEach((job, index) => {
    const score = DataCleaner.computeQualityScore(job);
    console.log(`Job ${index + 1} - Quality Score: ${score}/10`);
    if (score < 5) {
      console.log('  ⚠️  Low quality job - missing important fields');
    }
  });
  console.log();

  // Test job validation
  console.log('✅ Testing Job Validation:');
  const invalidJob = {
    jobTitle: 'A',
    company: '',
    jobDescription: 'Short',
    skills: [],
    country: 'Unknown'
  };

  const validation = DataCleaner.validateJob(invalidJob);
  console.log('Validation Result:', validation);
  console.log('Is Valid:', validation.isValid);
  console.log('Errors:', validation.errors);
  console.log('Warnings:', validation.warnings);
  console.log();

  // Test complete job cleaning
  console.log('🧹 Testing Complete Job Cleaning:');
  const dirtyJob = {
    title: '  senior js developer  ',
    company: '  techcorp africa  ',
    location: 'Nairobi, Kenya',
    salary: '$50,000 - $80,000',
    description: 'We are looking for a senior JavaScript developer with experience in React, Node.js, and AWS. Must know js, react, node, and cloud technologies.',
    skills: ['js', 'javascript', 'react', 'reactjs', 'node', 'nodejs', 'aws', 'AWS'],
    url: 'https://example.com/job',
    source: 'Test',
    postedDate: '2 days ago'
  };

  const cleanedJob = DataCleaner.cleanJob(dirtyJob);
  console.log('Original Job:', dirtyJob);
  console.log('Cleaned Job:', cleanedJob);
  console.log();

  // Test duplicate detection
  console.log('🔍 Testing Duplicate Detection:');
  const existingJobs = [
    { jobTitle: 'Senior JavaScript Developer', company: 'TechCorp Africa', country: 'Kenya' },
    { jobTitle: 'Senior JS Developer', company: 'Tech Corp', country: 'Kenya' }
  ];

  const potentialDuplicate = {
    jobTitle: 'Senior JavaScript Developer',
    company: 'TechCorp Africa',
    country: 'Kenya'
  };

  const isDuplicate = DataCleaner.isDuplicate(potentialDuplicate, existingJobs);
  console.log('Potential duplicate detected:', isDuplicate);
  console.log();

  // Close MongoDB connection
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed');
  console.log('\n✅ Data Cleaning Pipeline Test Complete!');
}

// Run the test
testDataCleaner();
