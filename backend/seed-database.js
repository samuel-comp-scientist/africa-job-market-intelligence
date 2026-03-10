const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Company = require('./models/Company');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Job.deleteMany({});
    await Company.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample companies
    const companies = [
      { name: 'Andela', country: 'Nigeria', industry: 'Technology', size: '1000+' },
      { name: 'Flutterwave', country: 'Nigeria', industry: 'Fintech', size: '501-1000' },
      { name: 'Jumia', country: 'Kenya', industry: 'E-commerce', size: '1000+' },
      { name: 'M-Pesa', country: 'Kenya', industry: 'Fintech', size: '501-1000' },
      { name: 'Naspers', country: 'South Africa', industry: 'Technology', size: '1000+' }
    ];

    const createdCompanies = await Company.insertMany(companies);
    console.log(`🏢 Created ${createdCompanies.length} companies`);

    // Create sample jobs
    const jobs = [];
    const jobTitles = [
      'Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'Data Scientist', 'DevOps Engineer', 'Product Manager', 'UX Designer',
      'Mobile Developer', 'Cloud Engineer', 'Machine Learning Engineer', 'QA Engineer'
    ];

    const locations = ['Lagos, Nigeria', 'Nairobi, Kenya', 'Johannesburg, South Africa', 'Cairo, Egypt', 'Accra, Ghana'];
    const countries = ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana'];
    const cities = ['Lagos', 'Nairobi', 'Johannesburg', 'Cairo', 'Accra'];
    const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];
    const experienceLevels = ['entry', 'mid', 'senior', 'lead'];

    for (let i = 0; i < 100; i++) {
      const company = createdCompanies[Math.floor(Math.random() * createdCompanies.length)];
      const locationIndex = Math.floor(Math.random() * locations.length);
      jobs.push({
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        company: company.name,
        country: countries[locationIndex],
        city: cities[locationIndex],
        jobDescription: `We are looking for a talented professional to join our team. This role offers competitive compensation and growth opportunities. The ideal candidate will have strong technical skills and be passionate about technology.`,
        jobUrl: `https://example.com/job/${i + 1}`,
        salaryMin: Math.floor(Math.random() * 50000) + 30000,
        salaryMax: Math.floor(Math.random() * 80000) + 60000,
        currency: 'USD',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'],
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        source: 'LinkedIn Jobs Scraper',
        isActive: true
      });
    }

    // Add some duplicates for testing
    jobs.push({
      jobTitle: 'Software Engineer',
      company: 'Andela',
      country: 'Nigeria',
      city: 'Lagos',
      jobDescription: 'Looking for a software engineer with React and Node.js experience.',
      jobUrl: 'https://example.com/job/duplicate1',
      salaryMin: 40000,
      salaryMax: 70000,
      currency: 'USD',
      skills: ['JavaScript', 'React', 'Node.js'],
      postedDate: new Date(),
      source: 'Indeed Jobs Scraper',
      isActive: true
    });

    jobs.push({
      jobTitle: 'Software Engineer',
      company: 'Andela',
      country: 'Nigeria',
      city: 'Lagos',
      jobDescription: 'Software engineer position available immediately.',
      jobUrl: 'https://example.com/job/duplicate2',
      salaryMin: 35000,
      salaryMax: 65000,
      currency: 'USD',
      skills: ['JavaScript', 'React'],
      postedDate: new Date(),
      source: 'Glassdoor Scraper',
      isActive: true
    });

    // Add some spam jobs for testing
    for (let i = 0; i < 5; i++) {
      jobs.push({
        jobTitle: 'TEST JOB PLEASE IGNORE',
        company: 'Test Company',
        country: 'Nigeria',
        city: 'Lagos',
        jobDescription: 'This is a test job posting.',
        jobUrl: `https://example.com/job/spam${i}`,
        salaryMin: 1000,
        salaryMax: 2000,
        currency: 'USD',
        skills: ['Testing'],
        postedDate: new Date(),
        source: 'Test Scraper',
        isActive: true
      });
    }

    // Add some jobs with missing data
    for (let i = 0; i < 3; i++) {
      jobs.push({
        jobTitle: 'Developer',
        company: 'Unknown Company',
        country: 'Nigeria',
        jobDescription: 'Job description missing.',
        jobUrl: `https://example.com/job/incomplete${i}`,
        postedDate: new Date(),
        source: 'CareerJet Scraper',
        isActive: true
      });
    }

    // Debug: Check if any jobs are missing country
    const jobsWithoutCountry = jobs.filter(job => !job.country);
    if (jobsWithoutCountry.length > 0) {
      console.log('❌ Jobs without country:', jobsWithoutCountry.map(j => ({ title: j.jobTitle, company: j.company })));
    }
    
    // Debug: Check all jobs before insertion
    console.log('📋 Sample of jobs to be inserted:');
    jobs.slice(0, 3).forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.jobTitle} at ${job.company} in ${job.country}`);
    });

    const createdJobs = await Job.insertMany(jobs);
    console.log(`💼 Created ${createdJobs.length} jobs`);

    // Create sample users of different types
    const sampleUsers = [
      {
        email: 'jobseeker1@example.com',
        password: 'password123',
        userType: 'jobseeker',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          bio: 'Software developer looking for opportunities',
          location: { country: 'Nigeria', city: 'Lagos' }
        },
        verification: { emailVerified: true },
        activity: { lastLogin: new Date(), loginCount: 25 },
        preferences: {
          notifications: { email: true, push: true, marketing: false },
          privacy: { profileVisibility: 'public', showEmail: false }
        }
      },
      {
        email: 'recruiter1@example.com',
        password: 'password123',
        userType: 'recruiter',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          displayName: 'Jane Smith',
          bio: 'HR manager at tech company',
          location: { country: 'Kenya', city: 'Nairobi' }
        },
        verification: { emailVerified: true },
        activity: { lastLogin: new Date(), loginCount: 45 },
        preferences: {
          notifications: { email: true, push: true, marketing: true },
          privacy: { profileVisibility: 'public', showEmail: true }
        }
      },
      {
        email: 'researcher1@example.com',
        password: 'password123',
        userType: 'researcher',
        profile: {
          firstName: 'Dr. Robert',
          lastName: 'Johnson',
          displayName: 'Dr. Robert Johnson',
          bio: 'Researcher in labor market trends',
          location: { country: 'South Africa', city: 'Johannesburg' }
        },
        verification: { emailVerified: true },
        activity: { lastLogin: new Date(), loginCount: 15 },
        preferences: {
          notifications: { email: true, push: false, marketing: false },
          privacy: { profileVisibility: 'public', showEmail: false }
        }
      },
      {
        email: 'developer1@example.com',
        password: 'password123',
        userType: 'developer',
        profile: {
          firstName: 'Mike',
          lastName: 'Wilson',
          displayName: 'Mike Wilson',
          bio: 'API developer and integrator',
          location: { country: 'Ghana', city: 'Accra' }
        },
        verification: { emailVerified: true },
        activity: { lastLogin: new Date(), loginCount: 8 },
        preferences: {
          notifications: { email: true, push: true, marketing: false },
          privacy: { profileVisibility: 'public', showEmail: false },
          apiAccess: true
        }
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} sample users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Companies: ${createdCompanies.length}`);
    console.log(`   - Jobs: ${createdJobs.length}`);
    console.log(`   - Users: ${createdUsers.length + 1} (including admin)`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
