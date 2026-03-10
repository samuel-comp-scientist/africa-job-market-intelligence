const Joi = require('joi');

// Validation schemas
const schemas = {
  registration: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    }),
    userType: Joi.string().valid('jobseeker', 'recruiter', 'researcher', 'developer').required().messages({
      'any.only': 'User type must be jobseeker, recruiter, researcher, or developer',
      'any.required': 'User type is required'
    }),
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    careerLevel: Joi.string().valid('student', 'entry-level', 'mid-level', 'senior', 'lead', 'executive').optional(),
    agreeToTerms: Joi.boolean().valid(true).required().messages({
      'any.only': 'You must agree to the terms and conditions',
      'any.required': 'You must agree to the terms and conditions'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    }),
    rememberMe: Joi.boolean().optional().default(false)
  }),

  profile: Joi.object({
    profile: Joi.object({
      firstName: Joi.string().min(2).max(50).optional(),
      lastName: Joi.string().min(2).max(50).optional(),
      displayName: Joi.string().max(100).optional(),
      bio: Joi.string().max(500).optional(),
      avatar: Joi.string().uri().optional(),
      location: Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        timezone: Joi.string().optional()
      }).optional(),
      contact: Joi.object({
        phone: Joi.string().optional(),
        linkedin: Joi.string().uri().optional(),
        github: Joi.string().uri().optional(),
        portfolio: Joi.string().uri().optional(),
        twitter: Joi.string().optional()
      }).optional()
    }).optional(),
    
    jobseekerProfile: Joi.object({
      careerLevel: Joi.string().valid('student', 'entry-level', 'mid-level', 'senior', 'lead', 'executive').optional(),
      targetRoles: Joi.array().items(Joi.string().max(100)).optional(),
      currentSkills: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
        yearsOfExperience: Joi.number().min(0).optional(),
        lastUsed: Joi.date().optional()
      })).optional(),
      desiredSkills: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        priority: Joi.string().valid('low', 'medium', 'high').optional(),
        targetDate: Joi.date().optional()
      })).optional(),
      education: Joi.array().items(Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string().required(),
        field: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional(),
        current: Joi.boolean().optional()
      })).optional(),
      experience: Joi.array().items(Joi.object({
        company: Joi.string().required(),
        position: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional(),
        current: Joi.boolean().optional(),
        description: Joi.string().max(1000).optional(),
        skills: Joi.array().items(Joi.string()).optional()
      })).optional(),
      certifications: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        issuer: Joi.string().required(),
        issueDate: Joi.date().required(),
        expiryDate: Joi.date().optional(),
        credentialId: Joi.string().optional(),
        credentialUrl: Joi.string().uri().optional()
      })).optional(),
      salaryExpectation: Joi.object({
        min: Joi.number().min(0).optional(),
        max: Joi.number().min(0).optional(),
        currency: Joi.string().default('USD').optional(),
        negotiable: Joi.boolean().optional()
      }).optional(),
      jobPreferences: Joi.object({
        remoteOnly: Joi.boolean().optional(),
        willingToRelocate: Joi.boolean().optional(),
        preferredCountries: Joi.array().items(Joi.string()).optional(),
        employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship').optional()
      }).optional()
    }).optional(),
    
    preferences: Joi.object({
      emailNotifications: Joi.object({
        jobAlerts: Joi.boolean().optional(),
        skillUpdates: Joi.boolean().optional(),
        salaryReports: Joi.boolean().optional(),
        marketInsights: Joi.boolean().optional()
      }).optional(),
      dashboard: Joi.object({
        defaultView: Joi.string().valid('insights', 'jobs', 'skills', 'salary').optional(),
        favoriteSkills: Joi.array().items(Joi.string()).optional(),
        savedJobs: Joi.array().items(Joi.string().optional()),
        savedSearches: Joi.array().items(Joi.object({
          name: Joi.string().required(),
          query: Joi.object().required(),
          created: Joi.date().optional(),
          lastUsed: Joi.date().optional()
        })).optional()
      }).optional(),
      privacy: Joi.object({
        profileVisible: Joi.boolean().optional(),
        showContactInfo: Joi.boolean().optional(),
        allowRecruiters: Joi.boolean().optional()
      }).optional()
    }).optional()
  }),

  jobQuery: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    page: Joi.number().integer().min(1).default(1),
    country: Joi.string().max(50),
    skill: Joi.string().max(50),
    seniority: Joi.string().valid('junior', 'mid-level', 'senior', 'lead', 'architect'),
    remote: Joi.boolean(),
    sortBy: Joi.string().valid('scrapedAt', 'salaryMin', 'jobTitle', 'company').default('scrapedAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  jobSearch: Joi.object({
    keywords: Joi.string().max(200),
    skills: Joi.array().items(Joi.string().max(50)).max(10),
    countries: Joi.array().items(Joi.string().max(50)).max(10),
    salaryMin: Joi.number().min(0),
    salaryMax: Joi.number().min(0),
    seniority: Joi.array().items(Joi.string().valid('junior', 'mid-level', 'senior', 'lead', 'architect')).max(5),
    remote: Joi.boolean(),
    limit: Joi.number().integer().min(1).max(100).default(50),
    page: Joi.number().integer().min(1).default(1)
  }),

  salaryCompare: Joi.object({
    skills: Joi.array().items(Joi.string().max(50)).max(10),
    countries: Joi.array().items(Joi.string().max(50)).max(10),
    seniority: Joi.array().items(Joi.string().valid('junior', 'mid-level', 'senior', 'lead', 'architect')).max(5)
  }),

  emailVerification: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Verification token is required'
    })
  }),

  passwordReset: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Reset token is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
  }),

  deleteAccount: Joi.object({
    password: Joi.string().required().messages({
      'any.required': 'Password is required to delete account'
    })
  }),

  saveJob: Joi.object({
    jobId: Joi.string().required().messages({
      'any.required': 'Job ID is required'
    })
  })
};

