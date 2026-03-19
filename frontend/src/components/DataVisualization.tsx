import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Spin, Tabs, Table, Tag } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface JobStats {
  jobsByCountry: Array<{ _id: string; count: number; avgSalary: number }>;
  jobsBySkill: Array<{ _id: string; count: number }>;
  jobsByType: Array<{ _id: string; count: number }>;
  jobsByExperience: Array<{ _id: string; count: number }>;
  salaryDistribution: Array<{ _id: string; count: number }>;
  dailyTrend: Array<{ _id: any; count: number }>;
  topCompanies: Array<{ _id: string; count: number; avgSalary: number }>;
}

interface ScrapingStats {
  recentJobs: number;
  weeklyJobs: number;
  jobsBySource: Array<{ _id: string; count: number; latest: string }>;
  sourceStats: Array<{ _id: string; total: number; active: number; successRate: number }>;
}

const DataVisualization: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [jobStats, setJobStats] = useState<JobStats | null>(null);
  const [scrapingStats, setScrapingStats] = useState<ScrapingStats | null>(null);
  const [timeframe, setTimeframe] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [jobDetails, setJobDetails] = useState([]);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchVisualizationData();
    fetchScrapingStats();
  }, [timeframe]);

  const fetchVisualizationData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/visualization/job-stats?timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setJobStats(data);
    } catch (error) {
      console.error('Failed to fetch visualization data:', error);
    }
    setLoading(false);
  };

  const fetchScrapingStats = async () => {
    try {
      const response = await fetch('/api/visualization/scraping-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setScrapingStats(data);
    } catch (error) {
      console.error('Failed to fetch scraping stats:', error);
    }
  };

  const fetchJobDetails = async (filters = {}) => {
    setJobDetailsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/visualization/job-details?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setJobDetails(data.jobs);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    }
    setJobDetailsLoading(false);
  };

  const exportJobs = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await fetch(`/api/visualization/export-jobs?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export jobs:', error);
    }
  };

  const countryColumns = [
    {
      title: 'Country',
      dataIndex: '_id',
      key: 'country',
      render: (country: string) => <span style={{ fontWeight: 'bold' }}>{country}</span>
    },
    {
      title: 'Jobs Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: number, b: number) => b - a,
      render: (count: number) => <span style={{ color: '#1890ff' }}>{count.toLocaleString()}</span>
    },
    {
      title: 'Average Salary',
      dataIndex: 'avgSalary',
      key: 'avgSalary',
      sorter: (a: number, b: number) => b - a,
      render: (salary: number) => <span>${Math.round(salary).toLocaleString()}</span>
    }
  ];

  const jobColumns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (title: string) => <span style={{ fontWeight: 'bold' }}>{title}</span>
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country'
    },
    {
      title: 'Salary Range',
      key: 'salary',
      render: (_, record: any) => (
        <span>${record.salaryMin.toLocaleString()} - ${record.salaryMax.toLocaleString()}</span>
      )
    },
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <div>
          {skills.slice(0, 3).map((skill, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>{skill}</Tag>
          ))}
          {skills.length > 3 && <Tag>+{skills.length - 3}</Tag>}
        </div>
      )
    }
  ];

  if (loading && !jobStats) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" tip="Loading visualization data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          📊 Data Visualization Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Analyze scraped job data with interactive charts and insights
        </p>
      </div>

      {/* Controls */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: '100%' }}
            placeholder="Select Timeframe"
          >
            <Option value="7">Last 7 Days</Option>
            <Option value="30">Last 30 Days</Option>
            <Option value="90">Last 90 Days</Option>
            <Option value="365">Last Year</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Button
            type="primary"
            icon={<Download />}
            onClick={() => exportJobs('csv')}
            style={{ width: '100%' }}
          >
            Export CSV
          </Button>
        </Col>
        <Col span={8}>
          <Button
            icon={<Download />}
            onClick={() => exportJobs('json')}
            style={{ width: '100%' }}
          >
            Export JSON
          </Button>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="📈 Overview" key="overview">
          <Row gutter={[16, 16]}>
            {/* Jobs by Country */}
            <Col span={12}>
              <Card title="🌍 Jobs by Country" style={{ height: '400px' }}>
                <BarChart width={500} height={300} data={jobStats?.jobsByCountry || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </Card>
            </Col>

            {/* Jobs by Skill */}
            <Col span={12}>
              <Card title="💻 Top Skills" style={{ height: '400px' }}>
                <BarChart width={500} height={300} data={jobStats?.jobsBySkill?.slice(0, 10) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </Card>
            </Col>

            {/* Salary Distribution */}
            <Col span={12}>
              <Card title="💰 Salary Distribution" style={{ height: '400px' }}>
                <PieChart width={500} height={300}>
                  <Pie
                    data={jobStats?.salaryDistribution?.map((item, index) => ({
                      name: item._id,
                      value: item.count,
                      fill: COLORS[index % COLORS.length]
                    })) || []}
                    cx={250}
                    cy={150}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
            </Col>

            {/* Job Types */}
            <Col span={12}>
              <Card title="📋 Job Types" style={{ height: '400px' }}>
                <PieChart width={500} height={300}>
                  <Pie
                    data={jobStats?.jobsByType?.map((item, index) => ({
                      name: item._id,
                      value: item.count,
                      fill: COLORS[index % COLORS.length]
                    })) || []}
                    cx={250}
                    cy={150}
                    labelLine={false}
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
            </Col>

            {/* Daily Trend */}
            <Col span={24}>
              <Card title="📅 Daily Job Postings Trend" style={{ height: '400px' }}>
                <LineChart width={1000} height={300} data={jobStats?.dailyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="_id" 
                    tickFormatter={(value) => {
                      const date = new Date(value.year, value.month - 1, value.day);
                      return date.toLocaleDateString();
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => [`${value} jobs`, 'Date']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="🏢 Top Companies" key="companies">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="🏢 Top Hiring Companies">
                <Table
                  columns={countryColumns}
                  dataSource={jobStats?.topCompanies?.map((item, index) => ({
                    ...item,
                    key: index
                  })) || []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="🤖 Scraping Statistics" key="scraping">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#1890ff', fontSize: '32px', fontWeight: 'bold' }}>
                    {scrapingStats?.recentJobs || 0}
                  </h3>
                  <p style={{ color: '#666' }}>Jobs (24h)</p>
                  <Users style={{ fontSize: '48px', color: '#ccc' }} />
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#52c41a', fontSize: '32px', fontWeight: 'bold' }}>
                    {scrapingStats?.weeklyJobs || 0}
                  </h3>
                  <p style={{ color: '#666' }}>Jobs (7 days)</p>
                  <Calendar style={{ fontSize: '48px', color: '#ccc' }} />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="📊 Source Performance">
                <Table
                  columns={[
                    {
                      title: 'Source',
                      dataIndex: '_id',
                      key: 'source',
                      render: (source: string) => <span style={{ fontWeight: 'bold' }}>{source}</span>
                    },
                    {
                      title: 'Total Jobs',
                      dataIndex: 'total',
                      key: 'total',
                      render: (total: number) => <span style={{ color: '#1890ff' }}>{total.toLocaleString()}</span>
                    },
                    {
                      title: 'Active Jobs',
                      dataIndex: 'active',
                      key: 'active',
                      render: (active: number) => <span style={{ color: '#52c41a' }}>{active.toLocaleString()}</span>
                    },
                    {
                      title: 'Success Rate',
                      dataIndex: 'successRate',
                      key: 'successRate',
                      render: (rate: number) => (
                        <span style={{ color: rate > 80 ? '#52c41a' : '#faad14' }}>
                          {rate.toFixed(1)}%
                        </span>
                      )
                    }
                  ]}
                  dataSource={scrapingStats?.sourceStats?.map((item, index) => ({
                    ...item,
                    key: index
                  })) || []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="📋 Job Details" key="details">
          <Card 
            title="📋 Detailed Job Listings" 
            extra={
              <Button 
                type="primary" 
                onClick={() => fetchJobDetails()}
                loading={jobDetailsLoading}
              >
                Refresh Data
              </Button>
            }
          >
            <Table
              columns={jobColumns}
              dataSource={jobDetails.map((job, index) => ({
                ...job,
                key: index
              }))}
              loading={jobDetailsLoading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DataVisualization;
