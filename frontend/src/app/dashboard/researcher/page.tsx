'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, Download, Database, Search, Filter, FileText, Activity,
  MapPin, DollarSign, Briefcase, Users, Calendar, ChevronDown, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#6366f1'];

interface Stats {
  totalJobs: number;
  activeJobs: number;
  withSalary: number;
  countries: number;
  uniqueSkills: number;
  companies: number;
  lastUpdated: string;
}

interface SkillDemand {
  skill: string;
  count: number;
  countryCount: number;
}

interface SalaryDist {
  range: string;
  count: number;
  avgSalary: number;
}

interface CountryData {
  _id: string;
  count: number;
  avgSalary: number;
}

interface GrowthData {
  country: string;
  month: string;
  count: number;
}

interface IndustryData {
  industry: string;
  count: number;
  avgSalary: number;
}

interface SalaryCountryData {
  country: string;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  count: number;
}

interface CityData {
  country: string;
  city: string;
  count: number;
  avgSalary: number;
}

interface SkillData {
  skill: string;
  count: number;
}

export default function ResearcherDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [skillDemand, setSkillDemand] = useState<SkillDemand[]>([]);
  const [salaryDist, setSalaryDist] = useState<SalaryDist[]>([]);
  const [countryDist, setCountryDist] = useState<CountryData[]>([]);
  const [jobGrowth, setJobGrowth] = useState<GrowthData[]>([]);
  const [industryBreakdown, setIndustryBreakdown] = useState<IndustryData[]>([]);
  const [salaryByCountry, setSalaryByCountry] = useState<SalaryCountryData[]>([]);
  const [jobsByCity, setJobsByCity] = useState<CityData[]>([]);
  const [topSkills, setTopSkills] = useState<SkillData[]>([]);
  const [trends, setTrends] = useState<Record<string, number>>({});

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [growthMonths, setGrowthMonths] = useState(12);
  const [dataLoading, setDataLoading] = useState(true);

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

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [
        statsRes, skillRes, salaryDistRes, countryRes, growthRes,
        industryRes, salaryCountryRes, cityRes, topSkillsRes, trendsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/api/analytics/advanced-stats`),
        fetch(`${API_BASE}/api/analytics/skill-demand`),
        fetch(`${API_BASE}/api/analytics/salary-distribution`),
        fetch(`${API_BASE}/api/analytics/countries`),
        fetch(`${API_BASE}/api/analytics/job-growth?months=${growthMonths}`),
        fetch(`${API_BASE}/api/analytics/industry-breakdown`),
        fetch(`${API_BASE}/api/analytics/salary-by-country`),
        fetch(`${API_BASE}/api/analytics/jobs-by-city${selectedCountry ? `?country=${selectedCountry}` : ''}`),
        fetch(`${API_BASE}/api/analytics/top-skills?limit=15`),
        fetch(`${API_BASE}/api/analytics/trends`),
      ]);

      const [statsD, skillD, salaryDistD, countryD, growthD, industryD, salaryCountryD, cityD, topSkillsD, trendsD] = await Promise.all([
        statsRes.json(), skillRes.json(), salaryDistRes.json(), countryRes.json(),
        growthRes.json(), industryRes.json(), salaryCountryRes.json(),
        cityRes.json(), topSkillsRes.json(), trendsRes.json()
      ]);

      setStats(statsD);
      setSkillDemand(skillD);
      setSalaryDist(salaryDistD);
      setCountryDist(countryD);
      setJobGrowth(growthD);
      setIndustryBreakdown(industryD);
      setSalaryByCountry(salaryCountryD);
      setJobsByCity(cityD);
      setTopSkills(topSkillsD);
      setTrends(trendsD);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [growthMonths, selectedCountry]);

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading, fetchData]);

  const processGrowthData = () => {
    const byCountry: Record<string, Record<string, number>> = {};
    jobGrowth.forEach(item => {
      if (!byCountry[item.country]) byCountry[item.country] = {};
      byCountry[item.country][item.month] = item.count;
    });
    const allMonths = [...new Set(jobGrowth.map(g => g.month))].sort();
    const countries = [...new Set(jobGrowth.map(g => g.country))];
    return {
      timeline: allMonths.map(month => {
        const entry: Record<string, string | number> = { month };
        countries.forEach(c => { entry[c] = byCountry[c]?.[month] || 0; });
        return entry;
      }),
      countries
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { timeline, countries } = processGrowthData();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skill Demand', icon: Activity },
    { id: 'salaries', label: 'Salaries', icon: DollarSign },
    { id: 'geography', label: 'Geography', icon: MapPin },
    { id: 'trends', label: 'Growth Trends', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
              <p className="text-gray-600 mt-1">Advanced analytics and research tools</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : '...'}</span>
              <button onClick={fetchData} disabled={dataLoading} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                <RefreshCw className={`h-4 w-4 ${dataLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: 'Total Jobs', value: stats.totalJobs?.toLocaleString(), icon: Database, color: 'blue' },
                { label: 'Active Jobs', value: stats.activeJobs?.toLocaleString(), icon: Activity, color: 'green' },
                { label: 'With Salary', value: stats.withSalary?.toLocaleString(), icon: DollarSign, color: 'amber' },
                { label: 'Countries', value: stats.countries, icon: MapPin, color: 'purple' },
                { label: 'Unique Skills', value: stats.uniqueSkills, icon: Briefcase, color: 'cyan' },
                { label: 'Companies', value: stats.companies, icon: Users, color: 'indigo' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`h-4 w-4 text-${s.color}-600`} />
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dataLoading ? '...' : s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Skills */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Top 15 Most Demanded Skills</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topSkills} layout="vertical" margin={{ left: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="skill" type="category" width={80} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Industry Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Industry Breakdown</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={industryBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={(entry) => { const d = entry as unknown as IndustryData; const p = entry as unknown as { percent?: number }; return `${d.industry} (${((p.percent || 0) * 100).toFixed(0)}%)`; }} labelLine={false}>
                            {industryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Job Trends */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Job Posting Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={Object.entries(trends).map(([month, count]) => ({ month, count }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Country Distribution */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Jobs by Country</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={countryDist}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="Jobs" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skill Demand by Country Reach */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Skills by Geographic Reach</h3>
                      <p className="text-sm text-gray-500 mb-4">Skills demanded across the most countries</p>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={[...skillDemand].sort((a, b) => b.countryCount - a.countryCount).slice(0, 20)} layout="vertical" margin={{ left: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="countryCount" fill="#10b981" name="Countries" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Top Skills by Count */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Skills by Job Count</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={skillDemand.slice(0, 20)} layout="vertical" margin={{ left: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" name="Jobs" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Full Skill Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Complete Skill Rankings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Skill</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Jobs</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Countries</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skillDemand.map((s, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2.5 px-4 text-gray-400">{i + 1}</td>
                              <td className="py-2.5 px-4 font-medium text-gray-900 capitalize">{s.skill}</td>
                              <td className="py-2.5 px-4 text-right">{s.count.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{s.countryCount}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Salaries Tab */}
              {activeTab === 'salaries' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Salary Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Salary Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salaryDist}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" name="Jobs" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Salary by Country */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Average Salary by Country</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salaryByCountry} layout="vertical" margin={{ left: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={v => `$${v.toLocaleString()}`} />
                          <YAxis dataKey="country" type="category" width={100} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                          <Bar dataKey="avgSalary" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Salary by Country Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Salary Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Country</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Salary</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Min</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Max</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Jobs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salaryByCountry.map((s, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-medium text-gray-900">{s.country}</td>
                              <td className="py-2.5 px-4 text-right font-semibold text-green-700">${s.avgSalary?.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right text-gray-500">${s.minSalary?.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right text-gray-500">${s.maxSalary?.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right">{s.count?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Geography Tab */}
              {activeTab === 'geography' && (
                <div className="space-y-8">
                  {/* Filters */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Filter by Country:</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Jobs by City */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Jobs by City {selectedCountry && <span className="text-gray-400 font-normal">in {selectedCountry}</span>}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">City</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Country</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Jobs</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Salary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobsByCity.slice(0, 30).map((c, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-medium text-gray-900">{c.city}</td>
                              <td className="py-2.5 px-4 text-gray-600">{c.country}</td>
                              <td className="py-2.5 px-4 text-right">{c.count.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right text-green-700">${c.avgSalary?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Country Comparison Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Country Comparison: Jobs vs Avg Salary</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={countryDist}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={v => `$${v.toLocaleString()}`} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Jobs" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="avgSalary" fill="#10b981" name="Avg Salary" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Growth Trends Tab */}
              {activeTab === 'trends' && (
                <div className="space-y-8">
                  {/* Filters */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Time Range:</label>
                      <select
                        value={growthMonths}
                        onChange={(e) => setGrowthMonths(Number(e.target.value))}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={3}>Last 3 Months</option>
                        <option value={6}>Last 6 Months</option>
                        <option value={12}>Last 12 Months</option>
                      </select>
                    </div>
                  </div>

                  {/* Growth by Country Multi-line Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Job Growth by Country</h3>
                    {countries.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={timeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {countries.slice(0, 8).map((country, i) => (
                            <Line key={country} type="monotone" dataKey={country} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex justify-center py-16 text-gray-500">No growth data available for selected time range</div>
                    )}
                  </div>

                  {/* Country Growth Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Growth Summary by Country</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Country</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Total Jobs</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Monthly</th>
                          </tr>
                        </thead>
                        <tbody>
                          {countryDist.map((c, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-medium text-gray-900">{c._id}</td>
                              <td className="py-2.5 px-4 text-right">{c.count?.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-right">{growthMonths > 0 ? Math.round((c.count || 0) / growthMonths).toLocaleString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
