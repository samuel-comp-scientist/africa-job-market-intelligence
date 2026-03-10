'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, DollarSign, Users, Search, Briefcase, Building, Target } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RecruiterDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.userType !== 'recruiter') {
      router.push('/dashboard');
      return;
    }

    setUserData(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData?.profile?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Your talent market intelligence and hiring insights
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Talent</p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Market Rate</p>
                  <p className="text-2xl font-bold text-gray-900">$72K</p>
                  <p className="text-xs text-gray-600">For your roles</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Match Quality</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-600">Candidate fit</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-600">3 hiring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Talent Market & Analytics */}
            <div className="lg:col-span-2 space-y-8">
              {/* Talent Market Insights */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Talent Market Insights</h2>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Skill Availability</h3>
                    <div className="space-y-3">
                      {[
                        { skill: 'JavaScript', available: 894, demand: 'High' },
                        { skill: 'React', available: 623, demand: 'High' },
                        { skill: 'Python', available: 567, demand: 'Medium' },
                        { skill: 'Node.js', available: 432, demand: 'Medium' },
                        { skill: 'TypeScript', available: 298, demand: 'High' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                              <span className="text-xs text-gray-600">{item.available} candidates</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  item.demand === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min((item.available / 894) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`ml-3 text-xs px-2 py-1 rounded ${
                            item.demand === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.demand}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Hiring Trends</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Remote Work</span>
                          <span className="text-sm text-green-600">+35%</span>
                        </div>
                        <p className="text-xs text-gray-600">Companies offering remote options</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Contract Roles</span>
                          <span className="text-sm text-green-600">+28%</span>
                        </div>
                        <p className="text-xs text-gray-600">Increase in contract hiring</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Tech Salaries</span>
                          <span className="text-sm text-green-600">+18%</span>
                        </div>
                        <p className="text-xs text-gray-600">Average salary increase</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Time to Hire</span>
                          <span className="text-sm text-red-600">-12%</span>
                        </div>
                        <p className="text-xs text-gray-600">Reduced hiring time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Benchmarking */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Salary Benchmarking</h2>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { role: 'Frontend Developer', min: 55000, max: 85000, average: 70000, yourRange: '65K-80K' },
                    { role: 'Backend Developer', min: 60000, max: 90000, average: 75000, yourRange: '70K-85K' },
                    { role: 'Full Stack Developer', min: 65000, max: 95000, average: 80000, yourRange: '75K-90K' },
                    { role: 'Senior React Developer', min: 75000, max: 110000, average: 92500, yourRange: '85K-100K' },
                    { role: 'DevOps Engineer', min: 70000, max: 105000, average: 87500, yourRange: '80K-95K' }
                  ].map((role, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{role.role}</h3>
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {role.yourRange}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">Market: ${role.min.toLocaleString()} - ${role.max.toLocaleString()}</span>
                        <span className="font-medium text-gray-900">Avg: ${role.average.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${((role.average - role.min) / (role.max - role.min)) * 100}%`,
                            marginLeft: `${((65000 - role.min) / (role.max - role.min)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Company Insights & Actions */}
            <div className="space-y-8">
              {/* Company Hiring Insights */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Company Insights</h2>
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">Top 15%</p>
                    <p className="text-sm text-gray-600">Your competitive position</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Competitor Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TechCorp</span>
                        <span className="text-orange-600">Similar hiring</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">StartupXYZ</span>
                        <span className="text-green-600">Below average</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">FinTechPro</span>
                        <span className="text-red-600">Above average</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Market Position</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Competitive salaries</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Good benefits package</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Remote options needed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <button className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">Search Candidates</p>
                        <p className="text-xs text-blue-700">Find matching talent</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Post New Job</p>
                        <p className="text-xs text-green-700">Create job listing</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-purple-900">View Reports</p>
                        <p className="text-xs text-purple-700">Download analytics</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
