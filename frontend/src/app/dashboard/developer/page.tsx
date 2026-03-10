'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Database, 
  Key, 
  Clock, 
  FileText, 
  Code, 
  BarChart3, 
  Users, 
  Settings 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DeveloperDashboard() {
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
    if (parsedUser.userType !== 'developer') {
      router.push('/dashboard');
      return;
    }

    setUserData(parsedUser);
    setLoading(false);
  }, [router]);

  const getJobs = async () => {
    try {
      const response = await fetch('/api/jobs?location=nigeria&limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading developer dashboard...</p>
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
              Your API access and development tools
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">API Calls</p>
                  <p className="text-2xl font-bold text-gray-900">12.5K</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">45.6K</p>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Key className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">API Key</p>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="text-xs text-gray-600">Until Dec 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Requests</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                  <p className="text-xs text-gray-600">This month</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">API Endpoints</h2>
                <Code className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900">GET /api/jobs</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Fetch job listings with filters</p>
                  <div className="text-xs text-gray-500">
                    <p><strong>Parameters:</strong> location, skill, limit</p>
                    <p><strong>Example:</strong> GET /api/jobs?location=nigeria&skill=javascript&limit=10</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900">GET /api/salaries</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Get salary insights by role and location</p>
                  <div className="text-xs text-gray-500">
                    <p><strong>Parameters:</strong> role, location, experience</p>
                    <p><strong>Example:</strong> GET /api/salaries?role=senior&location=lagos</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900">GET /api/trends</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Access market trend analysis</p>
                  <div className="text-xs text-gray-500">
                    <p><strong>Parameters:</strong> metric, timeframe, region</p>
                    <p><strong>Example:</strong> GET /api/trends?metric=demand&timeframe=90d</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Production Key</h3>
                    <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200">Regenerate</button>
                  </div>
                  <code className="text-xs bg-gray-100 p-2 rounded text-gray-700 break-all">sk_live_4f2a8b9c1d7e3f6a9b2c8d9e5f</code>
                  <p className="text-xs text-gray-500 mt-2">Expires: Dec 31, 2025</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Development Key</h3>
                    <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200">Regenerate</button>
                  </div>
                  <code className="text-xs bg-gray-100 p-2 rounded text-gray-700 break-all">sk_dev_9c2d7e4f8a3b1c6d9e2f7a8b0c</code>
                  <p className="text-xs text-gray-500 mt-2">Expires: Dec 31, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Code Examples</h2>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">JavaScript</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{`const response = await fetch('/api/jobs?location=nigeria&limit=10', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Python</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.african-job-market.com/jobs?location=kenya&limit=10', headers=headers)
data = response.json()`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Developer Support</h2>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium text-sm">
                📚 API Documentation
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium text-sm">
                💬 Developer Community
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium text-sm">
                🐛 Report Issue
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium text-sm">
                📧 Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
