'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Building,
  Search,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  Award,
  Globe,
  PieChart
} from 'lucide-react';

interface Skill {
  skill: string;
  demand: number;
  growth: string;
}

interface JobRole {
  role: string;
  count: number;
  avgSalary: string;
  growth: string;
}

interface Company {
  company: string;
  openPositions: number;
  growth: string;
  topSkills: string[];
  avgSalary: string;
}

interface Country {
  country: string;
  talent: number;
  topSkills: string[];
}

interface RecruiterData {
  talent: {
    availableTalent: number;
    topSkills: Skill[];
    talentByCountry: Country[];
  };
  hiring: {
    trends: JobRole[];
    growth: number;
    activePostings: number;
    timeToFill: number;
  };
  benchmarking: {
    salaryBySkill: any[];
    marketRates: any[];
  };
  competitors: {
    topHiringCompanies: Company[];
    marketLeaders: Company[];
  };
  forecasts: {
    skillDemand: Array<{
      skill: string;
      growth: string;
      shortage: string;
    }>;
  };
}

interface Filters {
  skill: string;
  country: string;
  experience: string;
  salaryRange: string;
}

interface Tab {
  id: string;
  label: string;
  icon: any;
}

export default function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState<RecruiterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('talent');
  const [filters, setFilters] = useState<Filters>({
    skill: '',
    country: '',
    experience: '',
    salaryRange: ''
  });

  const tabs: Tab[] = [
    { id: 'talent', label: 'Talent Insights', icon: Users },
    { id: 'benchmarking', label: 'Salary Benchmarking', icon: DollarSign },
    { id: 'hiring', label: 'Hiring Trends', icon: TrendingUp },
    { id: 'competitors', label: 'Competitor Analysis', icon: Building }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/recruiter-overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Recruiter Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Talent intelligence and hiring insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Post New Job
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab: Tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Talent Insights Tab */}
        {activeTab === 'talent' && dashboardData && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Talent</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.talent.availableTalent.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+15.3% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Skills</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.talent.topSkills.slice(0, 2).map(skill => skill.skill).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">In high demand</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Countries</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.talent.talentByCountry.length}</p>
                    <p className="text-xs text-green-600">+2 new markets</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                    <p className="text-2xl font-bold text-gray-900">4.2 yrs</p>
                    <p className="text-xs text-green-600">+0.3 vs last year</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Job Roles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Most Popular Job Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.hiring.trends.map((role: JobRole, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">{role.role}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Openings:</span>
                        <span className="font-medium">{role.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Salary:</span>
                        <span className="font-medium text-green-600">{role.avgSalary}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-medium text-blue-600">{role.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Salary Benchmarking Tab */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Salary Benchmarking Tool
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Select skill...</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>React</option>
                    <option>AWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>All Countries</option>
                    <option>Nigeria</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>Ghana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>All Levels</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior</option>
                    <option>Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>All Roles</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist</option>
                    <option>DevOps Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Average Salary by Skill
                </h4>
                <div className="space-y-3">
                  {[
                    { skill: 'Python', avg: '$85,000', range: '$60K - $120K', trend: '+12%' },
                    { skill: 'JavaScript', avg: '$75,000', range: '$50K - $100K', trend: '+8%' },
                    { skill: 'React', avg: '$78,000', range: '$55K - $105K', trend: '+15%' },
                    { skill: 'AWS', avg: '$95,000', range: '$70K - $130K', trend: '+20%' },
                    { skill: 'Docker', avg: '$82,000', range: '$60K - $110K', trend: '+18%' }
                  ].map((item, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{item.skill}</span>
                        <span className="text-sm font-medium text-green-600">{item.trend}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Average: <span className="font-medium text-gray-900">{item.avg}</span></div>
                        <div>Range: <span className="text-gray-700">{item.range}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Salary Trends Over Time
                </h4>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive salary trend chart</p>
                    <p className="text-sm">Monthly salary changes by skill</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hiring Trends Tab */}
        {activeTab === 'hiring' && dashboardData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hiring Growth</p>
                    <p className="text-2xl font-bold text-gray-900">+{dashboardData.hiring.growth}%</p>
                    <p className="text-xs text-green-600">This quarter</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Postings</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.hiring.activePostings.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+342 this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Companies Hiring</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.competitors.topHiringCompanies.length}</p>
                    <p className="text-xs text-green-600">+89 new companies</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Time to Fill</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.hiring.timeToFill} days</p>
                    <p className="text-xs text-red-600">-5 days vs last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitor Analysis Tab */}
        {activeTab === 'competitors' && dashboardData && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Most Active Tech Companies
              </h3>
              <div className="space-y-4">
                {dashboardData.competitors.topHiringCompanies.map((company: Company, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{company.company}</h4>
                        <p className="text-sm text-gray-600">{company.openPositions} open positions</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-600">{company.growth}</span>
                        <p className="text-sm text-gray-600">vs last month</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Top Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {company.topSkills.slice(0, 3).map((skill: string, skillIndex: number) => (
                            <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Salary:</span>
                        <div className="font-medium text-green-600">{company.avgSalary}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Hiring Trend:</span>
                        <div className="font-medium text-blue-600">Growing</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
