'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, DollarSign, Search, Brain, Target, Briefcase, Users, FileText, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function JobSeekerDashboard() {
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
    if (parsedUser.userType !== 'jobseeker') {
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
              Your personalized career insights and job market analytics
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Market Trend</p>
                  <p className="text-2xl font-bold text-gray-900">+18%</p>
                  <p className="text-xs text-green-600">Growing demand</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                  <p className="text-2xl font-bold text-gray-900">$75K</p>
                  <p className="text-xs text-gray-600">For your skills</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                  <p className="text-xs text-gray-600">This week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AI Score</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                  <p className="text-xs text-gray-600">Profile strength</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Skills & Analytics */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Market Insights */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Job Market Insights</h2>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Top Demanded Tech Skills</h3>
                    <div className="space-y-2">
                      {[
                        { skill: 'JavaScript', demand: 89, change: '+12%' },
                        { skill: 'Python', demand: 76, change: '+18%' },
                        { skill: 'React', demand: 68, change: '+22%' },
                        { skill: 'TypeScript', demand: 54, change: '+35%' },
                        { skill: 'Node.js', demand: 48, change: '+15%' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">{item.demand}% demand</span>
                            <span className={`text-xs font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {item.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Fastest Growing Technologies</h3>
                    <div className="space-y-2">
                      {[
                        { tech: 'AI/ML', growth: '+67%', jobs: '2,341' },
                        { tech: 'TypeScript', growth: '+35%', jobs: '1,876' },
                        { tech: 'React', growth: '+22%', jobs: '3,234' },
                        { tech: 'Docker', growth: '+28%', jobs: '1,456' },
                        { tech: 'GraphQL', growth: '+41%', jobs: '567' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{item.tech}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-green-600 font-medium">{item.growth}</span>
                            <span className="text-xs text-gray-600">{item.jobs} jobs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Intelligence */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Salary Intelligence</h2>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Average Salary by Skill</h3>
                    <div className="space-y-2">
                      {[
                        { skill: 'Python', avg: '$85K', range: '$65K-$110K' },
                        { skill: 'React', avg: '$75K', range: '$60K-$95K' },
                        { skill: 'DevOps', avg: '$90K', range: '$75K-$120K' },
                        { skill: 'AI/ML', avg: '$95K', range: '$80K-$130K' },
                        { skill: 'JavaScript', avg: '$70K', range: '$55K-$90K' }
                      ].map((item, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.skill}</span>
                            <span className="text-sm font-bold text-green-600">{item.avg}</span>
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
                        { country: 'South Africa', avg: '$72K', currency: 'ZAR' },
                        { country: 'Nigeria', avg: '$48K', currency: 'NGN' },
                        { country: 'Kenya', avg: '$42K', currency: 'KES' },
                        { country: 'Egypt', avg: '$36K', currency: 'EGP' },
                        { country: 'Morocco', avg: '$38K', currency: 'MAD' }
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
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Highest Paying Skills</h3>
                    <div className="space-y-2">
                      {[
                        { skill: 'Machine Learning', salary: '$110K', premium: '+45%' },
                        { skill: 'DevOps', salary: '$95K', premium: '+35%' },
                        { skill: 'Cloud Architecture', salary: '$105K', premium: '+40%' },
                        { skill: 'Blockchain', salary: '$92K', premium: '+30%' },
                        { skill: 'Cybersecurity', salary: '$88K', premium: '+25%' }
                      ].map((item, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.skill}</span>
                            <span className="text-sm font-bold text-purple-600">{item.salary}</span>
                          </div>
                          <span className="text-xs text-green-600">{item.premium} above avg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Roadmaps */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Career Roadmaps</h2>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Frontend Developer',
                      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind'],
                      avgSalary: '$70K',
                      timeToLearn: '6-12 months',
                      demand: 'High'
                    },
                    {
                      title: 'Backend Developer',
                      skills: ['Node.js', 'Python', 'Databases', 'APIs', 'Cloud'],
                      avgSalary: '$75K',
                      timeToLearn: '8-14 months',
                      demand: 'Very High'
                    },
                    {
                      title: 'Data Scientist',
                      skills: ['Python', 'Statistics', 'ML', 'Pandas', 'NumPy'],
                      avgSalary: '$85K',
                      timeToLearn: '12-18 months',
                      demand: 'High'
                    },
                    {
                      title: 'DevOps Engineer',
                      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud', 'Linux'],
                      avgSalary: '$90K',
                      timeToLearn: '10-16 months',
                      demand: 'Very High'
                    },
                    {
                      title: 'AI Engineer',
                      skills: ['Python', 'TensorFlow', 'NLP', 'Deep Learning', 'MLOps'],
                      avgSalary: '$95K',
                      timeToLearn: '18-24 months',
                      demand: 'Explosive'
                    },
                    {
                      title: 'Mobile Developer',
                      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'TypeScript'],
                      avgSalary: '$68K',
                      timeToLearn: '8-12 months',
                      demand: 'High'
                    }
                  ].map((career, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">{career.title}</h3>
                      <div className="text-sm text-gray-600 mb-3">
                        <div>💰 {career.avgSalary} avg</div>
                        <div>⏱️ {career.timeToLearn}</div>
                        <div>📈 {career.demand} demand</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {career.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {career.skills.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{career.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h2>
                  <Brain className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="mb-6">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Data Scientist</option>
                    <option>DevOps Engineer</option>
                    <option>AI Engineer</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-green-700 mb-3">✅ Your Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'HTML', 'CSS', 'React'].map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-red-700 mb-3">❌ Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'].map((skill, index) => (
                        <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Job Predictions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Future Job Predictions</h2>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      prediction: 'Python demand expected to grow 40% in Africa',
                      confidence: 'High',
                      timeframe: '2025-2027',
                      impact: '2,500 new jobs'
                    },
                    {
                      prediction: 'AI Engineer jobs expected to double by 2027',
                      confidence: 'Very High',
                      timeframe: '2024-2027',
                      impact: '1,800 new jobs'
                    },
                    {
                      prediction: 'Remote work opportunities to increase 35%',
                      confidence: 'High',
                      timeframe: '2024-2026',
                      impact: '5,000+ remote positions'
                    },
                    {
                      prediction: 'FinTech hiring to surge 50% in Nigeria',
                      confidence: 'Medium',
                      timeframe: '2025-2026',
                      impact: '1,200 new roles'
                    },
                    {
                      prediction: 'DevOps skills demand to grow 60%',
                      confidence: 'High',
                      timeframe: '2024-2027',
                      impact: '3,000 new positions'
                    }
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">{item.prediction}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.confidence === 'Very High' ? 'bg-green-100 text-green-700' :
                          item.confidence === 'High' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.confidence}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>📅 {item.timeframe}</span>
                        <span>💼 {item.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Explorer */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Job Explorer</h2>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Countries</option>
                      <option>Nigeria</option>
                      <option>South Africa</option>
                      <option>Kenya</option>
                      <option>Egypt</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Skills</option>
                      <option>JavaScript</option>
                      <option>Python</option>
                      <option>React</option>
                      <option>Node.js</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Salaries</option>
                      <option>$0-$50K</option>
                      <option>$50K-$75K</option>
                      <option>$75K-$100K</option>
                      <option>$100K+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Senior React Developer',
                      company: 'TechCorp Africa',
                      location: 'Lagos, Nigeria',
                      salary: '$75K-$95K',
                      type: 'Full-time',
                      remote: 'Remote allowed',
                      skills: ['React', 'TypeScript', 'Node.js'],
                      posted: '2 days ago',
                      match: '92%'
                    },
                    {
                      title: 'Full Stack JavaScript Developer',
                      company: 'FinTech Innovations',
                      location: 'Nairobi, Kenya',
                      salary: '$60K-$80K',
                      type: 'Full-time',
                      remote: 'Remote',
                      skills: ['JavaScript', 'React', 'MongoDB'],
                      posted: '1 week ago',
                      match: '88%'
                    },
                    {
                      title: 'Python Data Scientist',
                      company: 'DataAnalytics Pro',
                      location: 'Johannesburg, South Africa',
                      salary: '$85K-$110K',
                      type: 'Full-time',
                      remote: 'Hybrid',
                      skills: ['Python', 'Machine Learning', 'Pandas'],
                      posted: '3 days ago',
                      match: '85%'
                    },
                    {
                      title: 'Frontend Developer',
                      company: 'Digital Agency Hub',
                      location: 'Cairo, Egypt',
                      salary: '$45K-$65K',
                      type: 'Full-time',
                      remote: 'On-site',
                      skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
                      posted: '5 days ago',
                      match: '82%'
                    }
                  ].map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm font-medium text-green-600">{job.salary}</span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1">{job.type}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1">{job.remote}</span>
                            <span className="text-xs text-gray-500">{job.posted}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            {job.match} match
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Load more jobs →
                </button>
              </div>
            </div>

            {/* Right Column - AI Recommendations & Saved Items */}
            <div className="space-y-8">
              {/* AI Career Advisor */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">AI Career Advisor</h2>
                  <Brain className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">🎯 Career Recommendation</h3>
                  <p className="text-blue-800 text-sm">
                    Based on your skills and market trends, consider focusing on React and TypeScript. 
                    These skills show 18-22% growth and align with your current experience level.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Learn TypeScript</p>
                      <p className="text-sm text-gray-600">22% market growth, complements your React skills</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Advanced React Patterns</p>
                      <p className="text-sm text-gray-600">18% growth, high demand for senior roles</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Node.js Backend</p>
                      <p className="text-sm text-gray-600">15% growth, full-stack opportunities</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = '/career-advisor'}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Get Full AI Analysis →
                </button>
              </div>

              {/* Resume Analyzer */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Resume Analyzer</h2>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-green-900 mb-2">📄 Analyze Your Resume</h3>
                  <p className="text-green-800 text-sm">
                    Upload your resume for AI-powered analysis. Get scored against market requirements and receive personalized recommendations.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resume Score</span>
                    <span className="text-sm font-medium text-green-600">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Job Matches</span>
                    <span className="text-sm font-medium text-blue-600">4 opportunities</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Missing Skills</span>
                    <span className="text-sm font-medium text-orange-600">3 identified</span>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = '/resume-analyzer'}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Analyze Resume →
                </button>
              </div>

              {/* Skills Heatmap */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skills Heatmap</h2>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-purple-900 mb-2">🗺️ Geographic Intelligence</h3>
                  <p className="text-purple-800 text-sm">
                    Explore skill demand across African countries. Discover which technologies are in demand in different markets.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Top Skills in Nigeria</span>
                    <span className="text-sm font-medium text-blue-600">Python, React</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Highest Growth</span>
                    <span className="text-sm font-medium text-green-600">TypeScript +38%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Countries Tracked</span>
                    <span className="text-sm font-medium text-purple-600">15 markets</span>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = '/skills-heatmap'}
                  className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
                >
                  Explore Heatmap →
                </button>
              </div>

              {/* AI Skill Recommendations */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">AI Skill Recommendations</h2>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      skill: 'TypeScript',
                      reason: '22% growth, complements your React skills',
                      priority: 'High',
                      timeToLearn: '2-3 months',
                      value: '+$15K salary potential'
                    },
                    {
                      skill: 'Docker',
                      reason: '28% growth, essential for modern development',
                      priority: 'Medium',
                      timeToLearn: '1-2 months',
                      value: '+$12K salary potential'
                    },
                    {
                      skill: 'GraphQL',
                      reason: '41% growth, future of API development',
                      priority: 'Medium',
                      timeToLearn: '2-3 months',
                      value: '+$10K salary potential'
                    },
                    {
                      skill: 'AWS',
                      reason: 'High demand for cloud skills',
                      priority: 'High',
                      timeToLearn: '3-4 months',
                      value: '+$18K salary potential'
                    }
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{item.skill}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>⏱️ {item.timeToLearn}</span>
                        <span>💰 {item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Skills & Jobs */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Items</h2>
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Favorite Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Python', 'TypeScript'].map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Saved Jobs</h3>
                    <div className="space-y-2">
                      {[
                        { title: 'Senior React Developer', company: 'TechCorp Africa', saved: '2 days ago' },
                        { title: 'Full Stack Developer', company: 'StartupXYZ', saved: '1 week ago' }
                      ].map((job, index) => (
                        <div key={index} className="border rounded p-2">
                          <p className="text-sm font-medium text-gray-900">{job.title}</p>
                          <p className="text-xs text-gray-600">{job.company} • {job.saved}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Certifications */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Trending Certifications</h2>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {[
                    { cert: 'AWS Certified Developer', demand: '+45%', value: 'High' },
                    { cert: 'Google Cloud Professional', demand: '+38%', value: 'High' },
                    { cert: 'React Certification', demand: '+32%', value: 'Medium' },
                    { cert: 'Python Certification', demand: '+28%', value: 'Medium' },
                    { cert: 'DevOps Engineer', demand: '+52%', value: 'Very High' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{item.cert}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 font-medium">{item.demand}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.value === 'Very High' ? 'bg-red-100 text-red-700' :
                          item.value === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
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
