const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Default admin credentials
const adminUser = {
  email: 'efootballrwanda@gmail.com',
  password: 'abamakabe',
  firstName: 'Musa',
  lastName: 'Dev',
  userType: 'admin'
};

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27067/african-job-market');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findByEmail(adminUser.email);
    if (existingAdmin) {
      console.log('🔄 Admin user already exists, updating credentials...');
      
      // Update the existing admin to ensure correct details
      existingAdmin.userType = adminUser.userType;
      existingAdmin.profile = {
        ...existingAdmin.profile,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        displayName: `${adminUser.firstName} ${adminUser.lastName}`,
        bio: 'Default system administrator'
      };
      existingAdmin.verification.emailVerified = true;
      
      // Only update password if it's different
      const isSamePassword = await bcrypt.compare(adminUser.password, existingAdmin.password);
      if (!isSamePassword) {
        existingAdmin.password = adminUser.password; // Will be hashed by pre-save hook
        console.log('🔑 Password updated');
      }
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      const newAdmin = new User({
        email: adminUser.email,
        password: adminUser.password, // Will be hashed by pre-save hook
        userType: adminUser.userType,
        profile: {
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          displayName: `${adminUser.firstName} ${adminUser.lastName}`,
          bio: 'Default system administrator',
          location: {
            country: 'Rwanda',
            city: 'Kigali'
          }
        },
        verification: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        },
        activity: {
          lastLogin: new Date(),
          loginCount: 0
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false
          }
        }
      });

      // Save admin user (password will be hashed automatically)
      await newAdmin.save();
      console.log('✅ Default admin user created successfully!');
    }

    // Get the admin user and display info
    const admin = await User.findByEmail(adminUser.email);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('👤 Name:', `${admin.profile.firstName} ${admin.profile.lastName}`);
    console.log('🎭 Role:', admin.userType);
    console.log('✅ Email Verified:', admin.verification.emailVerified);

    // Generate and display token
    const token = admin.generateAuthToken();
    console.log('🔐 Token (for testing):', token);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createDefaultAdmin();
