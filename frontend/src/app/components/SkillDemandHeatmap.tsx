'use client';

import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Users, DollarSign, Activity, Filter, Search } from 'lucide-react';

interface CountrySkillData {
  country: string;
  code: string;
  lat: number;
  lng: number;
  topSkills: SkillData[];
  totalJobs: number;
  avgSalary: string;
  companies: number;
  growth: number;
}

interface SkillData {
  skill: string;
  demand: number;
  jobs: number;
  growth: number;
  avgSalary: string;
}

interface HeatmapData {
  countries: CountrySkillData[];
  globalTopSkills: GlobalSkillData[];
  trendingSkills: TrendingSkillData[];
}

interface GlobalSkillData {
  skill: string;
  totalDemand: number;
  countries: string[];
  growth: number;
  category: string;
}

interface TrendingSkillData {
  skill: string;
  growth: number;
  timeframe: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export default function SkillDemandHeatmap() {
  const [selectedCountry, setSelectedCountry] = useState<CountrySkillData | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Simulate loading heatmap data
    const loadHeatmapData = async () => {
      setLoading(true);
      
      // Mock data for African countries
      const mockData: HeatmapData = {
        countries: [
          {
            country: 'Nigeria',
            code: 'NG',
            lat: 9.0765,
            lng: 8.6753,
            topSkills: [
              { skill: 'Python', demand: 89, jobs: 4567, growth: 22, avgSalary: '$2,800' },
              { skill: 'JavaScript', demand: 76, jobs: 3890, growth: 18, avgSalary: '$2,200' },
              { skill: 'React', demand: 68, jobs: 3234, growth: 35, avgSalary: '$2,500' },
              { skill: 'Node.js', demand: 54, jobs: 2567, growth: 28, avgSalary: '$2,600' },
              { skill: 'TypeScript', demand: 48, jobs: 2234, growth: 41, avgSalary: '$2,700' }
            ],
            totalJobs: 18456,
            avgSalary: '$2,400',
            companies: 892,
            growth: 22
          },
          {
            country: 'South Africa',
            code: 'ZA',
            lat: -30.5595,
            lng: 22.9375,
            topSkills: [
              { skill: 'Java', demand: 82, jobs: 3456, growth: 12, avgSalary: '$3,200' },
              { skill: 'Python', demand: 78, jobs: 3234, growth: 20, avgSalary: '$3,500' },
              { skill: 'Cloud Computing', demand: 71, jobs: 2890, growth: 32, avgSalary: '$3,800' },
              { skill: 'DevOps', demand: 65, jobs: 2678, growth: 28, avgSalary: '$3,600' },
              { skill: 'Data Science', demand: 58, jobs: 2345, growth: 25, avgSalary: '$3,900' }
            ],
            totalJobs: 12345,
            avgSalary: '$3,200',
            companies: 567,
            growth: 18
          },
          {
            country: 'Kenya',
            code: 'KE',
            lat: -0.0236,
            lng: 37.9062,
            topSkills: [
              { skill: 'React', demand: 85, jobs: 2345, growth: 28, avgSalary: '$2,100' },
              { skill: 'Node.js', demand: 72, jobs: 1987, growth: 22, avgSalary: '$2,300' },
              { skill: 'JavaScript', demand: 68, jobs: 1876, growth: 15, avgSalary: '$1,900' },
              { skill: 'TypeScript', demand: 61, jobs: 1678, growth: 38, avgSalary: '$2,200' },
              { skill: 'Mobile Dev', demand: 54, jobs: 1489, growth: 18, avgSalary: '$2,000' }
            ],
            totalJobs: 8765,
            avgSalary: '$2,100',
            companies: 432,
            growth: 15
          },
          {
            country: 'Egypt',
            code: 'EG',
            lat: 26.8206,
            lng: 30.8025,
            topSkills: [
              { skill: 'Python', demand: 79, jobs: 1876, growth: 18, avgSalary: '$1,800' },
              { skill: 'Data Science', demand: 71, jobs: 1678, growth: 22, avgSalary: '$2,000' },
              { skill: 'Machine Learning', demand: 65, jobs: 1534, growth: 35, avgSalary: '$2,200' },
              { skill: 'AI/ML', demand: 58, jobs: 1367, growth: 42, avgSalary: '$2,400' },
              { skill: 'Cloud', demand: 52, jobs: 1223, growth: 28, avgSalary: '$2,100' }
            ],
            totalJobs: 6543,
            avgSalary: '$1,900',
            companies: 345,
            growth: 12
          },
          {
            country: 'Morocco',
            code: 'MA',
            lat: 31.7917,
            lng: -7.0926,
            topSkills: [
              { skill: 'JavaScript', demand: 74, jobs: 1234, growth: 16, avgSalary: '$1,700' },
              { skill: 'React', demand: 68, jobs: 1134, growth: 24, avgSalary: '$1,800' },
              { skill: 'Node.js', demand: 61, jobs: 1012, growth: 20, avgSalary: '$1,900' },
              { skill: 'Python', demand: 58, jobs: 967, growth: 14, avgSalary: '$1,600' },
              { skill: 'Mobile', demand: 52, jobs: 867, growth: 18, avgSalary: '$1,700' }
            ],
            totalJobs: 4321,
            avgSalary: '$1,700',
            companies: 234,
            growth: 8
          },
          {
            country: 'Ghana',
            code: 'GH',
            lat: 7.9465,
            lng: -1.0232,
            topSkills: [
              { skill: 'JavaScript', demand: 71, jobs: 876, growth: 18, avgSalary: '$1,600' },
              { skill: 'Python', demand: 65, jobs: 801, growth: 22, avgSalary: '$1,800' },
              { skill: 'React', demand: 58, jobs: 712, growth: 28, avgSalary: '$1,700' },
              { skill: 'Node.js', demand: 54, jobs: 667, growth: 15, avgSalary: '$1,700' },
              { skill: 'Mobile Dev', demand: 48, jobs: 589, growth: 20, avgSalary: '$1,500' }
            ],
            totalJobs: 3456,
            avgSalary: '$1,600',
            companies: 189,
            growth: 10
          }
        ],
        globalTopSkills: [
          { skill: 'JavaScript', totalDemand: 76, countries: ['Nigeria', 'Kenya', 'Morocco', 'Ghana'], growth: 18, category: 'Frontend' },
          { skill: 'Python', totalDemand: 78, countries: ['Nigeria', 'South Africa', 'Egypt', 'Ghana'], growth: 20, category: 'Backend/Data' },
          { skill: 'React', totalDemand: 70, countries: ['Nigeria', 'Kenya', 'Morocco', 'Ghana'], growth: 28, category: 'Frontend' },
          { skill: 'Node.js', totalDemand: 61, countries: ['Nigeria', 'Kenya', 'Morocco', 'Ghana'], growth: 22, category: 'Backend' },
          { skill: 'TypeScript', totalDemand: 54, countries: ['Nigeria', 'Kenya', 'Morocco'], growth: 38, category: 'Frontend' }
        ],
        trendingSkills: [
          { skill: 'TypeScript', growth: 38, timeframe: '2024', description: 'Fastest growing frontend technology', impact: 'high' },
          { skill: 'AI/ML', growth: 42, timeframe: '2024', description: 'Explosive growth in AI technologies', impact: 'high' },
          { skill: 'Cloud Computing', growth: 32, timeframe: '2024', description: 'High demand for cloud skills', impact: 'high' },
          { skill: 'DevOps', growth: 28, timeframe: '2024', description: 'Strong growth in DevOps practices', impact: 'medium' },
          { skill: 'React', growth: 28, timeframe: '2024', description: 'Continued React dominance', impact: 'medium' }
        ]
      };
      
      setHeatmapData(mockData);
      setLoading(false);
    };

    loadHeatmapData();
  }, []);

  const getHeatmapColor = (demand: number): string => {
    if (demand >= 80) return 'bg-red-500';
    if (demand >= 70) return 'bg-orange-500';
    if (demand >= 60) return 'bg-yellow-500';
    if (demand >= 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 20) return '🔥';
    if (growth > 10) return '📈';
    if (growth > 0) return '➡️';
    return '📉';
  };

  const filteredCountries = heatmapData?.countries.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !selectedSkill || country.topSkills.some(skill => skill.skill === selectedSkill);
    return matchesSearch && matchesSkill;
  }) || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading skill demand heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <MapPin className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Skill Demand Heatmap</h2>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Skills</option>
              {heatmapData?.globalTopSkills.map(skill => (
                <option key={skill.skill} value={skill.skill}>{skill.skill}</option>
              ))}
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Data">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
        </div>

        {/* Africa Map Visualization */}
        <div className="mb-8">
          <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-lg p-8 relative h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600">Interactive Africa Map</p>
                <p className="text-sm text-gray-500">Click on countries below for detailed insights</p>
              </div>
            </div>
            
            {/* Country Markers */}
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                className="absolute cursor-pointer group"
                style={{
                  left: `${((country.lng + 20) / 60) * 100}%`,
                  top: `${((35 - country.lat) / 65) * 100}%`
                }}
                onClick={() => setSelectedCountry(country)}
              >
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full ${getHeatmapColor(country.topSkills[0]?.demand || 50)} animate-pulse`}></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <p className="text-xs font-semibold">{country.country}</p>
                    <p className="text-xs text-gray-600">{country.totalJobs.toLocaleString()} jobs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Details Modal */}
        {selectedCountry && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900">{selectedCountry.country}</h3>
                <p className="text-blue-700">Tech Job Market Overview</p>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded p-3">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Total Jobs</span>
                </div>
                <p className="text-xl font-bold text-blue-900">{selectedCountry.totalJobs.toLocaleString()}</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Avg Salary</span>
                </div>
                <p className="text-xl font-bold text-green-900">{selectedCountry.avgSalary}</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <div className="flex items-center mb-1">
                  <Activity className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Companies</span>
                </div>
                <p className="text-xl font-bold text-purple-900">{selectedCountry.companies}</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <div className="flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium">Growth</span>
                </div>
                <p className="text-xl font-bold text-orange-900">+{selectedCountry.growth}%</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Top Skills in {selectedCountry.country}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCountry.topSkills.map((skill, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">{getGrowthIcon(skill.growth)} {skill.growth}%</span>
                        <span className="text-sm text-blue-600">{skill.demand}% demand</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{skill.jobs.toLocaleString()} jobs</span>
                      <span>{skill.avgSalary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Top Skills */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Global Top Skills Across Africa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heatmapData?.globalTopSkills.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {skill.category}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Demand</span>
                    <span className="font-medium">{skill.totalDemand}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth</span>
                    <span className="font-medium text-green-600">+{skill.growth}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Countries</span>
                    <span className="font-medium">{skill.countries.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Skills */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Trending Skills in Africa</h3>
          <div className="space-y-3">
            {heatmapData?.trendingSkills.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        skill.impact === 'high' ? 'bg-red-100 text-red-700' :
                        skill.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {skill.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📈 {skill.growth}% growth</span>
                      <span>📅 {skill.timeframe}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-center">
                    <div className="text-2xl font-bold text-green-600">+{skill.growth}%</div>
                    <div className="text-xs text-gray-600">growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