// Validation middleware functions
const validateRegistration = (req, res, next) => {
  console.log('Validating registration request body:', req.body);
  const { error, value } = schemas.registration.validate(req.body);
  
  if (error) {
    console.log('Validation error:', error.details);
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  console.log('Validation passed, sanitized data:', value);
  req.body = value;
  next();
};

const validateLogin = (req, res, next) => {
  console.log('Validating login request body:', req.body);
  const { error, value } = schemas.login.validate(req.body);
  
  if (error) {
    console.log('Login validation error:', error.details);
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  console.log('Login validation passed, sanitized data:', value);
  req.body = value;
  next();
};

const validateProfile = (req, res, next) => {
  const { error, value } = schemas.profile.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateJobQuery = (req, res, next) => {
  const { error, value } = schemas.jobQuery.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.query = value;
  next();
};

const validateJobSearch = (req, res, next) => {
  const { error, value } = schemas.jobSearch.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateSalaryCompare = (req, res, next) => {
  const { error, value } = schemas.salaryCompare.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateEmailVerification = (req, res, next) => {
  const { error, value } = schemas.emailVerification.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validatePasswordReset = (req, res, next) => {
  const { error, value } = schemas.passwordReset.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateChangePassword = (req, res, next) => {
  const { error, value } = schemas.changePassword.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateForgotPassword = (req, res, next) => {
  const { error, value } = schemas.forgotPassword.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateDeleteAccount = (req, res, next) => {
  const { error, value } = schemas.deleteAccount.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateSaveJob = (req, res, next) => {
  const { error, value } = schemas.saveJob.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfile,
  validateJobQuery,
  validateJobSearch,
  validateSalaryCompare,
  validateEmailVerification,
  validatePasswordReset,
  validateChangePassword,
  validateForgotPassword,
  validateDeleteAccount,
  validateSaveJob,
  schemas
};
