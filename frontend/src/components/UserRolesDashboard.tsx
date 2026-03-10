import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Table, Tag, Progress, message, Tabs, Upload, Modal, Form, Row, Col } from 'antd';
import { 
  TrendingUp, 
  MapPin, 
  Users, 
  Building, 
  BarChart,
  Download,
  Search,
  Filter,
  Eye,
  Key,
  Activity,
  DollarSign,
  Target,
  BrainCircuit,
  FileText,
  Database,
  Globe
} from 'lucide-react';

// Type definitions
interface SkillDemand {
  skill: string;
  demand: number;
  averageSalary: number;
  demandLevel: string;
}

interface SalaryData {
  role: string;
  country: string;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  jobCount: number;
}

interface JobData {
  jobTitle: string;
  company: string;
  country: string;
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  postedDate: string;
}

interface SkillGapData {
  currentSkills: string[];
  missingSkills: string[];
  skillGaps: {
    total: number;
    completionRate: number;
    readinessLevel: string;
  };
  recommendations: Array<{
    skill: string;
    estimatedTime: number;
  }>;
}

interface TalentMarketData {
  talentMarket: Array<{
    _id: {
      skill: string;
      country: string;
      experienceLevel: string;
    };
    demand: number;
    avgSalary: number;
  }>;
  insights: {
    totalDemand: number;
    topSkills: string[];
    averageSalary: number;
  };
}

interface DatasetInfo {
  dataset: string;
  records: number;
  filename: string;
  format: string;
  generatedAt: string;
  downloadUrl: string;
}

interface ApiKey {
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  usageCount: number;
}

interface UsageData {
  apiKeys: ApiKey[];
  usage: {
    totalRequests: number;
    requestsThisMonth: number;
    requestsToday: number;
    rateLimitStatus: string;
    nextReset: string;
  };
  quotas: {
    requestsPerHour: number;
    requestsPerDay: number;
    currentUsage: number;
  };
}

interface ScraperInfo {
  name: string;
  status: string;
  lastRun: string;
  jobsCollected: number;
}

interface UserData {
  users: Array<{
    email: string;
    userType: string;
    profile: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
    lastLogin: string | null;
    verification: {
      emailVerified: boolean;
    };
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
  userStats: {
    total: number;
    byType: Array<{
      _id: string;
      count: number;
    }>;
  };
}

type UserRole = 'jobseeker' | 'recruiter' | 'researcher' | 'developer' | 'admin';
type ActiveTab = string;

const UserRolesDashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('jobseeker');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const token = localStorage.getItem('token');

