'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter,
  TrendingUp,
  Database,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Settings,
  FileText,
  Globe,
  PieChart,
  LineChart
} from 'lucide-react';

interface Dataset {
  totalRecords: number;
  lastUpdated: Date;
  size: string;
}

interface Metrics {
  marketGrowth: number;
  hiringGrowth: number;
  salaryGrowth: number;
  newCompanies: number;
}

interface OverviewData {
  overview: {
    totalJobs: number;
    totalCompanies: number;
    topSkills: any[];
    salaryAnalytics: any;
    jobTrends: any[];
    countryDistribution: any[];
    skillGrowth: any[];
  };
  datasets: {
    jobs: Dataset;
    skills: Dataset;
    salaries: Dataset;
  };
  metrics: Metrics;
}

interface Filters {
  country: string;
  skill: string;
  dateRange: string;
  industry: string;
}

interface Tab {
  id: string;
  label: string;
  icon: any;
}

export default function DataAnalystDashboard() {
  const [dashboardData, setDashboardData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filters, setFilters] = useState<Filters>({
    country: '',
    skill: '',
    dateRange: '6months',
    industry: ''
  });
  const [exportFormat, setExportFormat] = useState<string>('csv');

  const tabs: Tab[] = [
    { id: 'overview', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'datasets', label: 'Dataset Explorer', icon: Database },
    { id: 'charts', label: 'Custom Charts', icon: LineChart },
    { id: 'api', label: 'API Access', icon: Settings }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/analyst-overview', {
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

  const exportData = async (dataset: string, format: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/data/export?dataset=${dataset}&format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataset}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-purple-600"></div>
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
              <Database className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Data Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Advanced job market intelligence and research tools
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="excel">Excel</option>
              </select>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Export
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
                      ? 'border-purple-500 text-purple-600'
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Job Postings</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalJobs.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12.3% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Companies</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalCompanies.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+8.7% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Skill Demand Growth</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.marketGrowth}%</p>
                    <p className="text-xs text-green-600">Year over year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Salary Change</p>
                    <p className="text-2xl font-bold text-gray-900">+{dashboardData.metrics.salaryGrowth}%</p>
                    <p className="text-xs text-green-600">This quarter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top 10 Tech Skills Demand
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive chart visualization</p>
                    <p className="text-sm">Skill demand over time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Salary Distribution by Country
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive pie chart</p>
                    <p className="text-sm">Salary ranges by region</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === 'datasets' && dashboardData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Job Dataset</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <span className="font-medium">{dashboardData.datasets.jobs.totalRecords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
                <button 
                  onClick={() => exportData('jobs', exportFormat)}
                  className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as {exportFormat.toUpperCase()}
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Skills Dataset</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Skills</span>
                    <span className="font-medium">{dashboardData.datasets.skills.totalRecords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">1 day ago</span>
                  </div>
                </div>
                <button 
                  onClick={() => exportData('skills', exportFormat)}
                  className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
