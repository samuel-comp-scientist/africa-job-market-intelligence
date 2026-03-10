const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Skill = require('../models/Skill');
const SalaryAnalytics = require('../models/SalaryAnalytics');
const SkillTrends = require('../models/SkillTrends');
const Prediction = require('../models/Prediction');
const ScraperLog = require('../models/ScraperLog');

/**
 * Database Initialization Script
 * Creates the database and ensures all collections are properly indexed
 */
async function initializeDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Create collections and indexes
    console.log('📊 Creating collections and indexes...');
    
    // Drop existing collections to avoid index conflicts
    console.log('🗑️  Dropping existing collections...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database cleared');
    
    // Initialize each model to create collections
    await User.createIndexes();
    console.log('✅ Users collection initialized');
    
    await Job.createIndexes();
    console.log('✅ Jobs collection initialized');
    
    await Company.createIndexes();
    console.log('✅ Companies collection initialized');
    
    await Skill.createIndexes();
    console.log('✅ Skills collection initialized');
    
    await SalaryAnalytics.createIndexes();
    console.log('✅ SalaryAnalytics collection initialized');
    
    await SkillTrends.createIndexes();
    console.log('✅ SkillTrends collection initialized');
    
    await Prediction.createIndexes();
    console.log('✅ Predictions collection initialized');
    
    await ScraperLog.createIndexes();
    console.log('✅ ScraperLogs collection initialized');
    
    // Insert some initial data if collections are empty
    await insertInitialData();
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

/**
 * Insert initial sample data for testing
 */