  // Simulate getting user role (in real app, this comes from auth)
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole || 'jobseeker';
    setUserRole(storedRole);
    loadDashboardData(storedRole, 'overview');
  }, []);

  const loadDashboardData = async (role: UserRole, tab: string): Promise<void> => {
    setLoading(true);
    try {
      let response: any;
      
      switch (role) {
        case 'jobseeker':
          response = await loadJobSeekerData(tab);
          break;
        case 'recruiter':
          response = await loadRecruiterData(tab);
          break;
        case 'researcher':
          response = await loadResearcherData(tab);
          break;
        case 'developer':
          response = await loadDeveloperData(tab);
          break;
        case 'admin':
          response = await loadAdminData(tab);
          break;
        default:
          response = { success: true, data: {} };
      }
      
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      message.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  // Job Seeker Data Loading
  const loadJobSeekerData = async (tab: string): Promise<any> => {
    try {
      let response;
      
      switch (tab) {
        case 'overview':
          response = await fetch('/api/user/job-seeker/skill-demand', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          break;
        case 'salary':
          response = await fetch('/api/user/job-seeker/salary-intelligence', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          break;
        case 'explore':
          response = await fetch('/api/user/job-seeker/explore', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          break;
        case 'skill-gap':
          response = await fetch('/api/user/job-seeker/skill-gap', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              currentSkills: ['Python', 'JavaScript'],
              targetCareer: 'Full Stack Developer',
              country: 'Nigeria'
            })
          });
          break;
        default:
          return { success: true, data: {} };
      }
      
      return response.json();
    } catch (error) {
      console.error('Job seeker data loading error:', error);
      return { success: false, error: 'Failed to load data' };
    }
  };

  // Recruiter Data Loading
  const loadRecruiterData = async (tab: string): Promise<any> => {
    switch (tab) {
      case 'talent':
        const response = await fetch('/api/user/recruiter/talent-intelligence', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'salary':
        const response = await fetch('/api/user/recruiter/salary-benchmarking', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'trends':
        const response = await fetch('/api/user/recruiter/hiring-trends', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'competitors':
        const response = await fetch('/api/user/recruiter/competitor-intelligence', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      default:
        return { success: true, data: {} };
    }
  };

  // Researcher Data Loading
  const loadResearcherData = async (tab: string): Promise<any> => {
    switch (tab) {
      case 'datasets':
        const response = await fetch('/api/user/researcher/datasets', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'analytics':
        const response = await fetch('/api/user/researcher/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'export':
        window.open('/api/user/researcher/download?dataset=jobs&format=csv', '_blank');
        return { success: true, data: { message: 'Download started' } };
      default:
        return { success: true, data: {} };
    }
  };

  // Developer Data Loading
  const loadDeveloperData = async (tab: string): Promise<any> => {
    switch (tab) {
      case 'docs':
        const response = await fetch('/api/user/developer/api-docs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'keys':
        const response = await fetch('/api/user/developer/usage', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'usage':
        const response = await fetch('/api/user/developer/usage', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'playground':
        const response = await fetch('/api/user/researcher/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      default:
        return { success: true, data: {} };
    }
  };

  // Admin Data Loading
  const loadAdminData = async (tab: string): Promise<any> => {
    switch (tab) {
      case 'scrapers':
        const response = await fetch('/api/admin/scrapers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'users':
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'data-quality':
        const response = await fetch('/api/admin/data-quality', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      case 'datasets':
        const response = await fetch('/api/admin/datasets', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
      default:
        return { success: true, data: {} };
    }
  };

  const handleRoleChange = (role: UserRole): void => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    loadDashboardData(role, 'overview');
    setActiveTab('overview');
  };

  const renderJobSeekerDashboard = (): JSX.Element => {
    const tabItems = [
      { key: 'overview', label: 'Skill Demand', icon: <TrendingUp /> },
      { key: 'salary', label: 'Salary Intelligence', icon: <DollarSign /> },
      { key: 'explore', label: 'Job Explorer', icon: <Search /> },
      { key: 'skill-gap', label: 'Skill Gap Analyzer', icon: <Target /> }
    ];

    return (
      <div className="space-y-6">
        {/* Role Header */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Job Seeker Dashboard</h2>
                <p className="text-gray-600">Explore career opportunities and market insights</p>
              </div>
            </div>
            <Select<UserRole>
              value={userRole}
              onChange={handleRoleChange}
              className="w-48"
              options={[
                { value: 'jobseeker', label: '👤 Job Seeker' },
                { value: 'recruiter', label: '🏢 Recruiter' },
                { value: 'researcher', label: '🔬 Researcher' },
                { value: 'developer', label: '💻 Developer' },
                { value: 'admin', label: '⚙️ Admin' }
              ]}
            />
          </div>
        </Card>

        {/* Tab Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-6" />

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <Card title="📊 Skill Demand Insights" className="shadow-lg">
            <div className="mb-4">
              <Button 
                type="primary" 
                onClick={() => loadDashboardData('jobseeker', 'overview')}
                className="mr-2"
              >
                Refresh Skills Data
              </Button>
              <Button 
                onClick={() => message.info('Loading all African countries data...')}
              >
                Load All Countries
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data.skillDemand as SkillDemand[] || []).slice(0, 6).map((skill: SkillDemand, index: number) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-lg text-black">{skill.skill}</h4>
                  <p className="text-2xl font-bold text-blue-600">{skill.demand} jobs</p>
                  <Tag color={skill.demandLevel === 'Very High' ? 'red' : skill.demandLevel === 'High' ? 'orange' : 'green'}>
                    {skill.demandLevel}
                  </Tag>
                  <p className="text-sm text-black">Avg Salary: ${skill.averageSalary}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'salary' && (
          <Card title="💰 Salary Intelligence" className="shadow-lg">
            <div className="mb-4">
              <Button 
                type="primary" 
                onClick={() => loadDashboardData('jobseeker', 'salary')}
                className="mr-2"
              >
                Refresh Salary Data
              </Button>
              <Button 
                onClick={() => {
                  const countries = ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana'];
                  countries.forEach(country => {
                    fetch(`/api/user/job-seeker/salary-intelligence?country=${country}`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    }).then(() => message.success(`Loaded ${country} salary data`));
                  });
                }}
              >
                Load Top 5 Countries
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Salary by Role</h3>
                <div className="space-y-2">
                  {(data.salaryData as SalaryData[] || []).slice(0, 5).map((item: SalaryData, index: number) => (
                    <div key={index} className="p-3 bg-green-50 rounded">
                      <p className="font-medium text-black">{item.role} - {item.country}</p>
                      <p className="text-xl font-bold text-green-600">${item.averageSalary}</p>
                      <p className="text-sm text-black">Range: ${item.minSalary} - ${item.maxSalary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Market Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-black">Overall Average</p>
                    <p className="text-xl font-bold text-blue-600">${data.insights?.overallAverage || 0}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-black">Highest Paying</p>
                    <p className="text-xl font-bold text-purple-600">{data.insights?.highestPaying?.role || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'explore' && (
          <Card title="🔍 Job Explorer" className="shadow-lg">
            <div className="mb-4 flex space-x-4">
              <Input.Search
                placeholder="Search jobs, companies, or skills..."
                style={{ width: 300 }}
                onSearch={(value: string) => {
                  fetch(`/api/user/job-seeker/explore?search=${value}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  }).then(response => response.json()).then(data => {
                    setData(prevData => ({ ...prevData, jobs: data.data.jobs }));
                    message.success(`Found ${data.data.jobs.length} jobs`);
                  });
                }}
              />
              <Select<string[]> placeholder="Filter by skill" style={{ width: 200 }} mode="multiple"
                onChange={(skills: string[]) => {
                  const skillParams = skills.join(',');
                  fetch(`/api/user/job-seeker/explore?skills=${skillParams}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  }).then(response => response.json()).then(data => {
                    setData(prevData => ({ ...prevData, jobs: data.data.jobs }));
                    message.success(`Filtered by ${skills.length} skills`);
                  });
                }}>
                <Select.Option value="Python">Python</Select.Option>
                <Select.Option value="React">React</Select.Option>
                <Select.Option value="AWS">AWS</Select.Option>
                <Select.Option value="Node.js">Node.js</Select.Option>
              </Select>
              <Select<string> placeholder="Filter by country" style={{ width: 150 }}
                onChange={(country: string) => {
                  fetch(`/api/user/job-seeker/explore?country=${country}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  }).then(response => response.json()).then(data => {
                    setData(prevData => ({ ...prevData, jobs: data.data.jobs }));
                    message.success(`Filtered by ${country}`);
                  });
                }}>
                <Select.Option value="Nigeria">Nigeria</Select.Option>
                <Select.Option value="Kenya">Kenya</Select.Option>
                <Select.Option value="South Africa">South Africa</Select.Option>
              </Select>
              <Button 
                type="primary" 
                onClick={() => loadDashboardData('jobseeker', 'explore')}
              >
                Refresh Jobs
              </Button>
            </div>
            
            <Table
              columns={[
                { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
                { title: 'Company', dataIndex: 'company', key: 'company' },
                { title: 'Country', dataIndex: 'country', key: 'country' },
                { 
                  title: 'Skills', 
                  dataIndex: 'skills', 
                  key: 'skills', 
                  render: (skills: string[]) => skills.map((skill: string) => <Tag key={skill}>{skill}</Tag>) 
                },
                { 
                  title: 'Salary', 
                  dataIndex: 'salaryMin', 
                  key: 'salary',
                  render: (min: number, record: any) => `$${min} - $${record.salaryMax}` 
                },
                { 
                  title: 'Posted', 
                  dataIndex: 'postedDate', 
                  key: 'postedDate',
                  render: (date: string) => new Date(date).toLocaleDateString() 
                }
              ]}
              dataSource={data.jobs as JobData[] || []}
              pagination={{
                current: data.pagination?.currentPage || 1,
                total: data.pagination?.totalJobs || 0,
                pageSize: 20
              }}
            />
          </Card>
        )}

        {activeTab === 'skill-gap' && (
          <Card title="🎯 Skill Gap Analyzer" className="shadow-lg">
            <div className="mb-4">
              <Button 
                type="primary" 
                onClick={() => loadDashboardData('jobseeker', 'skill-gap')}
                className="mr-2"
              >
                Analyze My Skills
              </Button>
              <Button 
                onClick={() => {
                  Modal.info({
                    title: 'Skill Gap Analysis',
                    content: 'This tool compares your current skills with market demands and suggests what to learn next.',
                  });
                }}
              >
                How It Works
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Current Skills</h3>
                <div className="space-y-2">
                  {(data.currentSkills as string[] || []).map((skill: string, index: number) => (
                    <Tag key={index} color="green" className="mb-2">{skill}</Tag>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-black">Missing Skills</h4>
                  <div className="space-y-2">
                    {(data.missingSkills as string[] || []).slice(0, 5).map((skill: string, index: number) => (
                      <Tag key={index} color="red" className="mb-2">{skill}</Tag>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Analysis Results</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded">
                    <p className="font-medium text-black">Completion Rate</p>
                    <Progress percent={data.skillGaps?.completionRate || 0} status="active" />
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-black">Readiness Level</p>
                    <p className="text-xl font-bold text-blue-600">{data.skillGaps?.readinessLevel || 'Beginner'}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-black">Learning Recommendations</h4>
                  <div className="space-y-2">
                    {(data.recommendations as Array<{skill: string; estimatedTime: number}> || []).slice(0, 3).map((rec: any, index: number) => (
                      <div key={index} className="p-3 bg-green-50 rounded">
                        <p className="font-medium text-black">{rec.skill}</p>
                        <p className="text-sm text-black">Time: {rec.estimatedTime} months</p>
                        <Button 
                          size="small" 
                          type="primary" 
                          className="mt-2"
                          onClick={() => message.info(`Finding learning resources for ${rec.skill}...`)}
                        >
                          Find Courses
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderRecruiterDashboard = (): JSX.Element => {
    const tabItems = [
      { key: 'talent', label: 'Talent Intelligence', icon: <BrainCircuit /> },
      { key: 'salary', label: 'Salary Benchmarking', icon: <DollarSign /> },
      { key: 'trends', label: 'Hiring Trends', icon: <TrendingUp /> },
      { key: 'competitors', label: 'Competitor Intelligence', icon: <Building /> }
    ];

    return (
      <div className="space-y-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building className="text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">Recruiter Dashboard</h2>
                <p className="text-gray-600">Analyze talent market and hiring trends</p>
              </div>
            </div>
            <Select<UserRole>
              value={userRole}
              onChange={handleRoleChange}
              className="w-48"
              options={[
                { value: 'jobseeker', label: '👤 Job Seeker' },
                { value: 'recruiter', label: '🏢 Recruiter' },
                { value: 'researcher', label: '🔬 Researcher' },
                { value: 'developer', label: '💻 Developer' },
                { value: 'admin', label: '⚙️ Admin' }
              ]}
            />
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-6" />

        {/* Recruiter Tab Content */}
        {activeTab === 'talent' && (
          <Card title="🧠 Talent Market Intelligence" className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold">Total Demand</h4>
                <p className="text-2xl font-bold text-purple-600">{(data as TalentMarketData).insights?.totalDemand || 0}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold">Top Skills</h4>
                <div className="space-y-1">
                  {(data as TalentMarketData).insights?.topSkills?.slice(0, 3).map((skill: string, index: number) => (
                    <Tag key={index}>{skill}</Tag>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold">Average Salary</h4>
                <p className="text-2xl font-bold text-green-600">${(data as TalentMarketData).insights?.averageSalary || 0}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Talent Distribution</h3>
              <Table
                columns={[
                  { title: 'Skill', dataIndex: ['_id', 'skill'], key: 'skill' },
                  { title: 'Country', dataIndex: ['_id', 'country'], key: 'country' },
                  { title: 'Experience', dataIndex: ['_id', 'experienceLevel'], key: 'experience' },
                  { title: 'Demand', dataIndex: 'demand', key: 'demand' },
                  { 
                    title: 'Avg Salary', 
                    dataIndex: 'avgSalary', 
                    key: 'salary',
                    render: (salary: number) => `$${Math.round(salary)}` 
                  }
                ]}
                dataSource={(data as TalentMarketData).talentMarket || []}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderResearcherDashboard = (): JSX.Element => {
    const tabItems = [
      { key: 'datasets', label: 'Dataset Explorer', icon: <Database /> },
      { key: 'analytics', label: 'Advanced Analytics', icon: <BarChart /> },
      { key: 'export', label: 'Data Export', icon: <Download /> }
    ];

    return (
      <div className="space-y-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="text-orange-600" />
              <div>
                <h2 className="text-2xl font-bold">Researcher Dashboard</h2>
                <p className="text-gray-600">Explore datasets and conduct research</p>
              </div>
            </div>
            <Select<UserRole>
              value={userRole}
              onChange={handleRoleChange}
              className="w-48"
              options={[
                { value: 'jobseeker', label: '👤 Job Seeker' },
                { value: 'recruiter', label: '🏢 Recruiter' },
                { value: 'researcher', label: '🔬 Researcher' },
                { value: 'developer', label: '💻 Developer' },
                { value: 'admin', label: '⚙️ Admin' }
              ]}
            />
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-6" />

        {activeTab === 'datasets' && (
          <Card title="📊 Dataset Explorer" className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <Database className="mx-auto mb-2 text-orange-600" />
                <h4 className="font-semibold">Jobs Dataset</h4>
                <p className="text-2xl font-bold text-orange-600">{(data as DatasetInfo).records || 0}</p>
                <p className="text-sm text-gray-600">Total records</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <TrendingUp className="mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold">Skills Dataset</h4>
                <p className="text-2xl font-bold text-blue-600">{(data as DatasetInfo).records || 0}</p>
                <p className="text-sm text-gray-600">Unique skills</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <DollarSign className="mx-auto mb-2 text-green-600" />
                <h4 className="font-semibold">Salaries Dataset</h4>
                <p className="text-2xl font-bold text-green-600">{(data as DatasetInfo).records || 0}</p>
                <p className="text-sm text-gray-600">Salary records</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <Activity className="mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold">Trends Dataset</h4>
                <p className="text-2xl font-bold text-purple-600">{(data as DatasetInfo).records || 0}</p>
                <p className="text-sm text-gray-600">Trend records</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="primary" 
                icon={<Download />}
                onClick={() => window.open(`/api/user/researcher/download?dataset=jobs&format=csv`, '_blank')}
              >
                Download Jobs (CSV)
              </Button>
              <Button 
                icon={<Download />}
                onClick={() => window.open(`/api/user/researcher/download?dataset=skills&format=json`, '_blank')}
              >
                Download Skills (JSON)
              </Button>
              <Button 
                icon={<Download />}
                onClick={() => window.open(`/api/user/researcher/download?dataset=salaries&format=csv`, '_blank')}
              >
                Download Salaries (CSV)
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderDeveloperDashboard = (): JSX.Element => {
    const tabItems = [
      { key: 'docs', label: 'API Documentation', icon: <FileText /> },
      { key: 'keys', label: 'API Keys', icon: <Key /> },
      { key: 'usage', label: 'Usage Dashboard', icon: <Activity /> },
      { key: 'playground', label: 'API Playground', icon: <Globe /> }
    ];

    return (
      <div className="space-y-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Database className="text-cyan-600" />
              <div>
                <h2 className="text-2xl font-bold">Developer Dashboard</h2>
                <p className="text-gray-600">API access and integration tools</p>
              </div>
            </div>
            <Select<UserRole>
              value={userRole}
              onChange={handleRoleChange}
              className="w-48"
              options={[
                { value: 'jobseeker', label: '👤 Job Seeker' },
                { value: 'recruiter', label: '🏢 Recruiter' },
                { value: 'researcher', label: '🔬 Researcher' },
                { value: 'developer', label: '💻 Developer' },
                { value: 'admin', label: '⚙️ Admin' }
              ]}
            />
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-6" />

        {activeTab === 'docs' && (
          <Card title="📚 API Documentation" className="shadow-lg">
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50 rounded">
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="bg-gray-800 text-white p-2 rounded">
                  {data.baseUrl || 'http://localhost:5000/api'}
                </code>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.endpoints as Array<any> || []).map((endpoint: any, index: number) => (
                  <div key={index} className="p-3 border rounded">
                    <h4 className="font-semibold">{endpoint.method} {endpoint.path}</h4>
                    <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                    <code className="text-xs bg-gray-100 p-1 rounded">{endpoint.path}</code>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'keys' && (
          <Card title="🔑 API Key Management" className="shadow-lg">
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<Key />}
                onClick={() => {
                  // Generate new API key
                  fetch('/api/user/developer/api-key', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ action: 'generate', keyName: 'Production Key' })
                  }).then(() => {
                    message.success('API key generated successfully');
                    loadDashboardData('developer', 'keys');
                  });
                }}
              >
                Generate New API Key
              </Button>
            </div>
            
            <Table
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { 
                  title: 'API Key', 
                  dataIndex: 'key', 
                  key: 'key',
                  render: (key: string) => <code className="bg-gray-100 p-1 rounded">{key.substring(0, 20)}...</code> 
                },
                { 
                  title: 'Created', 
                  dataIndex: 'createdAt', 
                  key: 'createdAt',
                  render: (date: string) => new Date(date).toLocaleDateString() 
                },
                { title: 'Usage', dataIndex: 'usageCount', key: 'usage' },
                { 
                  title: 'Actions', 
                  key: 'actions',
                  render: (_: any, record: ApiKey) => (
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => {
                        fetch('/api/user/developer/api-key', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ action: 'revoke', keyName: record.name })
                        }).then(() => {
                          message.success('API key revoked');
                          loadDashboardData('developer', 'keys');
                        });
                      }}
                    >
                      Revoke
                    </Button>
                  )
                }
              ]}
              dataSource={(data as UsageData).apiKeys || []}
              pagination={false}
            />
          </Card>
        )}
      </div>
    );
  };

  const renderAdminDashboard = (): JSX.Element => {
    const tabItems = [
      { key: 'scrapers', label: 'Scraper Control', icon: <Database /> },
      { key: 'users', label: 'User Management', icon: <Users /> },
      { key: 'data-quality', label: 'Data Quality', icon: <Filter /> },
      { key: 'datasets', label: 'Dataset Management', icon: <Eye /> }
    ];

    return (
      <div className="space-y-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="text-red-600" />
              <div>
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-gray-600">Manage scrapers and platform data</p>
              </div>
            </div>
            <Select<UserRole>
              value={userRole}
              onChange={handleRoleChange}
              className="w-48"
              options={[
                { value: 'jobseeker', label: '👤 Job Seeker' },
                { value: 'recruiter', label: '🏢 Recruiter' },
                { value: 'researcher', label: '🔬 Researcher' },
                { value: 'developer', label: '💻 Developer' },
                { value: 'admin', label: '⚙️ Admin' }
              ]}
            />
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-6" />

        {activeTab === 'scrapers' && (
          <Card title="🔧 Scraper Control Panel" className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data.scrapers as ScraperInfo[] || []).map((scraper: ScraperInfo, index: number) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold">{scraper.name}</h4>
                  <Tag color={scraper.status === 'running' ? 'green' : scraper.status === 'error' ? 'red' : 'orange'}>
                    {scraper.status}
                  </Tag>
                  <p className="text-sm text-gray-600">Last run: {scraper.lastRun}</p>
                  <p className="text-sm text-gray-600">Jobs collected: {scraper.jobsCollected}</p>
                  <div className="mt-2 space-x-2">
                    <Button size="small" type="primary" onClick={() => console.log('Start scraper')}>
                      Start
                    </Button>
                    <Button size="small" danger onClick={() => console.log('Stop scraper')}>
                      Stop
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  // Render appropriate dashboard based on user role
  const renderDashboard = (): JSX.Element => {
    switch (userRole) {
      case 'jobseeker':
        return renderJobSeekerDashboard();
      case 'recruiter':
        return renderRecruiterDashboard();
      case 'researcher':
        return renderResearcherDashboard();
      case 'developer':
        return renderDeveloperDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return renderJobSeekerDashboard();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        renderDashboard()
      )}
    </div>
  );
};

export default UserRolesDashboard;
