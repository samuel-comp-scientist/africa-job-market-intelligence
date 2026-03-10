const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service Utility
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send email verification
 */
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"African Job Market" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">African Job Market Intelligence</h1>
            <p style="color: #6b7280; font-size: 16px;">Welcome to the future of tech careers in Africa!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Verify Your Email Address</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up! To complete your registration and unlock all features of the African Job Market Intelligence platform, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="background: #e5e7eb; padding: 5px 10px; border-radius: 4px; word-break: break-all;">
                ${verificationUrl}
              </span>
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Note:</strong> This verification link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you didn't create an account, please ignore this email.</p>
            <p>© 2024 African Job Market Intelligence. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"African Job Market" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">African Job Market Intelligence</h1>
            <p style="color: #6b7280; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Reset Your Password</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset the password for your account. Click the button below to set a new password.
            </p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" 
                 style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="background: #e5e7eb; padding: 5px 10px; border-radius: 4px; word-break: break-all;">
                ${resetUrl}
              </span>
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you're having trouble, contact our support team.</p>
            <p>© 2024 African Job Market Intelligence. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, firstName, userType) => {
  try {
    const transporter = createTransporter();
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"African Job Market" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to African Job Market Intelligence!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome, ${firstName}!</h1>
            <p style="color: #6b7280; font-size: 16px;">You're now part of Africa's leading tech career platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Get Started with Your Dashboard</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              ${userType === 'jobseeker' ? 
                `Discover the most in-demand tech skills across Africa, compare salaries by country and role, and get personalized career recommendations based on your profile.` :
                `Post job openings, find qualified candidates, and access comprehensive market insights to make informed hiring decisions.`
              }
            </p>
            
            <div style="text-align: center;">
              <a href="${dashboardUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          ${userType === 'jobseeker' ? `
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #065f46; margin-bottom: 15px;">Quick Tips for Job Seekers:</h3>
            <ul style="color: #047857; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Complete your profile to get personalized skill recommendations</li>
              <li>Explore trending skills in your country and region</li>
              <li>Set up job alerts for your target roles</li>
              <li>Use our AI-powered skill gap analysis</li>
            </ul>
          </div>
          ` : ''}
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>Need help? Check out our <a href="${process.env.FRONTEND_URL}/help" style="color: #2563eb;">Help Center</a></p>
            <p>© 2024 African Job Market Intelligence. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

/**
 * Send skill analysis report
 */
const sendSkillAnalysisReport = async (email, analysisData) => {
  try {
    const transporter = createTransporter();
    const reportUrl = `${process.env.FRONTEND_URL}/skill-analysis/${analysisData.id}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"African Job Market" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Skill Analysis Report is Ready',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Skill Analysis Report</h1>
            <p style="color: #6b7280; font-size: 16px;">Your personalized career insights are ready</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Analysis Summary</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div style="background: #e0f2fe; padding: 15px; border-radius: 6px;">
                <h4 style="color: #0369a1; margin: 0 0 5px 0;">Current Skills</h4>
                <p style="color: #0c4a6e; margin: 0; font-size: 24px; font-weight: bold;">${analysisData.currentSkills}</p>
              </div>
              <div style="background: #f3e8ff; padding: 15px; border-radius: 6px;">
                <h4 style="color: #7c3aed; margin: 0 0 5px 0;">Market Demand</h4>
                <p style="color: #4c1d95; margin: 0; font-size: 24px; font-weight: bold;">${analysisData.marketDemand}%</p>
              </div>
              <div style="background: #dcfce7; padding: 15px; border-radius: 6px;">
                <h4 style="color: #16a34a; margin: 0 0 5px 0;">Growth Potential</h4>
                <p style="color: #14532d; margin: 0; font-size: 24px; font-weight: bold;">${analysisData.growthPotential}%</p>
              </div>
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px;">
                <h4 style="color: #d97706; margin: 0 0 5px 0;">Skills to Learn</h4>
                <p style="color: #78350f; margin: 0; font-size: 24px; font-weight: bold;">${analysisData.skillsToLearn}</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${reportUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                View Full Report
              </a>
            </div>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #065f46; margin-bottom: 10px;">Top Recommendations:</h3>
            <ul style="color: #047857; line-height: 1.6; margin: 0; padding-left: 20px;">
              ${analysisData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>Keep building your skills and check back for updated market insights!</p>
            <p>© 2024 African Job Market Intelligence. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Skill analysis report sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send skill analysis report:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendSkillAnalysisReport
};
