'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, User, Briefcase, BarChart3, Database, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Type definitions
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userType: 'jobseeker' | 'recruiter' | 'researcher' | 'developer';
  careerLevel?: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  careerLevel?: string;
  agreeToTerms?: string;
  general?: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface UserType {
  id: 'jobseeker' | 'recruiter' | 'researcher' | 'developer';
  title: string;
  description: string;
  icon: any;
  color: string;
  benefits: Benefit[];
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'jobseeker',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userTypeFromUrl = searchParams.get('role') as 'jobseeker' | 'recruiter' | 'researcher' | 'developer';

  const userTypes: UserType[] = [
    {
      id: 'jobseeker',
      title: 'Job Seeker',
      description: 'Find your dream tech job with data-driven insights',
      icon: User,
      color: 'blue',
      benefits: [
        { title: 'Personalized Career Insights', description: 'Get tailored recommendations based on your skills' },
        { title: 'Skill Demand Analytics', description: 'Track real-time demand for tech skills' },
        { title: 'Salary Intelligence', description: 'Know your worth in the market' },
        { title: 'Job Recommendations', description: 'Discover opportunities that match your profile' },
        { title: 'AI Career Advisor', description: 'Get AI-powered career guidance' },
        { title: 'Skill Gap Analysis', description: 'Identify skills you need to learn' }
      ]
    },
    {
      id: 'recruiter',
      title: 'Recruiter / Employer',
      description: 'Make data-driven hiring decisions with market intelligence',
      icon: Briefcase,
      color: 'green',
      benefits: [
        { title: 'Talent Market Insights', description: 'Understand talent availability' },
        { title: 'Salary Benchmarking', description: 'Set competitive compensation' },
        { title: 'Hiring Trend Analytics', description: 'Stay ahead of market trends' },
        { title: 'Job Market Reports', description: 'Comprehensive hiring insights' },
        { title: 'Company Hiring Insights', description: 'Track competitor hiring patterns' }
      ]
    },
    {
      id: 'researcher',
      title: 'Researcher / Data Analyst',
      description: 'Access comprehensive job market datasets and analytics',
      icon: BarChart3,
      color: 'purple',
      benefits: [
        { title: 'Advanced Analytics Dashboards', description: 'Deep dive into market trends' },
        { title: 'Dataset Explorer', description: 'Browse and filter job market data' },
        { title: 'Export Data (CSV/JSON)', description: 'Download data for analysis' },
        { title: 'Custom Charts', description: 'Build custom visualizations' },
        { title: 'Trend Analytics', description: 'Analyze historical and current trends' }
      ]
    },
    {
      id: 'developer',
      title: 'Developer (API User)',
      description: 'Programmatic access to job market data via API',
      icon: Database,
      color: 'orange',
      benefits: [
        { title: 'API Keys', description: 'Secure access to our API endpoints' },
        { title: 'API Documentation', description: 'Complete API reference and examples' },
        { title: 'Access to Endpoints', description: 'GET /api/jobs, /api/top-skills, /api/salary-stats' },
        { title: 'Programmatic Data Access', description: 'Integrate data into your applications' }
      ]
    }
  ];

  const careerLevels = [
    { value: 'student', label: 'Student' },
    { value: 'entry-level', label: 'Entry Level (0-2 years)' },
    { value: 'junior', label: 'Junior (2-5 years)' },
    { value: 'mid-level', label: 'Mid-Level (5-8 years)' },
    { value: 'senior', label: 'Senior (8-12 years)' },
    { value: 'lead', label: 'Lead/Principal (12+ years)' },
    { value: 'executive', label: 'Executive' }
  ];

  // Set user type from URL if provided
  useState(() => {
    if (userTypeFromUrl && ['jobseeker', 'recruiter', 'researcher', 'developer'].includes(userTypeFromUrl)) {
      setFormData(prev => ({ ...prev, userType: userTypeFromUrl }));
    }
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.userType === 'jobseeker' && !formData.careerLevel) {
      newErrors.careerLevel = 'Career level is required for job seekers';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to appropriate dashboard
        const dashboardRoutes: Record<string, string> = {
          jobseeker: '/dashboard/jobseeker',
          recruiter: '/dashboard/recruiter',
          researcher: '/dashboard/researcher',
          developer: '/dashboard/developer'
        };
        
        router.push(dashboardRoutes[formData.userType]);
      } else {
        // Handle validation errors with more detail
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors: FormErrors = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field as keyof FormErrors] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error || data.message || 'Registration failed' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectedUserType = userTypes.find(ut => ut.id === formData.userType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Join Africa Market Intelligence
            </h1>
            <p className="mt-2 text-xl text-gray-600">
              Get data-driven insights for your career or hiring needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Type Selection */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Role
                </h2>
                
                <div className="space-y-4">
                  {userTypes.map((userType: UserType) => {
                    const Icon = userType.icon;
                    return (
                      <div
                        key={userType.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.userType === userType.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, userType: userType.id }))}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`p-2 bg-${userType.color}-100 rounded-lg mr-3`}>
                            <Icon className={`h-6 w-6 text-${userType.color}-600`} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {userType.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {userType.description}
                        </p>
                        
                        {formData.userType === userType.id && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 text-sm">Benefits:</h4>
                            {userType.benefits.map((benefit: Benefit, index: number) => (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{benefit.title}</div>
                                  <div className="text-xs text-gray-600">{benefit.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Your Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Career Level (for job seekers) */}
                {formData.userType === 'jobseeker' && (
                  <div>
                    <label htmlFor="careerLevel" className="block text-sm font-medium text-gray-700">
                      Career Level
                    </label>
                    <select
                      id="careerLevel"
                      name="careerLevel"
                      value={formData.careerLevel || ''}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 ${
                        errors.careerLevel ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your career level</option>
                      {careerLevels.map((level: any) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                    {errors.careerLevel && (
                      <p className="mt-1 text-sm text-red-600">{errors.careerLevel}</p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <a href="/terms" className="text-blue-600 hover:text-blue-500">
                        Terms and Conditions
                      </a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      `Sign Up as ${selectedUserType?.title}`
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign in
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
