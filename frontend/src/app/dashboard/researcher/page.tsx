'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Download, Database, Search, Filter, FileText, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ResearcherDashboard() {
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
    if (parsedUser.userType !== 'researcher') {
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
              Your advanced analytics dashboard and research tools
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">45.6K</p>
                  <p className="text-xs text-green-600">Updated daily</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Queries</p>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-xs text-gray-600">This month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Data Exports</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-xs text-gray-600">CSV/JSON files</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reports</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                  <p className="text-xs text-gray-600">Generated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Dataset Explorer */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dataset Explorer */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Dataset Explorer</h2>
                  <Database className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="mb-6">
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search datasets..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                      All Categories
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
                      Jobs
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                      Skills
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                      Salaries
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                      Companies
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Job Postings Dataset',
                      description: 'Complete job listings with skills, salary, and location data',
                      size: '2.3GB',
                      records: '45,678',
                      lastUpdated: '2024-03-07',
                      format: 'CSV, JSON'
                    },
                    {
                      name: 'Skills Demand Analytics',
                      description: 'Real-time skill demand trends across industries and locations',
                      size: '156MB',
                      records: '8,234',
                      lastUpdated: '2024-03-07',
                      format: 'CSV, JSON'
                    },
                    {
                      name: 'Salary Benchmark Data',
                      description: 'Comprehensive salary data by role, experience, and location',
                      size: '89MB',
                      records: '12,456',
                      lastUpdated: '2024-03-06',
                      format: 'CSV, JSON'
                    },
                    {
                      name: 'Company Intelligence',
                      description: 'Company profiles, hiring patterns, and market position',
                      size: '234MB',
                      records: '3,456',
                      lastUpdated: '2024-03-05',
                      format: 'CSV, JSON'
                    },
                    {
                      name: 'Market Trends Historical',
                      description: '5-year historical data on job market trends and predictions',
                      size: '567MB',
                      records: '67,890',
                      lastUpdated: '2024-03-07',
                      format: 'CSV, JSON'
                    }
                  ].map((dataset, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
                        </div>
                        <button className="ml-4 text-blue-600 hover:text-blue-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{dataset.size}</span>
                        <span>•</span>
                        <span>{dataset.records} records</span>
                        <span>•</span>
                        <span>Updated {dataset.lastUpdated}</span>
                        <span>•</span>
                        <span>{dataset.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Trend Analysis</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">Remote Work Growth</span>
                          <span className="text-sm text-green-600">+42%</span>
                        </div>
                        <p className="text-xs text-gray-600">Year-over-year increase in remote job postings</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">AI Skills Demand</span>
                          <span className="text-sm text-green-600">+67%</span>
                        </div>
                        <p className="text-xs text-gray-600">Growth in AI/ML related skill requirements</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">FinTech Hiring</span>
                          <span className="text-sm text-green-600">+35%</span>
                        </div>
                        <p className="text-xs text-gray-600">Increase in financial technology sector hiring</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Market Correlations</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">Skills vs Salary</span>
                          <span className="text-sm text-blue-600">0.87</span>
                        </div>
                        <p className="text-xs text-gray-600">Strong correlation between skill level and compensation</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">Location vs Demand</span>
                          <span className="text-sm text-blue-600">0.72</span>
                        </div>
                        <p className="text-xs text-gray-600">Geographic impact on job demand</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">Experience vs Opportunities</span>
                          <span className="text-sm text-blue-600">0.65</span>
                        </div>
                        <p className="text-xs text-gray-600">Experience level impact on available positions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Custom Charts & Tools */}
            <div className="space-y-8">
              {/* Custom Chart Builder */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Custom Charts</h2>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Line Chart</option>
                      <option>Bar Chart</option>
                      <option>Pie Chart</option>
                      <option>Scatter Plot</option>
                      <option>Heat Map</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Time Period</option>
                      <option>Location</option>
                      <option>Skill Category</option>
                      <option>Experience Level</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Job Count</option>
                      <option>Average Salary</option>
                      <option>Skill Demand</option>
                      <option>Growth Rate</option>
                    </select>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Generate Chart
                  </button>
                </div>
              </div>

              {/* Recent Queries */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Queries</h2>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {[
                    { query: 'Python demand by location', time: '2 hours ago', results: '1,234' },
                    { query: 'Remote work salary trends', time: '5 hours ago', results: '856' },
                    { query: 'FinTech skills analysis', time: '1 day ago', results: '2,456' },
                    { query: 'Junior developer market', time: '2 days ago', results: '3,789' },
                    { query: 'Nigeria tech ecosystem', time: '3 days ago', results: '5,678' }
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.query}</p>
                          <p className="text-xs text-gray-600">{item.time} • {item.results} results</p>
                        </div>
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Tools */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Export Tools</h2>
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <button className="w-full text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Export Current Dataset</p>
                        <p className="text-xs text-green-700">CSV or JSON format</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">Generate Report</p>
                        <p className="text-xs text-blue-700">PDF with insights</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 transition-colors">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-purple-900">API Access</p>
                        <p className="text-xs text-purple-700">Get API key</p>
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
