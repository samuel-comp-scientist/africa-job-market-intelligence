import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Progress, message, Modal, Form, Input, Select, Row, Col, Statistic, Space } from 'antd';
import { 
  Database, 
  Users, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  ExclamationCircle,
  RefreshCw,
  UserPlus,
  Filter,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

interface Scraper {
  id: string;
  name: string;
  status: string;
  lastRun: string;
  nextRun: string;
  jobsCollected: number;
  errors: number;
  country: string;
  enabled: boolean;
}

interface User {
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
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>({});
  const [dataQuality, setDataQuality] = useState<any>({});
  const [testUsersCreated, setTestUsersCreated] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadScrapers(),
        loadUsers(),
        loadStats(),
        loadDataQuality()
      ]);
    } catch (error) {
      message.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const loadScrapers = async () => {
    try {
      const response = await fetch('/api/admin/scrapers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setScrapers(data);
    } catch (error) {
      console.error('Failed to load scrapers:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/scraping/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadDataQuality = async () => {
    try {
      const response = await fetch('/api/admin/data-quality', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDataQuality(data);
    } catch (error) {
      console.error('Failed to load data quality:', error);
    }
  };

  const startAllScrapers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/scrapers/start-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success('All scrapers started successfully');
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to start scrapers');
      }
    } catch (error) {
      message.error('Failed to start scrapers');
    }
    setLoading(false);
  };

  const startScraper = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scrapers/${id}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${id} started successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to start scraper');
      }
    } catch (error) {
      message.error('Failed to start scraper');
    }
  };

  const stopScraper = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scrapers/${id}/stop`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${id} stopped successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to stop scraper');
      }
    } catch (error) {
      message.error('Failed to stop scraper');
    }
  };

  const runDataQualityCheck = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/data-quality/check', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success('Data quality check completed');
        await loadDataQuality();
      } else {
        message.error(result.message || 'Failed to run data quality check');
      }
    } catch (error) {
      message.error('Failed to run data quality check');
    }
    setLoading(false);
  };

  const createTestUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/create-test-users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success('Test users created successfully');
        setTestUsersCreated(true);
        await loadUsers();
        
        // Show user details
        Modal.info({
          title: 'Test Users Created',
          content: (
            <div>
              <p>The following test users have been created:</p>
              {result.users.map((user: any, index: number) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <strong>{user.email}</strong> ({user.userType}) - Password: <code>{user.password}</code>
                </div>
              ))}
            </div>
          ),
          width: 600
        });
      } else {
        message.error(result.message || 'Failed to create test users');
      }
    } catch (error) {
      message.error('Failed to create test users');
    }
    setLoading(false);
  };

  const scraperColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Scraper) => (
        <div>
          <div style={{ fontWeight: 'bold', color: 'black' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.country}</div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'running' ? 'green' : status === 'error' ? 'red' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Jobs Collected',
      dataIndex: 'jobsCollected',
      key: 'jobsCollected',
      render: (count: number) => (
        <span style={{ color: 'black', fontWeight: 'bold' }}>{count.toLocaleString()}</span>
      )
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      render: (date: string) => (
        <span style={{ color: 'black' }}>{new Date(date).toLocaleDateString()}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Scraper) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<PlayCircle size={16} />}
            onClick={() => startScraper(record.id)}
            disabled={record.status === 'running'}
          >
            Start
          </Button>
          <Button
            size="small"
            danger
            icon={<PauseCircle size={16} />}
            onClick={() => stopScraper(record.id)}
            disabled={record.status !== 'running'}
          >
            Stop
          </Button>
        </Space>
      )
    }
  ];

  const userColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ color: 'black', fontWeight: 'bold' }}>{email}</span>
      )
    },
    {
      title: 'Name',
      dataIndex: ['profile', 'firstName'],
      key: 'name',
      render: (_: any, record: User) => (
        <span style={{ color: 'black' }}>
          {record.profile.firstName} {record.profile.lastName}
        </span>
      )
    },
    {
      title: 'Role',
      dataIndex: 'userType',
      key: 'userType',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'recruiter' ? 'purple' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Verified',
      dataIndex: ['verification', 'emailVerified'],
      key: 'verified',
      render: (verified: boolean) => (
        <Tag color={verified ? 'green' : 'orange'}>
          {verified ? 'Verified' : 'Pending'}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ color: 'black' }}>{new Date(date).toLocaleDateString()}</span>
      )
    }
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
        <p className="text-black">Manage scrapers, users, and data quality</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Jobs"
              value={stats.totalJobs || 0}
              prefix={<Database />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={users.length}
              prefix={<Users />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Data Quality"
              value={dataQuality.qualityScore || 0}
              suffix="%"
              prefix={<CheckCircle />}
              valueStyle={{ color: dataQuality.qualityScore > 80 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Scrapers"
              value={scrapers.filter(s => s.status === 'running').length}
              suffix={`/ ${scrapers.length}`}
              prefix={<RefreshCw />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card className="mb-6">
        <Space wrap>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircle />}
            onClick={startAllScrapers}
            loading={loading}
          >
            Start All Scrapers
          </Button>
          <Button
            size="large"
            icon={<Filter />}
            onClick={runDataQualityCheck}
            loading={loading}
          >
            Run Data Quality Check
          </Button>
          <Button
            size="large"
            icon={<UserPlus />}
            onClick={createTestUsers}
            loading={loading}
            disabled={testUsersCreated}
          >
            Create Test Users
          </Button>
          <Button
            size="large"
            icon={<RefreshCw />}
            onClick={loadDashboardData}
            loading={loading}
          >
            Refresh Dashboard
          </Button>
        </Space>
      </Card>

      {/* Scrapers Table */}
      <Card title="🔧 Scraper Management" className="mb-6">
        <Table
          columns={scraperColumns}
          dataSource={scrapers}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Users Table */}
      <Card title="👥 User Management">
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="email"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
