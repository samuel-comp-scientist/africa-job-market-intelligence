require('dotenv').config();
const JobScraperService = require('./services/scraper');
const mongoose = require('mongoose');

async function testScraper() {
  console.log('🔧 Testing Job Scraper Service...\n');

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return;
  }

  // Test the scraper
  try {
    const scraper = new JobScraperService();
    
    console.log('📊 Starting job scraping test...');
    console.log('🔍 Keywords: ["software developer", "data scientist"]');
    
    const jobs = await scraper.scrapeAllSources(['software developer', 'data scientist']);
    
    console.log(`\n✅ Scraping completed!`);
    console.log(`📈 Found ${jobs.length} African tech jobs`);
    
    if (jobs.length > 0) {
      console.log('\n📋 Sample jobs found:');
      jobs.slice(0, 3).forEach((job, index) => {
        console.log(`\n${index + 1}. ${job.jobTitle || job.title}`);
        console.log(`   🏢 ${job.company}`);
        console.log(`   📍 ${job.location || job.city}`);
        console.log(`   🌐 ${job.source}`);
        console.log(`   💰 ${job.salaryMin ? `$${job.salaryMin}-${job.salaryMax}` : 'Not specified'}`);
        console.log(`   🛠️  Skills: ${job.skills ? job.skills.slice(0, 3).join(', ') : 'N/A'}...`);
      });
    }
    
    // Test database queries
    console.log('\n🗄️  Testing database queries...');
    const Job = require('./models/Job');
    
    const totalJobs = await Job.countDocuments({ isActive: true });
    console.log(`📊 Total jobs in database: ${totalJobs}`);
    
    const topSkills = await Job.getTopSkills(5);
    console.log('\n🔝 Top 5 skills:');
    topSkills.forEach((skill, index) => {
      console.log(`${index + 1}. ${skill.skill} (${skill.count} jobs)`);
    });
    
    const jobsByCountry = await Job.getJobsByCountry();
    console.log('\n🌍 Jobs by country:');
    jobsByCountry.slice(0, 5).forEach((country, index) => {
      console.log(`${index + 1}. ${country._id}: ${country.count} jobs`);
    });
    
  } catch (error) {
    console.error('❌ Error during scraping test:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the test
testScraper();
