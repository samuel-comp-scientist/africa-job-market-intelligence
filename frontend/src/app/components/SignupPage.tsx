'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Briefcase, BarChart3, Eye, EyeOff, Check } from 'lucide-react';

// Type definitions
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userType: 'jobseeker' | 'dataanalyst' | 'recruiter';
  careerLevel: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  agreeToTerms?: string;
  general?: string;
}

interface UserType {
  id: 'jobseeker' | 'dataanalyst' | 'recruiter';
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface Benefit {
  title: string;
  description: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: (searchParams.get('role') as 'jobseeker' | 'dataanalyst' | 'recruiter') || 'jobseeker',
    careerLevel: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const userTypes: UserType[] = [
    {
      id: 'jobseeker',
      title: 'Job Seeker',
      description: 'Find your dream tech job in Africa',
      icon: User,
      color: 'blue'
    },
    {
      id: 'dataanalyst',
      title: 'Data Analyst',
      description: 'Research and analyze job market trends',
      icon: BarChart3,
      color: 'purple'
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      description: 'Find top tech talent in Africa',
      icon: Briefcase,
      color: 'green'
    }
  ];

  const careerLevels: string[] = ['student', 'entry-level', 'mid-level', 'senior', 'lead', 'executive'];

  useEffect(() => {
    const role = searchParams.get('role');
    if (role && userTypes.find(ut => ut.id === role)) {
      setFormData(prev => ({ ...prev, userType: role as 'jobseeker' | 'dataanalyst' | 'recruiter' }));
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select a user type';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to terms and conditions';
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to appropriate dashboard
        const dashboardRoutes: Record<string, string> = {
          jobseeker: '/dashboard/jobseeker',
          dataanalyst: '/dashboard/dataanalyst',
          recruiter: '/dashboard/recruiter'
        };
        
        router.push(dashboardRoutes[formData.userType]);
      } else {
        setErrors({ general: data.error || 'Registration failed' });
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

  const selectedUserType: UserType | undefined = userTypes.find(ut => ut.id === formData.userType);
  const SelectedIcon = selectedUserType?.icon || User;

  const jobSeekerBenefits: Benefit[] = [
    {
      title: 'Personalized Career Insights',
      description: 'Get AI-powered recommendations based on your skills and goals'
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get learning recommendations'
    },
    {
      title: 'Salary Intelligence',
      description: 'Know your worth with real-time salary data'
    }
  ];

  const dataAnalystBenefits: Benefit[] = [
    {
      title: 'Advanced Analytics Tools',
      description: 'Professional-grade data analysis and visualization'
    },
    {
      title: 'Raw Data Access',
      description: 'Export and analyze raw job market datasets'
    },
    {
      title: 'API Integration',
      description: 'Integrate with your own research tools'
    }
  ];

  const recruiterBenefits: Benefit[] = [
    {
      title: 'Talent Intelligence',
      description: 'Understand skill availability and salary expectations'
    },
    {
      title: 'Market Insights',
      description: 'Data-driven hiring decisions'
    },
    {
      title: 'Competitor Analysis',
      description: 'Track hiring trends across companies'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join African tech community and unlock your career potential
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {userTypes.map((type: UserType) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.userType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 text-${type.color}-600`} />
                  <div className="text-sm font-medium text-gray-900">{type.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              );
            })}
          </div>
          {errors.userType && (
            <p className="mt-2 text-sm text-red-600">{errors.userType}</p>
          )}
        </div>

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Job Seeker Specific Fields */}
          {formData.userType === 'jobseeker' && (
            <div>
              <label htmlFor="careerLevel" className="block text-sm font-medium text-gray-700">
                Career Level
              </label>
              <select
                id="careerLevel"
                name="careerLevel"
                value={formData.careerLevel}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select your career level</option>
                {careerLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
              I agree to{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
          )}

          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Benefits Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Why Join {selectedUserType?.title}s?
        </h3>
        <div className="space-y-3">
          {formData.userType === 'jobseeker' && jobSeekerBenefits.map((benefit: Benefit, index: number) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">{benefit.title}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            </div>
          ))}
          
          {formData.userType === 'dataanalyst' && dataAnalystBenefits.map((benefit: Benefit, index: number) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">{benefit.title}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            </div>
          ))}
          
          {formData.userType === 'recruiter' && recruiterBenefits.map((benefit: Benefit, index: number) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">{benefit.title}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
