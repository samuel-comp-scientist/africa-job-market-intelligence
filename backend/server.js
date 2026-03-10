const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const jobRoutes = require('./routes/jobs');
const skillRoutes = require('./routes/skills');
const salaryRoutes = require('./routes/salaries');
const trendRoutes = require('./routes/trends');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const userRoleRoutes = require('./routes/userRoles');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market')
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize default admin user
  await initializeDefaultAdmin();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Initialize default admin user
async function initializeDefaultAdmin() {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const adminEmail = 'efootballrwanda@gmail.com';
    const adminPassword = 'abamakabe';
    const adminFirstName = 'Musa';
    const adminLastName = 'Dev';
    
    // Check if admin already exists
    const existingAdmin = await User.findByEmail(adminEmail);
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists:', adminEmail);
      
      // Ensure it has admin role
      if (existingAdmin.userType !== 'admin') {
        existingAdmin.userType = 'admin';
        await existingAdmin.save();
        console.log('🔄 Updated user to admin role');
      }
      
      // Ensure email is verified
      if (!existingAdmin.verification.emailVerified) {
        existingAdmin.verification.emailVerified = true;
        await existingAdmin.save();
        console.log('✅ Admin email verified');
      }
      
      return;
    }
    
    // Create new admin user
    const newAdmin = new User({
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save hook
      userType: 'admin',
      profile: {
        firstName: adminFirstName,
        lastName: adminLastName,
        displayName: `${adminFirstName} ${adminLastName}`,
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
    
    await newAdmin.save();
    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', `${adminFirstName} ${adminLastName}`);
    console.log('🎭 Role: admin');
    
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoleRoutes);

// API documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'African Job Market Intelligence API',
      version: '1.0.0',
      description: 'API for analyzing tech job market trends across Africa',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 Authentication: http://localhost:${PORT}/api/auth`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
});

module.exports = app;
