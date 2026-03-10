'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Activity, 
  Users, 
  Database,
  Globe,
  Brain,
  Target
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AnalyticsDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    setUserData(JSON.parse(user));
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
              <p className="mt-4 text-gray-600">Loading analytics...</p>
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
              Africa Tech Job Market Analytics 📊
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into the African tech job market
            </p>
          </div>

          {/* View Selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'skills', label: 'Skill Intelligence', icon: Brain },
                { id: 'salary', label: 'Salary Intelligence', icon: DollarSign },
                { id: 'geographic', label: 'Geographic Distribution', icon: MapPin },
                { id: 'future', label: 'Future Predictions', icon: Target }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    selectedView === view.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <view.icon className="h-4 w-4 mr-2" />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {selectedView === 'overview' && (
            <div className="space-y-8">
              {/* Main Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">45,678</p>
                      <p className="text-xs text-green-600">+12% this month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Hiring Growth</p>
                      <p className="text-2xl font-bold text-gray-900">+18%</p>
                      <p className="text-xs text-green-600">Year over year</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Top Skills</p>
                      <p className="text-2xl font-bold text-gray-900">JavaScript</p>
                      <p className="text-xs text-gray-600">89% demand</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Globe className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Countries</p>
                      <p className="text-2xl font-bold text-gray-900">15</p>
                      <p className="text-xs text-gray-600">Active markets</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Top Demanded Skills</h2>
                  <div className="space-y-4">
                    {[
                      { skill: 'JavaScript', demand: 89, jobs: '12,345', growth: '+12%' },
                      { skill: 'Python', demand: 76, jobs: '10,234', growth: '+18%' },
                      { skill: 'React', demand: 68, jobs: '8,765', growth: '+22%' },
                      { skill: 'TypeScript', demand: 54, jobs: '6,543', growth: '+35%' },
                      { skill: 'Node.js', demand: 48, jobs: '5,678', growth: '+15%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                            <span className="text-sm text-green-600">{item.growth}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${item.demand}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-4 text-sm text-gray-600">{item.jobs} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Hiring Hotspots</h2>
                  <div className="space-y-4">
                    {[
                      { country: 'Nigeria', jobs: 18456, growth: '+22%', cities: 'Lagos, Abuja' },
                      { country: 'South Africa', jobs: 12345, growth: '+18%', cities: 'Johannesburg, Cape Town' },
                      { country: 'Kenya', jobs: 8765, growth: '+15%', cities: 'Nairobi, Mombasa' },
                      { country: 'Egypt', jobs: 6543, growth: '+12%', cities: 'Cairo, Alexandria' },
                      { country: 'Morocco', jobs: 4321, growth: '+8%', cities: 'Casablanca, Rabat' }
                    ].map((item, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{item.country}</span>
                          <span className="text-sm text-green-600 font-medium">{item.growth}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{item.jobs.toLocaleString()} jobs</span>
                          <span>{item.cities}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'skills' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Skill Intelligence Dashboard</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Top Skills by Demand</h3>
                    <div className="space-y-2">
                      {[
                        { skill: 'JavaScript', demand: 89, trend: 'up' },
                        { skill: 'Python', demand: 76, trend: 'up' },
                        { skill: 'React', demand: 68, trend: 'up' },
                        { skill: 'TypeScript', demand: 54, trend: 'up' },
                        { skill: 'Node.js', demand: 48, trend: 'stable' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.skill}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{item.demand}%</span>
                            <span className={`text-xs ${
                              item.trend === 'up' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {item.trend === 'up' ? '↑' : '→'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Fastest Growing Skills</h3>
                    <div className="space-y-2">
                      {[
                        { skill: 'TypeScript', growth: '+35%' },
                        { skill: 'GraphQL', growth: '+41%' },
                        { skill: 'Docker', growth: '+28%' },
                        { skill: 'Kubernetes', growth: '+32%' },
                        { skill: 'AWS', growth: '+25%' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.skill}</span>
                          <span className="text-sm text-green-600 font-medium">{item.growth}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Skill Categories</h3>
                    <div className="space-y-2">
                      {[
                        { category: 'Frontend', count: 12345, share: '35%' },
                        { category: 'Backend', count: 15678, share: '45%' },
                        { category: 'DevOps', count: 4567, share: '13%' },
                        { category: 'Data Science', count: 2345, share: '7%' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{item.count}</span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {item.share}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'salary' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Salary Intelligence Dashboard</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Average Salary by Role</h3>
                    <div className="space-y-2">
                      {[
                        { role: 'AI Engineer', salary: '$95K', range: '$80K-$130K' },
                        { role: 'DevOps Engineer', salary: '$90K', range: '$75K-$120K' },
                        { role: 'Data Scientist', salary: '$85K', range: '$70K-$110K' },
                        { role: 'Backend Developer', salary: '$75K', range: '$60K-$95K' },
                        { role: 'Frontend Developer', salary: '$70K', range: '$55K-$90K' }
                      ].map((item, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.role}</span>
                            <span className="text-sm font-bold text-green-600">{item.salary}</span>
                          </div>
                          <span className="text-xs text-gray-600">{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Salary by Country</h3>
                    <div className="space-y-2">
                      {[
                        { country: 'South Africa', avg: '$72K', currency: 'ZAR 1.3M' },
                        { country: 'Nigeria', avg: '$48K', currency: 'NGN 35M' },
                        { country: 'Kenya', avg: '$42K', currency: 'KES 5.4M' },
                        { country: 'Egypt', avg: '$36K', currency: 'EGP 1.1M' },
                        { country: 'Morocco', avg: '$38K', currency: 'MAD 380K' }
                      ].map((item, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.country}</span>
                            <span className="text-sm font-bold text-blue-600">{item.avg}</span>
                          </div>
                          <span className="text-xs text-gray-600">{item.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'geographic' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Geographic Job Dashboard</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Job Distribution by Country</h3>
                    <div className="space-y-2">
                      {[
                        { country: 'Nigeria', jobs: 18456, percentage: 40 },
                        { country: 'South Africa', jobs: 12345, percentage: 27 },
                        { country: 'Kenya', jobs: 8765, percentage: 19 },
                        { country: 'Egypt', jobs: 6543, percentage: 14 },
                        { country: 'Morocco', jobs: 4321, percentage: 9 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-24">{item.country}</span>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Top Tech Hubs</h3>
                    <div className="space-y-2">
                      {[
                        { city: 'Lagos', country: 'Nigeria', jobs: 12456, companies: 892 },
                        { city: 'Johannesburg', country: 'South Africa', jobs: 8765, companies: 567 },
                        { city: 'Nairobi', country: 'Kenya', jobs: 6543, companies: 432 },
                        { city: 'Cairo', country: 'Egypt', jobs: 4567, companies: 345 },
                        { city: 'Cape Town', country: 'South Africa', jobs: 3456, companies: 234 }
                      ].map((item, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{item.city}</span>
                            <span className="text-sm text-gray-600">{item.country}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{item.jobs.toLocaleString()} jobs</span>
                            <span>{item.companies} companies</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'future' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Future Skills Dashboard</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">AI Predicted Skills Demand</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          skill: 'AI/ML', 
                          currentDemand: 67, 
                          predictedDemand: 89, 
                          timeframe: '2025-2027',
                          confidence: 'High'
                        },
                        { 
                          skill: 'TypeScript', 
                          currentDemand: 54, 
                          predictedDemand: 76, 
                          timeframe: '2024-2026',
                          confidence: 'Very High'
                        },
                        { 
                          skill: 'DevOps', 
                          currentDemand: 48, 
                          predictedDemand: 72, 
                          timeframe: '2024-2027',
                          confidence: 'High'
                        },
                        { 
                          skill: 'Cloud Computing', 
                          currentDemand: 62, 
                          predictedDemand: 85, 
                          timeframe: '2024-2026',
                          confidence: 'Very High'
                        }
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-900">{item.skill}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.confidence === 'Very High' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {item.confidence}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current Demand</span>
                              <span className="font-medium">{item.currentDemand}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Predicted Demand</span>
                              <span className="font-medium text-green-600">{item.predictedDemand}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Growth</span>
                              <span className="font-medium text-green-600">
                                +{item.predictedDemand - item.currentDemand}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              📅 {item.timeframe}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
