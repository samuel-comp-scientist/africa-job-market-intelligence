const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRegistration, validateLogin, validateProfile } = require('../middleware/validation');
const crypto = require('crypto');
const emailService = require('../utils/emailService');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - userType
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               userType:
 *                 type: string
 *                 enum: [jobseeker, recruiter, researcher, developer]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               careerLevel:
 *                 type: string
 *                 enum: [student, entry-level, mid-level, senior, lead, executive]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    
    const { email, password, userType, firstName, lastName, careerLevel } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = new User({
      email,
      password,
      userType,
      profile: {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`
      },
      ...(userType === 'jobseeker' && {
        jobseekerProfile: {
          careerLevel: careerLevel || 'entry-level'
        }
      }),
      verification: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate token for immediate login
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toSafeObject(),
      token,
      requiresEmailVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account suspended',
        message: user.suspensionReason || 'Your account has been suspended'
      });
    }

    // Update login activity
    user.activity.lastLogin = new Date();
    user.activity.loginCount += 1;
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      message: 'Login successful',
      user: user.toSafeObject(),
      token,
      requiresEmailVerification: !user.verification.emailVerified
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'The verification token is invalid or has expired'
      });
    }

    // Verify email
    user.verification.emailVerified = true;
    user.verification.emailVerificationToken = undefined;
    user.verification.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    if (user.verification.emailVerified) {
      return res.status(400).json({
        error: 'Already verified',
        message: 'This email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verification.emailVerificationToken = verificationToken;
    user.verification.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    res.json({
      message: 'Verification email sent',
      email: email
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.verification.passwordResetToken = resetToken;
    user.verification.passwordResetExpires = resetExpires;
    user.verification.lastPasswordReset = new Date();
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.json({
      message: 'Password reset email sent',
      email: email
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset' });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findByPasswordResetToken(token);
    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'The reset token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.verification.passwordResetToken = undefined;
    user.verification.passwordResetExpires = undefined;
    await user.save();

    res.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: req.user.toSafeObject()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 $ref: '#/components/schemas/UserProfile'
 *               jobseekerProfile:
 *                 $ref: '#/components/schemas/JobseekerProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/update-profile', authenticate, validateProfile, async (req, res) => {
  try {
    const { profile, jobseekerProfile, preferences } = req.body;
    const user = req.user;

    // Update basic profile
    if (profile) {
      Object.keys(profile).forEach(key => {
        if (profile[key] !== undefined) {
          user.profile[key] = profile[key];
        }
      });
    }

    // Update jobseeker profile
    if (jobseekerProfile && user.userType === 'jobseeker') {
      Object.keys(jobseekerProfile).forEach(key => {
        if (jobseekerProfile[key] !== undefined) {
          user.jobseekerProfile[key] = jobseekerProfile[key];
        }
      });
      
      // Update skills timestamp
      user.activity.skillsUpdated = new Date();
    }

    // Update preferences
    if (preferences) {
      Object.keys(preferences).forEach(key => {
        if (preferences[key] !== undefined) {
          if (typeof preferences[key] === 'object' && !Array.isArray(preferences[key])) {
            user.preferences[key] = { ...user.preferences[key], ...preferences[key] };
          } else {
            user.preferences[key] = preferences[key];
          }
        }
      });
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 */
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/delete-account', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password is incorrect'
      });
    }

    // Soft delete by deactivating account
    user.isActive = false;
    user.isSuspended = true;
    user.suspensionReason = 'Account deleted by user';
    await user.save();

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
