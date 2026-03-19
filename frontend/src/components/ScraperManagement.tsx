import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Progress, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Tabs, 
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Switch,
  TimePicker,
  DatePicker,
  InputNumber,
  Drawer
} from 'antd';
import { 
  Database, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  ExclamationCircle,
  RefreshCw,
  Clock,
  Calendar,
  FileText,
  AlertTriangle,
  Settings,
  Eye,
  Trash2,
  Download,
  FilterList,
  Schedule,
  Activity,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  successRate: number;
  avgDuration: number;
}

interface ScraperLog {
  id: string;
  source: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  jobsFound: number;
  jobsSaved: number;
  errors: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
  performance: {
    successRate: number;
    requestsPerSecond: number;
    dataQuality: number;
  };
}

interface Schedule {
  id: string;
  scraperId: string;
  scraperName: string;
  frequency: string;
  nextRun: string;
  enabled: boolean;
  lastRun: string;
  timezone: string;
}

const ScraperManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [logs, setLogs] = useState<ScraperLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScraper, setSelectedScraper] = useState<Scraper | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [logsDrawerVisible, setLogsDrawerVisible] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState<any>({});
  const [activeTab, setActiveTab] = useState('scrapers');
  const [logFilters, setLogFilters] = useState({
    source: '',
    status: '',
    dateRange: null as any,
    limit: 50
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadScraperData();
  }, []);

  const loadScraperData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadScrapers(),
        loadSchedules(),
        loadErrorAnalysis()
      ]);
    } catch (error) {
      message.error('Failed to load scraper data');
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

  const loadSchedules = async () => {
    try {
      const response = await fetch('/api/admin/scheduler/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    }
  };

  const loadLogs = async (filters = logFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters.source) params.append('source', filters.source);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange[0].toISOString());
        params.append('endDate', filters.dateRange[1].toISOString());
      }
      params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/admin/scraper/logs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const loadErrorAnalysis = async () => {
    try {
      const response = await fetch('/api/admin/scraper/errors/analysis', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setErrorAnalysis(data);
    } catch (error) {
      console.error('Failed to load error analysis:', error);
    }
  };

  const runScraperManually = async (scraperId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/scrapers/${scraperId}/run`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${scraperId} started successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to run scraper');
      }
    } catch (error) {
      message.error('Failed to run scraper');
    }
    setLoading(false);
  };

  const createSchedule = async (values: any) => {
    try {
      const response = await fetch('/api/admin/scheduler/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const result = await response.json();
      
      if (result.success) {
        message.success('Schedule created successfully');
        setScheduleModalVisible(false);
        await loadSchedules();
      } else {
        message.error(result.message || 'Failed to create schedule');
      }
    } catch (error) {
      message.error('Failed to create schedule');
    }
  };

  const pauseScraper = async (scraperId: string) => {
    try {
      const response = await fetch(`/api/admin/scrapers/${scraperId}/pause`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${scraperId} paused successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to pause scraper');
      }
    } catch (error) {
      message.error('Failed to pause scraper');
    }
  };

  const resumeScraper = async (scraperId: string) => {
    try {
      const response = await fetch(`/api/admin/scrapers/${scraperId}/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${scraperId} resumed successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to resume scraper');
      }
    } catch (error) {
      message.error('Failed to resume scraper');
    }
  };

  const stopScraper = async (scraperId: string) => {
    try {
      const response = await fetch(`/api/admin/scrapers/${scraperId}/stop`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Scraper ${scraperId} stopped successfully`);
        await loadScrapers();
      } else {
        message.error(result.message || 'Failed to stop scraper');
      }
    } catch (error) {
      message.error('Failed to stop scraper');
    }
  };

  const toggleSchedule = async (scheduleId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/scheduler/${scheduleId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(`Schedule ${enabled ? 'enabled' : 'disabled'} successfully`);
        await loadSchedules();
      } else {
        message.error(result.message || 'Failed to toggle schedule');
      }
    } catch (error) {
      message.error('Failed to toggle schedule');
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/admin/scheduler/${scheduleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        message.success('Schedule deleted successfully');
        await loadSchedules();
      } else {
        message.error(result.message || 'Failed to delete schedule');
      }
    } catch (error) {
      message.error('Failed to delete schedule');
    }
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (logFilters.source) params.append('source', logFilters.source);
      if (logFilters.status) params.append('status', logFilters.status);
      if (logFilters.dateRange) {
        params.append('startDate', logFilters.dateRange[0].toISOString());
        params.append('endDate', logFilters.dateRange[1].toISOString());
      }

      const response = await fetch(`/api/admin/scraper/logs/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const blob = new Blob([data.content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scraper-logs-${moment().format('YYYY-MM-DD')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('Failed to export logs');
      }
    } catch (error) {
      message.error('Failed to export logs');
    }
  };

  const scraperColumns = [
    {
      title: 'Scraper',
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
      title: 'Performance',
      key: 'performance',
      render: (_: any, record: Scraper) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Success Rate: <strong>{record.successRate}%</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Avg Duration: <strong>{record.avgDuration}s</strong>
          </div>
        </div>
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
        <span style={{ color: 'black' }}>{moment(date).fromNow()}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Scraper) => (
        <Space>
          <Tooltip title="Run Manually">
            <Button
              size="small"
              type="primary"
              icon={<PlayCircle size={16} />}
              onClick={() => runScraperManually(record.id)}
              disabled={record.status === 'running'}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Pause">
            <Button
              size="small"
              icon={<PauseCircle size={16} />}
              onClick={() => pauseScraper(record.id)}
              disabled={record.status !== 'running'}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Resume">
            <Button
              size="small"
              type="default"
              icon={<PlayCircle size={16} />}
              onClick={() => resumeScraper(record.id)}
              disabled={record.status === 'running'}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Stop">
            <Button
              size="small"
              danger
              icon={<PauseCircle size={16} />}
              onClick={() => stopScraper(record.id)}
              disabled={record.status !== 'running'}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="View Logs">
            <Button
              size="small"
              icon={<Eye size={16} />}
              onClick={() => {
                setSelectedScraper(record);
                setLogFilters({ ...logFilters, source: record.name });
                loadLogs({ ...logFilters, source: record.name });
                setLogsDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Schedule">
            <Button
              size="small"
              icon={<Calendar size={16} />}
              onClick={() => {
                setSelectedScraper(record);
                setScheduleModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const scheduleColumns = [
    {
      title: 'Scraper',
      dataIndex: 'scraperName',
      key: 'scraperName',
      render: (text: string) => (
        <span style={{ color: 'black', fontWeight: 'bold' }}>{text}</span>
      )
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq: string) => (
        <Tag color="blue">{freq.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRun',
      key: 'nextRun',
      render: (date: string) => (
        <span style={{ color: 'black' }}>{moment(date).fromNow()}</span>
      )
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      render: (date: string) => (
        <span style={{ color: 'black' }}>{moment(date).fromNow()}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Schedule) => (
        <Switch
          checked={enabled}
          onChange={(checked) => toggleSchedule(record.id, checked)}
          size="small"
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Schedule) => (
        <Space>
          <Button
            size="small"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => {
              Modal.confirm({
                title: 'Delete Schedule',
                content: `Are you sure you want to delete the schedule for ${record.scraperName}?`,
                onOk: () => deleteSchedule(record.id)
              });
            }}
          />
        </Space>
      )
    }
  ];

  const logColumns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => (
        <span style={{ color: 'black', fontWeight: 'bold' }}>{source}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          success: 'green',
          failed: 'red',
          partial: 'orange',
          skipped: 'gray'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => (
        <span>{(duration / 1000).toFixed(2)}s</span>
      )
    },
    {
      title: 'Jobs',
      key: 'jobs',
      render: (_: any, record: ScraperLog) => (
        <div>
          <div style={{ fontSize: '12px' }}>Found: <strong>{record.jobsFound}</strong></div>
          <div style={{ fontSize: '12px' }}>Saved: <strong>{record.jobsSaved}</strong></div>
        </div>
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_: any, record: ScraperLog) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            Success: <strong>{record.performance.successRate}%</strong>
          </div>
          <div style={{ fontSize: '12px' }}>
            Quality: <strong>{record.performance.dataQuality}%</strong>
          </div>
        </div>
      )
    },
    {
      title: 'Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => (
        <span style={{ color: 'black' }}>{moment(time).format('MMM DD, HH:mm')}</span>
      )
    }
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Scraper Management</h1>
        <p className="text-black">Manage job scrapers, schedules, and monitor performance</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Scrapers"
              value={scrapers.filter(s => s.status === 'running').length}
              suffix={`/ ${scrapers.length}`}
              prefix={<Activity />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Jobs Today"
              value={scrapers.reduce((sum, s) => sum + s.jobsCollected, 0)}
              prefix={<Database />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Error Rate"
              value={errorAnalysis.errorRate || 0}
              suffix="%"
              prefix={errorAnalysis.errorRate > 5 ? <TrendingUp /> : <TrendingDown />}
              valueStyle={{ color: errorAnalysis.errorRate > 5 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Schedules"
              value={schedules.filter(s => s.enabled).length}
              suffix={`/ ${schedules.length}`}
              prefix={<Schedule />}
              valueStyle={{ color: 'black' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Error Alerts */}
      {errorAnalysis.criticalErrors && errorAnalysis.criticalErrors.length > 0 && (
        <Alert
          message="Critical Errors Detected"
          description={
            <div>
              {errorAnalysis.criticalErrors.slice(0, 3).map((error: any, index: number) => (
                <div key={index} className="mb-2">
                  <strong>{error.source}:</strong> {error.message}
                </div>
              ))}
            </div>
          }
          type="error"
          showIcon
          closable
          className="mb-6"
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Scrapers" key="scrapers">
          <Card 
            title="🔧 Active Scrapers"
            extra={
              <Space>
                <Button
                  icon={<RefreshCw />}
                  onClick={loadScraperData}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<Calendar />}
                  onClick={() => setScheduleModalVisible(true)}
                >
                  Add Schedule
                </Button>
              </Space>
            }
          >
            <Table
              columns={scraperColumns}
              dataSource={scrapers}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Schedules" key="schedules">
          <Card 
            title="📅 Automatic Scheduling"
            extra={
              <Space>
                <Button
                  icon={<RefreshCw />}
                  onClick={loadSchedules}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<Plus />}
                  onClick={() => setScheduleModalVisible(true)}
                >
                  New Schedule
                </Button>
              </Space>
            }
          >
            <Table
              columns={scheduleColumns}
              dataSource={schedules}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Logs" key="logs">
          <Card 
            title="📋 Scraper Logs"
            extra={
              <Space>
                <Select
                  placeholder="Filter by source"
                  style={{ width: 150 }}
                  allowClear
                  value={logFilters.source}
                  onChange={(value) => {
                    const newFilters = { ...logFilters, source: value };
                    setLogFilters(newFilters);
                    loadLogs(newFilters);
                  }}
                >
                  {scrapers.map(scraper => (
                    <Option key={scraper.id} value={scraper.name}>{scraper.name}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="Filter by status"
                  style={{ width: 120 }}
                  allowClear
                  value={logFilters.status}
                  onChange={(value) => {
                    const newFilters = { ...logFilters, status: value };
                    setLogFilters(newFilters);
                    loadLogs(newFilters);
                  }}
                >
                  <Option value="success">Success</Option>
                  <Option value="failed">Failed</Option>
                  <Option value="partial">Partial</Option>
                  <Option value="skipped">Skipped</Option>
                </Select>
                <RangePicker
                  onChange={(dates) => {
                    const newFilters = { ...logFilters, dateRange: dates };
                    setLogFilters(newFilters);
                    loadLogs(newFilters);
                  }}
                />
                <Button
                  icon={<Download />}
                  onClick={exportLogs}
                >
                  Export
                </Button>
                <Button
                  icon={<RefreshCw />}
                  onClick={() => loadLogs()}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            }
          >
            <Table
              columns={logColumns}
              dataSource={logs}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              expandable={{
                expandedRowRender: (record: ScraperLog) => (
                  <div style={{ margin: 0 }}>
                    {record.errors.length > 0 && (
                      <div className="mb-4">
                        <h4>Errors:</h4>
                        <Timeline>
                          {record.errors.map((error, index) => (
                            <Timeline.Item key={index} color="red">
                              <div>
                                <strong>{error.type}</strong>: {error.message}
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  {moment(error.timestamp).format('HH:mm:ss')}
                                </div>
                              </div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </div>
                    )}
                    <div>
                      <h4>Performance Details:</h4>
                      <Row gutter={16}>
                        <Col span={6}>
                          <Statistic title="Success Rate" value={record.performance.successRate} suffix="%" />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Requests/sec" value={record.performance.requestsPerSecond} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Data Quality" value={record.performance.dataQuality} suffix="%" />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Duration" value={(record.duration / 1000).toFixed(2)} suffix="sec" />
                        </Col>
                      </Row>
                    </div>
                  </div>
                ),
                rowExpandable: (record) => record.errors.length > 0 || record.performance
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Schedule Modal */}
      <Modal
        title="Create Schedule"
        visible={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={createSchedule}
          initialValues={{
            frequency: 'daily',
            timezone: 'UTC',
            enabled: true
          }}
        >
          <Form.Item
            name="scraperId"
            label="Scraper"
            rules={[{ required: true, message: 'Please select a scraper' }]}
          >
            <Select placeholder="Select scraper">
              {scrapers.map(scraper => (
                <Option key={scraper.id} value={scraper.id}>{scraper.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Frequency"
            rules={[{ required: true, message: 'Please select frequency' }]}
          >
            <Select>
              <Option value="hourly">Hourly</Option>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="Run Time"
            rules={[{ required: true, message: 'Please select run time' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="timezone"
            label="Timezone"
            rules={[{ required: true, message: 'Please select timezone' }]}
          >
            <Select>
              <Option value="UTC">UTC</Option>
              <Option value="Africa/Lagos">Africa/Lagos</Option>
              <Option value="Africa/Nairobi">Africa/Nairobi</Option>
              <Option value="Africa/Johannesburg">Africa/Johannesburg</Option>
              <Option value="Africa/Cairo">Africa/Cairo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Schedule
              </Button>
              <Button onClick={() => setScheduleModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Logs Drawer */}
      <Drawer
        title={`Logs for ${selectedScraper?.name}`}
        placement="right"
        onClose={() => setLogsDrawerVisible(false)}
        visible={logsDrawerVisible}
        width={800}
      >
        <Table
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true
          }}
          size="small"
        />
      </Drawer>
    </div>
  );
};

export default ScraperManagement;
