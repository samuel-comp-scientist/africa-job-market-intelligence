'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  BarChart3, 
  Database, 
  Target,
  DollarSign,
  Brain,
  Search,
  TrendingUp,
  MapPin,
  ArrowRight,
  CheckCircle,
  Activity,
  Globe
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

// Type definitions
interface UserType {
  id: 'jobseeker' | 'dataanalyst' | 'recruiter' | 'developer';
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const router = useRouter();

  const userTypes: UserType[] = [
    {
      id: 'jobseeker',
      title: 'Job Seekers',
      description: 'Discover skills employers want and find your dream tech job',
      icon: User,
      color: 'blue',
      features: ['Personalized career insights', 'Skill gap analysis', 'Salary intelligence', 'Job recommendations']
    },
    {
      id: 'recruiter',
      title: 'Recruiters',
      description: 'Understand talent market and make data-driven hiring decisions',
      icon: Briefcase,
      color: 'green',
      features: ['Talent intelligence', 'Salary benchmarking', 'Hiring trends', 'Competitor analysis']
    },
    {
      id: 'dataanalyst',
      title: 'Researchers',
      description: 'Access comprehensive job market datasets and analytics',
      icon: BarChart3,
      color: 'purple',
      features: ['Raw data access', 'Custom analytics', 'Data export', 'API integration']
    },
    {
      id: 'developer',
      title: 'Developers',
      description: 'Build applications using powerful job market APIs',
      icon: Database,
      color: 'orange',
      features: ['RESTful APIs', 'Real-time data', 'Documentation', 'SDK support']
    }
  ];

  const features: Feature[] = [
    {
      id: 'analytics',
      title: 'Job Market Analytics',
      description: 'Real-time analysis of thousands of job postings across Africa',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'skills',
      title: 'Skill Demand Insights',
      description: 'Track which tech skills are most in-demand by employers',
      icon: Target,
      color: 'green'
    },
    {
      id: 'salary',
      title: 'Salary Intelligence',
      description: 'Comprehensive salary data by skill, location, and experience',
      icon: DollarSign,
      color: 'purple'
    },
    {
      id: 'ai',
      title: 'AI Career Advisor',
      description: 'Personalized recommendations for career growth and skill development',
      icon: Brain,
      color: 'orange'
    },
    {
      id: 'explorer',
      title: 'Job Explorer',
      description: 'Advanced search and filtering for tech opportunities',
      icon: Search,
      color: 'red'
    },
    {
      id: 'predictions',
      title: 'Skill Predictions',
      description: 'AI-powered forecasts for future skill demands',
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

  const steps: Step[] = [
    {
      number: 1,
      title: 'Data Collection',
      description: 'We collect and analyze thousands of job postings from leading African job boards'
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI processes job market data to identify trends, patterns, and insights'
    },
    {
      number: 3,
      title: 'Explore Insights',
      description: 'Users access personalized dashboards with actionable intelligence and recommendations'
    }
  ];

  const handleGetStarted = (): void => {
    if (selectedRole) {
      router.push(`/signup?role=${selectedRole}`);
    } else {
      router.push('/signup');
    }
  };

  const handleExplore = (): void => {
    router.push('/demo');
  };

  const handleLogin = (): void => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background with Africa map concept */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
            <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-green-500 rounded-full filter blur-3xl"></div>
          </div>
          
          {/* Tech nodes visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-6xl h-96">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400">
                <line x1="200" y1="200" x2="400" y2="150" stroke="#3B82F6" strokeWidth="2" opacity="0.3"/>
                <line x1="400" y1="150" x2="600" y2="200" stroke="#3B82F6" strokeWidth="2" opacity="0.3"/>
                <line x1="600" y1="200" x2="800" y2="150" stroke="#3B82F6" strokeWidth="2" opacity="0.3"/>
                <line x1="200" y1="200" x2="300" y2="300" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                <line x1="300" y1="300" x2="500" y2="250" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                <line x1="500" y1="250" x2="700" y2="300" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                <line x1="700" y1="300" x2="800" y2="150" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
              </svg>
              
              {/* Tech nodes */}
              <div className="absolute top-1/2 left-1/5 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">Nigeria</div>
                </div>
              </div>
              <div className="absolute top-1/3 left-2/5 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">Kenya</div>
                </div>
              </div>
              <div className="absolute top-1/2 left-3/5 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">South Africa</div>
                </div>
              </div>
              <div className="absolute top-1/3 left-4/5 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">Egypt</div>
                </div>
              </div>
              <div className="absolute bottom-1/4 left-1/3 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">Ghana</div>
                </div>
              </div>
              <div className="absolute bottom-1/4 right-1/3 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">Morocco</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Understand African Tech Job Market
              <span className="block text-blue-600">with Data</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover most demanded skills, salary trends, and future tech opportunities across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExplore}
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Explore Insights
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Insights Preview */}
      <section id="insights" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real-Time Market Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform analyzes thousands of job postings to uncover real hiring trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top Skills Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Top Skills in Africa</h3>
              </div>
              <div className="space-y-3">
                {[
                  { skill: 'Python', demand: 89, trend: '+18%' },
                  { skill: 'JavaScript', demand: 76, trend: '+12%' },
                  { skill: 'React', demand: 68, trend: '+22%' },
                  { skill: 'AWS', demand: 54, trend: '+31%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.demand}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-green-600">{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Tech Salary Trends</h3>
              </div>
              <div className="space-y-3">
                {[
                  { role: 'Full Stack Dev', avg: '$75K', growth: '+12%' },
                  { role: 'Data Scientist', avg: '$85K', growth: '+25%' },
                  { role: 'DevOps Eng', avg: '$90K', growth: '+18%' },
                  { role: 'Frontend Dev', avg: '$65K', growth: '+8%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.role}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-green-600">{item.avg}</span>
                      <span className="text-xs font-medium text-blue-600">{item.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Job Distribution</h3>
              </div>
              <div className="space-y-3">
                {[
                  { country: 'Nigeria', jobs: 45, color: 'bg-blue-500' },
                  { country: 'Kenya', jobs: 25, color: 'bg-green-500' },
                  { country: 'South Africa', jobs: 20, color: 'bg-purple-500' },
                  { country: 'Egypt', jobs: 10, color: 'bg-orange-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`} 
                          style={{ width: `${item.jobs}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.jobs}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Platform Is For */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who This Platform Is For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored intelligence for every stakeholder in African tech ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((userType: UserType) => {
              const Icon = userType.icon;
              return (
                <div key={userType.id} className="group">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 bg-${userType.color}-100 rounded-lg group-hover:bg-${userType.color}-200 transition-colors`}>
                        <Icon className={`h-8 w-8 text-${userType.color}-600`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{userType.title}</h3>
                    <p className="text-gray-600 mb-4">{userType.description}</p>
                    <ul className="space-y-2">
                      {userType.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform-features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools for understanding and navigating African tech job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: Feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="group">
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 bg-${feature.color}-100 rounded-lg group-hover:bg-${feature.color}-200 transition-colors`}>
                        <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple process to turn raw job data into actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step: Step) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                      {step.number}
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {step.number < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Exploring African Tech Job Market
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals making data-driven career decisions in Africa's growing tech industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
