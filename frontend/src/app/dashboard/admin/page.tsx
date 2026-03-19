'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Database, Users, Settings, BarChart3, Globe, Clock, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Download, Upload, Calendar, TrendingUp,
  Shield, Key, FileText, Activity, Zap, Server, Cpu, HardDrive, Wifi,
  Search, Filter, Edit, Trash2, Eye, Play, Pause, RotateCcw, ChevronRight,
  Menu, X, LogOut, Home, User, Briefcase, Code
} from 'lucide-react';

interface AdminStats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  activeScrapers: number;
  systemUptime: string;
  dataQuality: number;
  apiCalls: number;
  errorRate: number;
}

interface ScraperStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'scheduled';
  lastRun: string;
  nextRun: string;
  jobsCollected: number;
  errors: number;
}

interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  apiUsers: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalJobs: 45678,
    totalCompanies: 1234,
    totalUsers: 10234,
    activeScrapers: 8,
    systemUptime: '99.9%',
    dataQuality: 98.5,
    apiCalls: 125678,
    errorRate: 0.2
  });
  const [scrapers, setScrapers] = useState<ScraperStatus[]>([
    { id: '1', name: 'LinkedIn Jobs Scraper', status: 'running', lastRun: '2 mins ago', nextRun: 'In 28 mins', jobsCollected: 1250, errors: 0 },
    { id: '2', name: 'Indeed Jobs Scraper', status: 'scheduled', lastRun: '1 hour ago', nextRun: 'In 59 mins', jobsCollected: 890, errors: 2 },
    { id: '3', name: 'Glassdoor Scraper', status: 'error', lastRun: '3 hours ago', nextRun: 'Manual', jobsCollected: 0, errors: 5 },
    { id: '4', name: 'CareerJet Scraper', status: 'stopped', lastRun: '6 hours ago', nextRun: 'Manual', jobsCollected: 445, errors: 1 }
  ]);
  const [userManagement, setUserManagement] = useState<UserManagement>({
    totalUsers: 10234,
    activeUsers: 8456,
    newUsersToday: 23,
    apiUsers: 156
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (parsedUser.userType !== 'admin') {
          router.push('/dashboard/jobseeker');
        }
      } else {
        router.push('/login');
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [router]);

  // Fetch data from backend
  useEffect(() => {
    if (!user) return;

    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // Fetch overview stats
        const overviewResponse = await fetch('http://localhost:5000/api/admin/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (overviewResponse.ok) {
          const overviewData = await overviewResponse.json();
          setStats(overviewData);
        }

        // Fetch scraper status
        const scrapersResponse = await fetch('http://localhost:5000/api/admin/scrapers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (scrapersResponse.ok) {
          const scrapersData = await scrapersResponse.json();
          setScrapers(scrapersData);
        }

        // Fetch user management data
        const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUserManagement({
            totalUsers: usersData.totalUsers,
            activeUsers: usersData.activeUsers,
            newUsersToday: usersData.newUsersToday,
            apiUsers: usersData.apiUsers
          });
        }

      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleScraperAction = async (scraperId: string, action: string) => {
    const token = localStorage.getItem('token');
    
    try {
      // First check current scraper status
      const statusResponse = await fetch(`http://localhost:5000/api/admin/scrapers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statusResponse.ok) {
        const scrapersData = await statusResponse.json();
        const scraper = scrapersData.find((s: any) => s.id === scraperId);
        
        if (!scraper) {
          console.error('Scraper not found:', scraperId);
          return;
        }
        
        // Check if action is valid for current status
        if (action === 'pause' && scraper.status !== 'running') {
          console.error('Cannot pause scraper - it is not running. Current status:', scraper.status);
          return;
        }
        
        if (action === 'resume' && scraper.status === 'running') {
          console.error('Cannot resume scraper - it is already running. Current status:', scraper.status);
          return;
        }
        
        if (action === 'stop' && scraper.status !== 'running') {
          console.error('Cannot stop scraper - it is not running. Current status:', scraper.status);
          return;
        }
        
        // Proceed with action
        const response = await fetch(`http://localhost:5000/api/admin/scrapers/${scraperId}/${action}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          
          // Refresh scraper data
          const scrapersResponse = await fetch('http://localhost:5000/api/admin/scrapers', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (scrapersResponse.ok) {
            const scrapersData = await scrapersResponse.json();
            setScrapers(scrapersData);
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to perform scraper action:', errorData.message || 'Unknown error');
        }
      } else {
        console.error('Failed to fetch scraper status');
      }
    } catch (error) {
      console.error('Scraper action error:', error);
    }
  };

  const handleDataQualityCheck = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/data-quality/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        console.error('Failed to start data quality check');
      }
    } catch (error) {
      console.error('Data quality check error:', error);
    }
  };

  const handleExportUsers = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/users/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        
        // Create and download CSV file
        const csv = [
          ['Email', 'User Type', 'First Name', 'Last Name', 'Created At', 'Last Login'],
          ...result.data.map((user: any) => [
            user.email,
            user.userType,
            user.firstName,
            user.lastName,
            user.createdAt,
            user.lastLogin
          ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export users');
      }
    } catch (error) {
      console.error('Export users error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4" />;
      case 'stopped': return <Pause className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalJobs.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Jobs Collected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCompanies.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Companies Tracked</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Registered Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeScrapers}</h3>
          <p className="text-sm text-gray-600">Active Scrapers</p>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">System Uptime</span>
              <span className="text-sm font-bold text-green-600">{stats.systemUptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Data Quality Score</span>
              <span className="text-sm font-bold text-blue-600">{stats.dataQuality}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">API Calls Today</span>
              <span className="text-sm font-bold text-purple-600">{stats.apiCalls.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Error Rate</span>
              <span className="text-sm font-bold text-red-600">{stats.errorRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">LinkedIn scraper completed successfully</span>
              <span className="text-xs text-gray-500">2 mins ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Glassdoor scraper encountered errors</span>
              <span className="text-xs text-gray-500">15 mins ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">New user registration spike detected</span>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Data quality check completed</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScraperManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Scraper Management</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Run All Scrapers
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scraper</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scrapers.map((scraper) => (
                <tr key={scraper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{scraper.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scraper.status)}`}>
                      {getStatusIcon(scraper.status)}
                      <span className="ml-1">{scraper.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scraper.lastRun}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scraper.nextRun}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scraper.jobsCollected.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${scraper.errors > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                      {scraper.errors}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleScraperAction(scraper.id, 'run')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Run Scraper"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleScraperAction(scraper.id, 'stop')}
                        className="text-gray-600 hover:text-gray-900"
                        title="Stop Scraper"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleScraperAction(scraper.id, 'restart')}
                        className="text-orange-600 hover:text-orange-900"
                        title="Restart Scraper"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        title="View Logs"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDataQuality = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Data Quality Control</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleDataQualityCheck}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Quality Check
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Duplicate Detection</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Potential Duplicates</span>
              <span className="text-sm font-bold text-orange-600">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Confirmed Duplicates</span>
              <span className="text-sm font-bold text-red-600">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-Resolved</span>
              <span className="text-sm font-bold text-green-600">189</span>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Review Duplicates
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Validation</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Jobs Validated</span>
              <span className="text-sm font-bold text-green-600">{(stats.totalJobs * 0.95).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Missing Data</span>
              <span className="text-sm font-bold text-orange-600">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Invalid Format</span>
              <span className="text-sm font-bold text-red-600">89</span>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Fix Issues
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Spam Detection</h3>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Flagged as Spam</span>
              <span className="text-sm font-bold text-red-600">67</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Confirmed Spam</span>
              <span className="text-sm font-bold text-red-600">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">False Positives</span>
              <span className="text-sm font-bold text-orange-600">12</span>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
            Review Spam
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button 
            onClick={handleExportUsers}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{userManagement.totalUsers.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">82%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{userManagement.activeUsers.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{userManagement.newUsersToday}</h3>
          <p className="text-sm text-gray-600">New Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Key className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">API</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{userManagement.apiUsers}</h3>
          <p className="text-sm text-gray-600">API Users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Types Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Job Seekers</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-sm text-gray-900">6,502</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Recruiters</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-sm text-gray-900">2,558</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Researchers</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
              <span className="text-sm text-gray-900">819</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Developers</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
              <span className="text-sm text-gray-900">205</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Admins</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '0.5%' }}></div>
              </div>
              <span className="text-sm text-gray-900">150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatasetManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dataset Management</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Dataset
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-run Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Jobs Dataset</h4>
                <p className="text-xs text-gray-500">Last updated: 2 hours ago</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</span>
                <p className="text-xs text-gray-500">records</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Companies Dataset</h4>
                <p className="text-xs text-gray-500">Last updated: 6 hours ago</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{stats.totalCompanies.toLocaleString()}</span>
                <p className="text-xs text-gray-500">records</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Skills Dataset</h4>
                <p className="text-xs text-gray-500">Last updated: 1 day ago</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">1,234</span>
                <p className="text-xs text-gray-500">records</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Status</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Salary Prediction Model</h4>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Accuracy: 94.2% | Last trained: 3 days ago</p>
              <button className="text-xs text-green-600 hover:text-green-700">Retrain Model</button>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Skill Demand Model</h4>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Accuracy: 91.8% | Last trained: 1 week ago</p>
              <button className="text-xs text-green-600 hover:text-green-700">Retrain Model</button>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Career Path Model</h4>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Training</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Progress: 67% | Est. completion: 2 hours</p>
              <button className="text-xs text-orange-600 hover:text-orange-700">View Progress</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'scrapers': return renderScraperManagement();
      case 'data-quality': return renderDataQuality();
      case 'users': return renderUserManagement();
      case 'datasets': return renderDatasetManagement();
      default: return renderOverview();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 text-sm text-gray-500">Platform Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.profile?.firstName || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('scrapers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scrapers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Server className="h-4 w-4 mr-2" />
                Scrapers
              </div>
            </button>
            <button
              onClick={() => setActiveTab('data-quality')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'data-quality'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Data Quality
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('datasets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'datasets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Datasets
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
