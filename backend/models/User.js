const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema - User authentication and profiles
 */
const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    required: true,
    enum: ['jobseeker', 'recruiter', 'researcher', 'developer', 'admin'],
    default: 'jobseeker',
    index: true
  },
  
  // Profile information
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    avatar: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    location: {
      country: { type: String, trim: true },
      city: { type: String, trim: true },
      timezone: { type: String, trim: true }
    },
    contact: {
      phone: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      twitter: { type: String, trim: true }
    }
  },
  
  // Job seeker specific fields
  jobseekerProfile: {
    careerLevel: {
      type: String,
      enum: ['student', 'entry-level', 'mid-level', 'senior', 'lead', 'executive'],
      default: 'entry-level'
    },
    targetRoles: [{
      type: String,
      trim: true
    }],
    currentSkills: [{
      name: { type: String, required: true },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      },
      yearsOfExperience: { type: Number, default: 0 },
      lastUsed: { type: Date }
    }],
    desiredSkills: [{
      name: { type: String, required: true },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      targetDate: { type: Date }
    }],
    education: [{
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      field: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false }
    }],
    experience: [{
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String, maxlength: 1000 },
      skills: [String]
    }],
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date },
      credentialId: { type: String },
      credentialUrl: { type: String }
    }],
    salaryExpectation: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
      negotiable: { type: Boolean, default: true }
    },
    jobPreferences: {
      remoteOnly: { type: Boolean, default: false },
      willingToRelocate: { type: Boolean, default: false },
      preferredCountries: [String],
      employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
        default: 'full-time'
      }
    }
  },
  
  // Employer specific fields (for future use)
  employerProfile: {
    companyName: { type: String, trim: true },
    industry: { type: String, trim: true },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    website: { type: String, trim: true },
    description: { type: String, maxlength: 1000 }
  },
  
  // Preferences and settings
  preferences: {
    emailNotifications: {
      jobAlerts: { type: Boolean, default: true },
      skillUpdates: { type: Boolean, default: true },
      salaryReports: { type: Boolean, default: true },
      marketInsights: { type: Boolean, default: true }
    },
    dashboard: {
      defaultView: {
        type: String,
        enum: ['insights', 'jobs', 'skills', 'salary'],
        default: 'insights'
      },
      favoriteSkills: [String],
      savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
      savedSearches: [{
        name: { type: String, required: true },
        query: { type: mongoose.Schema.Types.Mixed, required: true },
        created: { type: Date, default: Date.now },
        lastUsed: { type: Date }
      }]
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: false },
      allowRecruiters: { type: Boolean, default: true }
    }
  },
  
  // Activity tracking
  activity: {
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    skillsUpdated: { type: Date },
    jobApplications: { type: Number, default: 0 }
  },
  
  // Subscription and limits
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    features: [String],
    limits: {
      savedJobs: { type: Number, default: 50 },
      savedSearches: { type: Number, default: 5 },
      skillAnalysis: { type: Number, default: 10 }
    }
  },
  
  // Verification and status
  verification: {
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastPasswordReset: { type: Date }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isSuspended: {
    type: Boolean,
    default: false
  },
  
  suspensionReason: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes
userSchema.index({ 'profile.location.country': 1 });
userSchema.index({ 'jobseekerProfile.careerLevel': 1 });
userSchema.index({ 'jobseekerProfile.currentSkills.name': 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ isActive: 1, 'verification.emailVerified': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.profile.displayName || this.fullName;
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Update activity timestamp
  if (this.isModified()) {
    this.activity.lastLogin = new Date();
  }
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      userType: this.userType 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  return token;
};

userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verification;
  return user;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByVerificationToken = function(token) {
  return this.findOne({
    'verification.emailVerificationToken': token,
    'verification.emailVerificationExpires': { $gt: Date.now() }
  });
};

userSchema.statics.findByPasswordResetToken = function(token) {
  return this.findOne({
    'verification.passwordResetToken': token,
    'verification.passwordResetExpires': { $gt: Date.now() }
  });
};

userSchema.statics.getJobseekerStats = function() {
  return this.aggregate([
    { $match: { userType: 'jobseeker', isActive: true } },
    {
      $group: {
        _id: '$jobseekerProfile.careerLevel',
        count: { $sum: 1 },
        avgSkills: { $avg: { $size: '$jobseekerProfile.currentSkills' } }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        careerLevel: '$_id',
        userCount: '$count',
        averageSkills: { $round: ['$avgSkills', 1] },
        _id: 0
      }
    }
  ]);
};

userSchema.statics.getTopSkills = function(limit = 20) {
  return this.aggregate([
    { $match: { userType: 'jobseeker', isActive: true } },
    { $unwind: '$jobseekerProfile.currentSkills' },
    {
      $group: {
        _id: '$jobseekerProfile.currentSkills.name',
        count: { $sum: 1 },
        avgLevel: { $avg: { $cond: [
          { $eq: ['$jobseekerProfile.currentSkills.level', 'beginner'] }, 1,
          { $cond: [
            { $eq: ['$jobseekerProfile.currentSkills.level', 'intermediate'] }, 2,
            { $cond: [
              { $eq: ['$jobseekerProfile.currentSkills.level', 'advanced'] }, 3,
              { $cond: [
                { $eq: ['$jobseekerProfile.currentSkills.level', 'expert'] }, 4, 2
              ]}
            ]}
          ]}
        ]}}
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        skill: '$_id',
        userCount: '$count',
        averageLevel: { $round: ['$avgLevel', 2] },
        _id: 0
      }
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);
