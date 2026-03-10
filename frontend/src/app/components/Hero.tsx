'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, TrendingUp, Users, DollarSign, User, Briefcase, Database, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    const dashboardRoutes: Record<string, string> = {
      jobseeker: '/dashboard/jobseeker',
      recruiter: '/dashboard/recruiter',
      researcher: '/dashboard/researcher',
      developer: '/dashboard/developer',
      admin: '/dashboard/admin'
    };
    
    return dashboardRoutes[user.userType] || '/dashboard';
  };

  const getUserWelcomeMessage = () => {
    if (!user) return '';
    
    const messages: Record<string, string> = {
      jobseeker: 'Find your dream tech job',
      recruiter: 'Find the best talent',
      researcher: 'Explore market insights',
      developer: 'Access API resources',
      admin: 'Manage the platform'
    };
    
    return messages[user.userType] || 'Welcome back';
  };

  const getUserIcon = () => {
    if (!user) return User;
    
    const iconMap: Record<string, any> = {
      jobseeker: User,
      recruiter: Briefcase,
      researcher: BarChart3,
      developer: Code,
      admin: Database
    };
    
    return iconMap[user.userType] || User;
  };

  const UserIcon = getUserIcon();

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8">
            <span className="text-sm font-semibold text-blue-900">
              🚀 Trusted by 10,000+ African Tech Professionals
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
            {user ? (
              <>
                Welcome back, {user.profile?.firstName || user.email?.split('@')[0]}!
                <span className="block text-blue-600">{getUserWelcomeMessage()}</span>
              </>
            ) : (
              <>
                Understand Africa's Tech Job Market
                <span className="block text-blue-600">with Data</span>
              </>
            )}
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            {user ? (
              `Continue your journey as a ${user.userType}. Access your personalized dashboard and explore the latest insights in Africa's tech job market.`
            ) : (
              'Get real-time insights into skill demand, salary analytics, and AI-powered career predictions. ' +
              'Make data-driven decisions for your tech career in Africa\'s growing digital economy.'
            )}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <button
                  onClick={() => router.push(getDashboardLink())}
                  className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="inline-flex items-center px-8 py-4 text-base font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/signup')}
                  className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center px-8 py-4 text-base font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Mock Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Dashboard</h3>
                      <p className="text-xs text-gray-500">Real-time analytics</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Live</span>
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mock Card 1 */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">+18%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-1">45,678</h4>
                    <p className="text-sm text-gray-600">Active Job Postings</p>
                  </div>

                  {/* Mock Card 2 */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">+22%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-1">$85,000</h4>
                    <p className="text-sm text-gray-600">Average Tech Salary</p>
                  </div>

                  {/* Mock Card 3 */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">+15%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-1">1,234</h4>
                    <p className="text-sm text-gray-600">Hiring Companies</p>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Skill Demand Trends</h4>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-32 flex items-end space-x-2">
                    {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 65, 95].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
