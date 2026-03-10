const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Create test users for all roles
 */
async function createTestUsers() {
  const testUsers = [
    {
      email: 'jobseeker@test.com',
      password: 'password123',
      userType: 'jobseeker',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        country: 'Nigeria',
        city: 'Lagos',
        bio: 'Looking for software engineering opportunities',
        skills: ['JavaScript', 'React', 'Node.js']
      }
    },
    {
      email: 'recruiter@test.com',
      password: 'password123',
      userType: 'recruiter',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        country: 'Kenya',
        city: 'Nairobi',
        bio: 'Tech recruiter looking for talent',
        company: 'TechCorp Kenya'
      }
    },
    {
      email: 'researcher@test.com',
      password: 'password123',
      userType: 'researcher',
      profile: {
        firstName: 'Dr. Robert',
        lastName: 'Johnson',
        country: 'South Africa',
        city: 'Johannesburg',
        bio: 'Researcher in African job market trends'
      }
    },
    {
      email: 'developer@test.com',
      password: 'password123',
      userType: 'developer',
      profile: {
        firstName: 'Mike',
        lastName: 'Wilson',
        country: 'Egypt',
        city: 'Cairo',
        bio: 'API developer building integrations'
      }
    },
    {
      email: 'admin2@test.com',
      password: 'password123',
      userType: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        country: 'Ghana',
        city: 'Accra',
        bio: 'Platform administrator'
      }
    }
  ];

  try {
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        // Create user
        const user = new User({
          ...userData,
          password: hashedPassword,
          verification: {
            emailVerified: true
          }
        });
        
        await user.save();
        console.log(`✅ Created test user: ${userData.email} (${userData.userType})`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.email} (${userData.userType})`);
      }
    }
    
    console.log('🎯 Test users ready for testing!');
    return testUsers;
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  }
}

module.exports = { createTestUsers };