async function insertInitialData() {
  try {
    console.log('📝 Inserting initial sample data...');
    
    // Check if we already have data
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const skillCount = await Skill.countDocuments();
    
    if (userCount > 0 || jobCount > 0 || skillCount > 0) {
      console.log('📊 Database already contains data, skipping sample data insertion');
      return;
    }
    
    // Sample skills
    const sampleSkills = [
      {
        name: 'javascript',
        category: 'Programming Languages',
        demand: {
          current: { count: 150, percentage: 15.5, trend: 'up' }
        },
        salary: { average: 75000, min: 45000, max: 120000, median: 72000 },
        growth: { monthly: 8.5, quarterly: 12.3, yearly: 25.6 },
        popularity: { score: 85.2, rank: 1 }
      },
      {
        name: 'python',
        category: 'Programming Languages',
        demand: {
          current: { count: 142, percentage: 14.7, trend: 'up' }
        },
        salary: { average: 82000, min: 50000, max: 140000, median: 78000 },
        growth: { monthly: 12.3, quarterly: 18.7, yearly: 32.1 },
        popularity: { score: 89.1, rank: 2 }
      },
      {
        name: 'react',
        category: 'Frontend',
        demand: {
          current: { count: 98, percentage: 10.1, trend: 'up' }
        },
        salary: { average: 78000, min: 48000, max: 130000, median: 75000 },
        growth: { monthly: 6.2, quarterly: 9.8, yearly: 18.4 },
        popularity: { score: 76.3, rank: 3 }
      },
      {
        name: 'aws',
        category: 'Cloud & DevOps',
        demand: {
          current: { count: 87, percentage: 9.0, trend: 'up' }
        },
        salary: { average: 95000, min: 60000, max: 150000, median: 92000 },
        growth: { monthly: 15.7, quarterly: 22.1, yearly: 41.3 },
        popularity: { score: 82.4, rank: 4 }
      },
      {
        name: 'node.js',
        category: 'Backend',
        demand: {
          current: { count: 76, percentage: 7.9, trend: 'stable' }
        },
        salary: { average: 73000, min: 45000, max: 120000, median: 70000 },
        growth: { monthly: 3.1, quarterly: 5.4, yearly: 12.7 },
        popularity: { score: 68.9, rank: 5 }
      }
    ];
    
    await Skill.insertMany(sampleSkills);
    console.log('✅ Sample skills inserted');
    
    // Sample companies
    const sampleCompanies = [
      {
        name: 'TechCorp Africa',
        industry: 'Information Technology',
        size: '201-500',
        headquarters: { country: 'Nigeria', city: 'Lagos' },
        jobCount: 25,
        activeJobs: 18,
        rating: { average: 4.2, count: 156 }
      },
      {
        name: 'Digital Solutions Ltd',
        industry: 'Software Development',
        size: '51-200',
        headquarters: { country: 'Kenya', city: 'Nairobi' },
        jobCount: 15,
        activeJobs: 12,
        rating: { average: 4.0, count: 89 }
      },
      {
        name: 'CloudTech Systems',
        industry: 'Cloud Computing',
        size: '51-200',
        headquarters: { country: 'South Africa', city: 'Johannesburg' },
        jobCount: 20,
        activeJobs: 16,
        rating: { average: 4.5, count: 203 }
      }
    ];
    
    await Company.insertMany(sampleCompanies);
    console.log('✅ Sample companies inserted');
    
    // Sample jobs
    const sampleJobs = [
      {
        jobTitle: 'Senior Full Stack Developer',
        company: 'TechCorp Africa',
        country: 'Nigeria',
        city: 'Lagos',
        salaryMin: 60000,
        salaryMax: 90000,
        currency: 'USD',
        skills: ['javascript', 'react', 'node.js', 'mongodb'],
        jobDescription: 'We are looking for an experienced full stack developer...',
        jobUrl: 'https://example.com/job/1',
        source: 'jobberman',
        postedDate: new Date('2024-01-15'),
        seniorityLevel: 'senior',
        jobType: 'full-time'
      },
      {
        jobTitle: 'Python Data Scientist',
        company: 'Digital Solutions Ltd',
        country: 'Kenya',
        city: 'Nairobi',
        salaryMin: 55000,
        salaryMax: 80000,
        currency: 'USD',
        skills: ['python', 'machine learning', 'pandas', 'numpy'],
        jobDescription: 'Join our data science team to build ML models...',
        jobUrl: 'https://example.com/job/2',
        source: 'careers24',
        postedDate: new Date('2024-01-18'),
        seniorityLevel: 'mid-level',
        jobType: 'full-time'
      },
      {
        jobTitle: 'AWS DevOps Engineer',
        company: 'CloudTech Systems',
        country: 'South Africa',
        city: 'Johannesburg',
        salaryMin: 70000,
        salaryMax: 100000,
        currency: 'USD',
        skills: ['aws', 'docker', 'kubernetes', 'terraform'],
        jobDescription: 'Looking for a DevOps engineer with AWS expertise...',
        jobUrl: 'https://example.com/job/3',
        source: 'ngcareers',
        postedDate: new Date('2024-01-20'),
        seniorityLevel: 'senior',
        jobType: 'full-time'
      }
    ];
    
    await Job.insertMany(sampleJobs);
    console.log('✅ Sample jobs inserted');
    
    // Sample salary analytics
    const sampleSalaryAnalytics = {
      period: 'monthly',
      date: new Date(),
      currency: 'USD',
      overall: {
        average: 75000,
        minimum: 35000,
        maximum: 150000,
        median: 72000,
        count: 245,
        standardDeviation: 25000
      },
      bySkill: [
        { skill: 'python', average: 82000, minimum: 50000, maximum: 140000, median: 78000, count: 42, growth: 12.3 },
        { skill: 'javascript', average: 75000, minimum: 45000, maximum: 120000, median: 72000, count: 38, growth: 8.5 },
        { skill: 'react', average: 78000, minimum: 48000, maximum: 130000, median: 75000, count: 28, growth: 6.2 }
      ],
      byCountry: [
        { country: 'Nigeria', average: 70000, minimum: 35000, maximum: 120000, median: 68000, count: 89, growth: 15.2 },
        { country: 'Kenya', average: 72000, minimum: 40000, maximum: 130000, median: 70000, count: 76, growth: 12.8 },
        { country: 'South Africa', average: 85000, minimum: 45000, maximum: 150000, median: 82000, count: 80, growth: 18.5 }
      ],
      percentiles: {
        p10: 45000,
        p25: 58000,
        p50: 72000,
        p75: 92000,
        p90: 115000
      },
      trends: {
        monthOverMonth: 3.2,
        quarterOverQuarter: 8.7,
        yearOverYear: 15.4
      },
      metadata: {
        totalJobsAnalyzed: 245,
        dataQuality: 87.5
      }
    };
    
    await SalaryAnalytics.create(sampleSalaryAnalytics);
    console.log('✅ Sample salary analytics inserted');
    
    // Sample user for testing
    const sampleUser = {
      email: 'demo@africanjobmarket.com',
      password: 'demo123456',
      userType: 'jobseeker',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        displayName: 'Demo User',
        bio: 'Demo user for testing the African Job Market Intelligence platform',
        location: {
          country: 'Nigeria',
          city: 'Lagos'
        }
      },
      jobseekerProfile: {
        careerLevel: 'mid-level',
        targetRoles: ['Full Stack Developer', 'Data Scientist'],
        currentSkills: [
          { name: 'javascript', level: 'advanced', yearsOfExperience: 3 },
          { name: 'python', level: 'intermediate', yearsOfExperience: 2 },
          { name: 'react', level: 'intermediate', yearsOfExperience: 1 }
        ],
        desiredSkills: [
          { name: 'machine learning', priority: 'high' },
          { name: 'aws', priority: 'medium' }
        ],
        salaryExpectation: {
          min: 60000,
          max: 90000,
          currency: 'USD'
        }
      },
      verification: {
        emailVerified: true
      },
      subscription: {
        plan: 'free',
        limits: {
          savedJobs: 50,
          savedSearches: 5,
          skillAnalysis: 10
        }
      }
    };
    
    await User.create(sampleUser);
    console.log('✅ Sample user created (demo@africanjobmarket.com / demo123456)');
    
    console.log('🎉 Sample data insertion completed!');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    // Don't throw here, as sample data insertion is not critical
  }
}

/**
 * Verify database connection and collections
 */
async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database setup...');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Available collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check indexes
    const userIndexes = await User.collection.getIndexes();
    console.log('🔑 User collection indexes:', Object.keys(userIndexes));
    
    console.log('✅ Database verification completed');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    throw error;
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🚀 Database is ready for use!');
      console.log('👤 Demo login: demo@africanjobmarket.com / demo123456');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = {
  initializeDatabase,
  verifyDatabase,
  insertInitialData
};
