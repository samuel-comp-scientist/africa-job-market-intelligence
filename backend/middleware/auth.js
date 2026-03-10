const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 */

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Invalid token' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Account is suspended' 
      });
    }

    if (!user.verification.emailVerified) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Email not verified' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Token expired' 
      });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user has specific type
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Authentication required' 
      });
    }

    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive && user.verification.emailVerified) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

// Check subscription limits
const checkSubscription = (feature, limitField) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Access denied',
          message: 'Authentication required' 
        });
      }

      const user = req.user;
      const subscription = user.subscription;
      
      // Check if user has access to this feature
      if (subscription.plan !== 'free' && !subscription.features.includes(feature)) {
        return res.status(403).json({ 
          error: 'Feature not available',
          message: 'This feature is not available in your current plan' 
        });
      }

      // Check usage limits
      if (limitField && subscription.limits[limitField] !== undefined) {
        const currentUsage = await getCurrentUsage(user._id, feature);
        const limit = subscription.limits[limitField];
        
        if (currentUsage >= limit) {
          return res.status(403).json({ 
            error: 'Limit exceeded',
            message: `You have reached your limit of ${limit} ${feature.replace('_', ' ')}`,
            currentUsage,
            limit,
            plan: subscription.plan
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};

// Helper function to get current usage
async function getCurrentUsage(userId, feature) {
  const User = require('../models/User');
  const user = await User.findById(userId);
  
  switch (feature) {
    case 'saved_jobs':
      return user.preferences.dashboard.savedJobs.length;
    case 'saved_searches':
      return user.preferences.dashboard.savedSearches.length;
    case 'skill_analysis':
      // This would typically track skill analysis requests in a separate collection
      return 0; // Placeholder
    default:
      return 0;
  }
}

// Rate limiting middleware
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [k, v] of requests.entries()) {
      if (v.timestamp < windowStart) {
        requests.delete(k);
      }
    }
    
    const userRequests = requests.get(key) || { count: 0, timestamp: now };
    
    if (userRequests.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 60000} minutes.`,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    userRequests.count++;
    userRequests.timestamp = now;
    requests.set(key, userRequests);
    
    next();
  };
};

// Email verification check
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Access denied',
      message: 'Authentication required' 
    });
  }

  if (!req.user.verification.emailVerified) {
    return res.status(403).json({ 
      error: 'Email verification required',
      message: 'Please verify your email address to access this feature',
      requiresVerification: true
    });
  }

  next();
};

// Admin only middleware
const adminOnly = authorize('admin');

// Job seeker only middleware
const jobseekerOnly = authorize('jobseeker');

// Employer only middleware
const employerOnly = authorize('employer');

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  checkSubscription,
  rateLimit,
  requireEmailVerification,
  adminOnly,
  jobseekerOnly,
  employerOnly
};
