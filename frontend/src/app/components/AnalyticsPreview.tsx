'use client';

import { Target, DollarSign, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPreview() {
  const router = useRouter();

  const skillsData = [
    { name: 'Python', demand: 89, growth: '+18%', color: 'bg-blue-500' },
    { name: 'JavaScript', demand: 76, growth: '+12%', color: 'bg-yellow-500' },
    { name: 'React', demand: 68, growth: '+22%', color: 'bg-cyan-500' },
    { name: 'AWS', demand: 54, growth: '+31%', color: 'bg-orange-500' },
    { name: 'Docker', demand: 48, growth: '+15%', color: 'bg-blue-600' }
  ];

  const salaryData = [
    { role: 'Full Stack', avg: 75000, range: [60000, 95000], growth: '+12%' },
    { role: 'Data Scientist', avg: 85000, range: [70000, 110000], growth: '+25%' },
    { role: 'DevOps', avg: 90000, range: [75000, 120000], growth: '+18%' },
    { role: 'Frontend', avg: 65000, range: [50000, 85000], growth: '+8%' },
    { role: 'Backend', avg: 70000, range: [55000, 90000], growth: '+10%' }
  ];

  const countryData = [
    { country: 'Nigeria', percentage: 45, jobs: 20555, color: 'bg-green-500' },
    { country: 'Kenya', percentage: 25, jobs: 11420, color: 'bg-blue-500' },
    { country: 'South Africa', percentage: 20, jobs: 9136, color: 'bg-purple-500' },
    { country: 'Egypt', percentage: 10, jobs: 4568, color: 'bg-orange-500' }
  ];

  return (
    <section id="analytics" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore real-time job market data with our interactive analytics dashboard
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Skills Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Top Skills in Africa</h3>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>
            </div>

            <div className="space-y-4">
              {skillsData.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-green-600">{skill.growth}</span>
                      <span className="text-xs text-gray-500">{skill.demand}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${skill.demand}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/demo')}
              className="mt-6 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Detailed Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Salary Trends Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Salary Trends by Role</h3>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">USD</span>
            </div>

            <div className="space-y-4">
              {salaryData.map((role, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{role.role}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-green-600">{role.growth}</span>
                      <span className="text-sm font-bold text-green-700">${role.avg.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">${role.range[0].toLocaleString()}K</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                        style={{ width: `${((role.avg - role.range[0]) / (role.range[1] - role.range[0])) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">${role.range[1].toLocaleString()}K</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/demo')}
              className="mt-6 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              Explore Salary Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Job Distribution Map */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Job Distribution</h3>
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">45K+ Jobs</span>
            </div>

            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{country.country}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{country.percentage}%</span>
                      <span className="text-sm font-bold text-purple-700">{country.jobs.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${country.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/demo')}
              className="mt-6 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              View Geographic Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">45,678</div>
            <div className="text-sm text-gray-600">Active Job Postings</div>
            <div className="text-xs text-green-600 mt-1">+12.3% this month</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">1,234</div>
            <div className="text-sm text-gray-600">Hiring Companies</div>
            <div className="text-xs text-green-600 mt-1">+8.7% this month</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-sm text-gray-600">African Countries</div>
            <div className="text-xs text-green-600 mt-1">+2 new markets</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
        </div>
      </div>
    </section>
  );
}
