'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  BookOpen, 
  Target, 
  BarChart3,
  Users,
  Briefcase,
  Award,
  Clock,
  Search,
  Filter,
  Heart,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface User {
  name: string;
  careerLevel: string;
  skillsCount: number;
  profileComplete: number;
}

interface JobRecommendation {
  jobTitle: string;
  demand: number;
  avgSalary: number;
  companies: number;
  locations: number;
  _id?: string;
}

interface SkillGapAnalysis {
  hasSkills: number;
  missingSkills: string[];
  gapPercentage: number;
}

interface CareerRecommendation {
  role: string;
  readinessScore: number;
  timeline: string;
  avgSalary: number;
  growth: number;
  missingSkills: string[];
}

interface MarketTrends {
  growingSkills: string[];
  decliningSkills: string[];
  emergingTechnologies: string[];
  marketGrowth: number;
}

interface DashboardData {
  user: User;
  insights: {
    topSkills: any[];
    salaryOverview: {
      average?: number;
    };
    jobRecommendations: JobRecommendation[];
    skillGapAnalysis: SkillGapAnalysis;
    careerRecommendations: CareerRecommendation[];
    marketTrends: MarketTrends;
  };
  stats: {
    savedJobs: number;
    savedSearches: number;
    profileViews: number;
    lastLogin: string;
  };
}

interface SavedJob {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
}

interface Tab {
  id: string;
  label: string;
  icon: any;
}

export default function JobSeekerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills Analysis', icon: Target },
    { id: 'jobs', label: 'Job Explorer', icon: Briefcase },
    { id: 'salary', label: 'Salary Intelligence', icon: DollarSign },
    { id: 'roadmap', label: 'Career Roadmap', icon: BookOpen }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchSavedJobs();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDashboardData(data);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/saved-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSavedJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  };

  const saveJob = async (jobId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/save-job', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });
      
      if (response.ok) {
        fetchSavedJobs(); // Refresh saved jobs
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Profile: {dashboardData?.user?.profileComplete || 0}% Complete
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Complete Profile
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
                      ? 'border-blue-500 text-blue-600'
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
        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Skills</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.insights?.topSkills?.slice(0, 3).map(skill => skill.skill).join(', ') || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Market Growth</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.insights?.marketTrends?.marketGrowth || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${dashboardData.insights?.salaryOverview?.average?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats?.savedJobs || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Jobs Based on Your Skills
              </h3>
              <div className="space-y-4">
                {dashboardData.insights?.jobRecommendations?.map((job: JobRecommendation, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.companies} companies • {job.locations} locations
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          Avg: ${job.avgSalary?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => job._id && saveJob(job._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Skill Gap Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills You Have</h4>
                  <div className="space-y-2">
                    {dashboardData.insights?.skillGapAnalysis?.hasSkills && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{dashboardData.insights.skillGapAnalysis.hasSkills} skills</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Missing Top Skills</h4>
                  <div className="space-y-2">
                    {dashboardData.insights?.skillGapAnalysis?.missingSkills?.slice(0, 5).map((skill: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> Focus on learning {dashboardData.insights?.skillGapAnalysis?.missingSkills?.[0]} 
                  to increase your market value by {dashboardData.insights?.skillGapAnalysis?.gapPercentage || 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Job Explorer</h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
              
              {/* Job Listings */}
              <div className="space-y-4">
                {savedJobs.map((job: SavedJob, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                        <p className="text-sm text-gray-500">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {job.location}
                        </p>
                        {job.salaryMin && job.salaryMax && (
                          <p className="text-sm text-green-600 font-medium">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
              <p className="text-gray-600 mb-6">
                Compare your skills with market demand and identify growth opportunities
              </p>
              
              {/* Skills Comparison Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Current Skills vs Market Demand</h4>
                  <div className="space-y-3">
                    {dashboardData.user && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium">Total Skills</span>
                        <span className="text-sm text-gray-600">Level: {dashboardData.user.skillsCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recommended Skills to Learn</h4>
                  <div className="space-y-2">
                    {dashboardData.insights?.marketTrends?.growingSkills?.slice(0, 5).map((skill: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded">
                        <Award className="h-4 w-4 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{skill}</div>
                          <div className="text-xs text-gray-600">High demand skill</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Intelligence</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Salary by Skill</h4>
                  <div className="space-y-3">
                    {dashboardData.insights?.topSkills?.map((skill: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <span className="text-sm font-bold text-green-600">
                          ${skill.salary?.average?.toLocaleString() || '0'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Your Potential</h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        ${dashboardData.insights?.salaryOverview?.average?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-blue-700">Based on your current skills</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Roadmap</h3>
              <p className="text-gray-600 mb-6">
                Your personalized path to career advancement in African tech industry
              </p>
              
              <div className="space-y-6">
                {dashboardData.insights?.careerRecommendations?.slice(0, 3).map((career: CareerRecommendation, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">{career.role}</h4>
                      <div className="text-sm text-gray-600">
                        Timeline: {career.timeline}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <div className="text-sm font-medium text-gray-700 w-24">Readiness:</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${career.readinessScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 ml-3">
                          {career.readinessScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Avg Salary:</span>
                        <div className="text-green-600 font-bold">${career.avgSalary?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Growth:</span>
                        <div className="text-blue-600 font-bold">+{career.growth}%</div>
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
