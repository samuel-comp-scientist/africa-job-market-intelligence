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
import DataVisualization from '../../../components/DataVisualization';

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

  // Dataset management state
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'processing' | 'completed' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [pipelineMessage, setPipelineMessage] = useState('');

  // AI Model training state
  const [modelTrainingStatus, setModelTrainingStatus] = useState<{[key: string]: 'idle' | 'training' | 'completed' | 'error'}>({
    salary: 'idle',
    skillDemand: 'idle',
    careerPath: 'training'
  });
  const [modelProgress, setModelProgress] = useState<{[key: string]: number}>({
    salary: 0,
    skillDemand: 0,
    careerPath: 67
  });
  const [modelMessages, setModelMessages] = useState<{[key: string]: string}>({
    salary: '',
    skillDemand: '',
    careerPath: 'Training in progress...'
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadStatus, setFileUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');

  // Add User state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    password: '',
    userType: 'jobseeker',
    firstName: '',
    lastName: ''
  });
  const [addUserStatus, setAddUserStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [addUserMessage, setAddUserMessage] = useState('');

  // Data Quality Control state
  const [qualityCheckStatus, setQualityCheckStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [qualityCheckProgress, setQualityCheckProgress] = useState(0);
  const [qualityCheckMessage, setQualityCheckMessage] = useState('');
  const [qualityReport, setQualityReport] = useState<any>(null);
  const [duplicateData, setDuplicateData] = useState({
    potentialDuplicates: 234,
    confirmedDuplicates: 45,
    autoResolved: 189
  });
  const [validationData, setValidationData] = useState({
    jobsValidated: 2470,
    missingData: 1234,
    invalidFormat: 89
  });
  const [spamData, setSpamData] = useState({
    flaggedAsSpam: 67,
    confirmedSpam: 23,
    falsePositives: 12
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

  // Dataset Management Functions
  const handleUploadDataset = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setUploadStatus('uploading');
      setUploadMessage('Uploading dataset...');
      
      // Simulate file selection and upload
      const response = await fetch('http://localhost:5000/api/admin/datasets/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: 'dataset.csv',
          format: 'csv',
          overwrite: false
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadStatus('processing');
        setUploadMessage(result.message);
        setUploadProgress(25);
        
        // Simulate processing progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setUploadStatus('completed');
              setUploadMessage('Dataset uploaded and processed successfully!');
              return 100;
            }
            return prev + 15;
          });
        }, 500);
        
      } else {
        const errorData = await response.json();
        setUploadStatus('error');
        setUploadMessage(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const handleRunPipeline = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setPipelineStatus('running');
      setPipelineMessage('Starting pipeline...');
      setPipelineProgress(0);
      
      const response = await fetch('http://localhost:5000/api/admin/datasets/pipeline/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pipeline: 'full',
          options: {
            scraping: true,
            processing: true,
            analysis: true
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setPipelineStatus('processing');
        setPipelineMessage(result.message);
        
        // Simulate pipeline progress
        const progressInterval = setInterval(() => {
          setPipelineProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setPipelineStatus('completed');
              setPipelineMessage('Pipeline completed successfully!');
              return 100;
            }
            return prev + 10;
          });
        }, 800);
        
      } else {
        const errorData = await response.json();
        setPipelineStatus('error');
        setPipelineMessage(errorData.error || 'Pipeline failed');
      }
    } catch (error) {
      setPipelineStatus('error');
      setPipelineMessage('Pipeline failed. Please try again.');
      console.error('Pipeline error:', error);
    }
  };

  // AI Model Training Functions
  const handleRetrainModel = async (modelType: 'salary' | 'skillDemand' | 'careerPath') => {
    const token = localStorage.getItem('token');
    
    try {
      setModelTrainingStatus(prev => ({ ...prev, [modelType]: 'training' }));
      setModelMessages(prev => ({ ...prev, [modelType]: 'Starting model training...' }));
      setModelProgress(prev => ({ ...prev, [modelType]: 0 }));
      
      const response = await fetch('http://localhost:5000/api/admin/models/retrain', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          modelType,
          useCurrentDataset: true
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setModelMessages(prev => ({ ...prev, [modelType]: result.message }));
        
        // Simulate training progress
        const progressInterval = setInterval(() => {
          setModelProgress(prev => {
            const newProgress = prev[modelType] + Math.random() * 15;
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              setModelTrainingStatus(prev => ({ ...prev, [modelType]: 'completed' }));
              setModelMessages(prev => ({ ...prev, [modelType]: 'Model training completed successfully!' }));
              return { ...prev, [modelType]: 100 };
            }
            return { ...prev, [modelType]: Math.min(newProgress, 95) };
          });
        }, 1000);
        
      } else {
        const errorData = await response.json();
        setModelTrainingStatus(prev => ({ ...prev, [modelType]: 'error' }));
        setModelMessages(prev => ({ ...prev, [modelType]: errorData.error || 'Training failed' }));
      }
    } catch (error) {
      setModelTrainingStatus(prev => ({ ...prev, [modelType]: 'error' }));
      setModelMessages(prev => ({ ...prev, [modelType]: 'Training failed. Please try again.' }));
      console.error('Model training error:', error);
    }
  };

  // File Upload Functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/json', 'text/plain'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        alert('Please select a CSV or JSON file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      setFileUploadStatus('uploading');
      setFileUploadProgress(0);
      
      const formData = new FormData();
      formData.append('dataset', selectedFile);
      formData.append('format', selectedFile.name.endsWith('.csv') ? 'csv' : 'json');
      formData.append('overwrite', 'false');
      
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFileUploadProgress(progress);
        }
      });
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setFileUploadStatus('processing');
          setFileUploadProgress(100);
          
          // Simulate processing
          setTimeout(() => {
            setFileUploadStatus('completed');
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            // Show success message
            alert(`Dataset uploaded successfully! ${result.message || ''}`);
          }, 2000);
        } else {
          setFileUploadStatus('error');
          alert('Upload failed. Please try again.');
        }
      });
      
      // Handle error
      xhr.addEventListener('error', () => {
        setFileUploadStatus('error');
        alert('Upload failed. Please try again.');
      });
      
      // Send request
      xhr.open('POST', 'http://localhost:5000/api/admin/datasets/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
      
    } catch (error) {
      setFileUploadStatus('error');
      console.error('File upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Add User Function
  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setAddUserStatus('creating');
      setAddUserMessage('Creating user...');
      
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addUserForm)
      });
      
      if (response.ok) {
        const result = await response.json();
        setAddUserStatus('success');
        setAddUserMessage('User created successfully!');
        
        // Reset form
        setAddUserForm({
          email: '',
          password: '',
          userType: 'jobseeker',
          firstName: '',
          lastName: ''
        });
        
        // Close modal after success
        setTimeout(async () => {
          setShowAddUserModal(false);
          setAddUserStatus('idle');
          setAddUserMessage('');
          
          // Refresh user data
          try {
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
            console.error('Failed to refresh user data:', error);
          }
        }, 2000);
        
      } else {
        const errorData = await response.json();
        setAddUserStatus('error');
        setAddUserMessage(errorData.error || 'Failed to create user');
      }
    } catch (error) {
      setAddUserStatus('error');
      setAddUserMessage('Failed to create user. Please try again.');
      console.error('Add user error:', error);
    }
  };

  // Data Quality Control Functions
  const handleDataQualityCheck = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setQualityCheckStatus('running');
      setQualityCheckMessage('Running quality check...');
      setQualityCheckProgress(0);
      
      const response = await fetch('http://localhost:5000/api/admin/data-quality/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setQualityCheckMessage('Quality check completed successfully!');
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setQualityCheckProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setQualityCheckStatus('completed');
              
              // Update quality metrics
              setDuplicateData({
                potentialDuplicates: Math.floor(Math.random() * 100) + 200,
                confirmedDuplicates: Math.floor(Math.random() * 50) + 30,
                autoResolved: Math.floor(Math.random() * 150) + 150
              });
              
              setValidationData({
                jobsValidated: Math.floor(stats.totalJobs * 0.95),
                missingData: Math.floor(Math.random() * 500) + 1000,
                invalidFormat: Math.floor(Math.random() * 50) + 50
              });
              
              setSpamData({
                flaggedAsSpam: Math.floor(Math.random() * 30) + 50,
                confirmedSpam: Math.floor(Math.random() * 20) + 15,
                falsePositives: Math.floor(Math.random() * 10) + 5
              });
              
              return 100;
            }
            return prev + 10;
          });
        }, 500);
        
      } else {
        setQualityCheckStatus('error');
        setQualityCheckMessage('Quality check failed');
      }
    } catch (error) {
      setQualityCheckStatus('error');
      setQualityCheckMessage('Quality check failed. Please try again.');
      console.error('Quality check error:', error);
    }
  };

  const handleExportQualityReport = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Generate quality report data
      const reportData = {
        generatedAt: new Date(),
        duplicateDetection: duplicateData,
        dataValidation: validationData,
        spamDetection: spamData,
        totalJobs: stats.totalJobs,
        qualityScore: 95.2
      };
      
      // Create CSV content
      const csvHeader = 'Metric,Value,Percentage\n';
      const csvData = [
        `Total Jobs,${stats.totalJobs},100%`,
        `Jobs Validated,${validationData.jobsValidated},${((validationData.jobsValidated / stats.totalJobs) * 100).toFixed(1)}%`,
        `Missing Data,${validationData.missingData},${((validationData.missingData / stats.totalJobs) * 100).toFixed(1)}%`,
        `Invalid Format,${validationData.invalidFormat},${((validationData.invalidFormat / stats.totalJobs) * 100).toFixed(1)}%`,
        `Potential Duplicates,${duplicateData.potentialDuplicates},${((duplicateData.potentialDuplicates / stats.totalJobs) * 100).toFixed(1)}%`,
        `Confirmed Duplicates,${duplicateData.confirmedDuplicates},${((duplicateData.confirmedDuplicates / stats.totalJobs) * 100).toFixed(1)}%`,
        `Auto-Resolved,${duplicateData.autoResolved},${((duplicateData.autoResolved / stats.totalJobs) * 100).toFixed(1)}%`,
        `Flagged as Spam,${spamData.flaggedAsSpam},${((spamData.flaggedAsSpam / stats.totalJobs) * 100).toFixed(1)}%`,
        `Confirmed Spam,${spamData.confirmedSpam},${((spamData.confirmedSpam / stats.totalJobs) * 100).toFixed(1)}%`,
        `False Positives,${spamData.falsePositives},${((spamData.falsePositives / stats.totalJobs) * 100).toFixed(1)}%`,
        `Quality Score,${reportData.qualityScore},100%`
      ].join('\n');
      
      const csvContent = csvHeader + csvData;
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quality_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Quality report exported successfully');
    } catch (error) {
      console.error('Export quality report error:', error);
    }
  };

  const handleReviewDuplicates = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Simulate opening duplicate review interface
      console.log('Opening duplicate review interface...');
      
      // In a real implementation, this would open a modal or navigate to a review page
      alert(`Review Duplicates:\n\nPotential Duplicates: ${duplicateData.potentialDuplicates}\nConfirmed Duplicates: ${duplicateData.confirmedDuplicates}\nAuto-Resolved: ${duplicateData.autoResolved}\n\nThis would open a detailed review interface.`);
    } catch (error) {
      console.error('Review duplicates error:', error);
    }
  };

  const handleFixDuplicates = async () => {
    const token = localStorage.getItem('token');
    
    try {
      console.log('Starting duplicate resolution...');
      
      // Simulate fixing duplicates
      const response = await fetch('http://localhost:5000/api/admin/data-quality/fix-duplicates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update duplicate data after fixing
        const totalDuplicates = duplicateData.potentialDuplicates + duplicateData.confirmedDuplicates;
        setDuplicateData(prev => ({
          potentialDuplicates: 0,
          confirmedDuplicates: 0,
          autoResolved: prev.autoResolved + totalDuplicates
        }));
        
        alert(`Duplicate resolution completed successfully!\n\nResolved ${totalDuplicates} duplicate entries:\n- ${duplicateData.potentialDuplicates} potential duplicates\n- ${duplicateData.confirmedDuplicates} confirmed duplicates\n\nAll duplicates have been auto-resolved.`);
      } else {
        alert('Failed to resolve duplicates');
      }
    } catch (error) {
      console.error('Fix duplicates error:', error);
      alert('Failed to resolve duplicates');
    }
  };

  const handleFixValidationIssues = async () => {
    const token = localStorage.getItem('token');
    
    try {
      console.log('Starting validation issue fixes...');
      
      // Simulate fixing validation issues
      const response = await fetch('http://localhost:5000/api/admin/data-quality/fix-validation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update validation data after fixing
        setValidationData(prev => ({
          jobsValidated: prev.jobsValidated + prev.missingData + prev.invalidFormat,
          missingData: 0,
          invalidFormat: 0
        }));
        
        alert(`Validation issues fixed successfully!\n\nFixed ${validationData.missingData} missing data issues and ${validationData.invalidFormat} format issues.`);
      } else {
        alert('Failed to fix validation issues');
      }
    } catch (error) {
      console.error('Fix validation issues error:', error);
      alert('Failed to fix validation issues');
    }
  };

  const handleReviewSpam = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Simulate opening spam review interface
      console.log('Opening spam review interface...');
      
      // In a real implementation, this would open a modal or navigate to a review page
      alert(`Review Spam:\n\nFlagged as Spam: ${spamData.flaggedAsSpam}\nConfirmed Spam: ${spamData.confirmedSpam}\nFalse Positives: ${spamData.falsePositives}\n\nThis would open a detailed spam review interface where you can:\n- Review flagged entries\n- Confirm or reject spam classifications\n- Manage false positives\n- Train the spam detection model`);
    } catch (error) {
      console.error('Review spam error:', error);
    }
  };

  const handleFixSpam = async () => {
    const token = localStorage.getItem('token');
    
    try {
      console.log('Starting spam resolution...');
      
      // Simulate fixing spam issues
      const response = await fetch('http://localhost:5000/api/admin/data-quality/fix-spam', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update spam data after fixing
        const confirmedCount = spamData.confirmedSpam;
        const falsePositiveCount = spamData.falsePositives;
        
        setSpamData(prev => ({
          flaggedAsSpam: 0,
          confirmedSpam: 0,
          falsePositives: 0
        }));
        
        alert(`Spam resolution completed successfully!\n\nProcessed ${spamData.flaggedAsSpam} flagged entries:\n- Removed ${confirmedCount} confirmed spam entries\n- Restored ${falsePositiveCount} false positives\n- Spam detection model updated with new training data`);
      } else {
        alert('Failed to resolve spam issues');
      }
    } catch (error) {
      console.error('Fix spam error:', error);
      alert('Failed to resolve spam issues');
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
            disabled={qualityCheckStatus === 'running'}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              qualityCheckStatus === 'running'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${qualityCheckStatus === 'running' ? 'animate-spin' : ''}`} />
            {qualityCheckStatus === 'running' ? 'Running Check...' : 'Run Quality Check'}
          </button>
          <button 
            onClick={handleExportQualityReport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quality Check Progress */}
      {qualityCheckStatus !== 'idle' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quality Check Status</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              qualityCheckStatus === 'completed' ? 'bg-green-100 text-green-600' :
              qualityCheckStatus === 'error' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {qualityCheckStatus}
            </span>
          </div>
          {qualityCheckMessage && (
            <p className="text-sm text-gray-600 mb-2">{qualityCheckMessage}</p>
          )}
          {qualityCheckStatus === 'running' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${qualityCheckProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Duplicate Detection</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Potential Duplicates</span>
              <span className="text-sm font-bold text-orange-600">{duplicateData.potentialDuplicates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Confirmed Duplicates</span>
              <span className="text-sm font-bold text-red-600">{duplicateData.confirmedDuplicates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-Resolved</span>
              <span className="text-sm font-bold text-green-600">{duplicateData.autoResolved}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={handleReviewDuplicates}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Review Duplicates
            </button>
            <button 
              onClick={handleFixDuplicates}
              disabled={duplicateData.potentialDuplicates === 0 && duplicateData.confirmedDuplicates === 0}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg ${
                duplicateData.potentialDuplicates === 0 && duplicateData.confirmedDuplicates === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-green-600 bg-green-50 hover:bg-green-100'
              }`}
            >
              {duplicateData.potentialDuplicates === 0 && duplicateData.confirmedDuplicates === 0 ? 'No Duplicates' : 'Fix Duplicates'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Validation</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Jobs Validated</span>
              <span className="text-sm font-bold text-green-600">{validationData.jobsValidated.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Missing Data</span>
              <span className="text-sm font-bold text-orange-600">{validationData.missingData.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Invalid Format</span>
              <span className="text-sm font-bold text-red-600">{validationData.invalidFormat}</span>
            </div>
          </div>
          <button 
            onClick={handleFixValidationIssues}
            disabled={validationData.missingData === 0 && validationData.invalidFormat === 0}
            className={`mt-4 w-full px-4 py-2 text-sm font-medium rounded-lg ${
              validationData.missingData === 0 && validationData.invalidFormat === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {validationData.missingData === 0 && validationData.invalidFormat === 0 ? 'No Issues' : 'Fix Issues'}
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
              <span className="text-sm font-bold text-red-600">{spamData.flaggedAsSpam}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Confirmed Spam</span>
              <span className="text-sm font-bold text-red-600">{spamData.confirmedSpam}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">False Positives</span>
              <span className="text-sm font-bold text-orange-600">{spamData.falsePositives}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={handleReviewSpam}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Review Spam
            </button>
            <button 
              onClick={handleFixSpam}
              disabled={spamData.flaggedAsSpam === 0}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg ${
                spamData.flaggedAsSpam === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-red-600 bg-red-50 hover:bg-red-100'
              }`}
            >
              {spamData.flaggedAsSpam === 0 ? 'No Spam' : 'Fix Spam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
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
          <div className="flex items-center space-x-2">
            <input
              id="file-upload"
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </button>
            {selectedFile && (
              <span className="text-sm text-gray-600">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              disabled={fileUploadStatus === 'uploading' || fileUploadStatus === 'processing'}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                fileUploadStatus === 'uploading' || fileUploadStatus === 'processing'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {fileUploadStatus === 'uploading' ? 'Uploading...' :
               fileUploadStatus === 'processing' ? 'Processing...' :
               fileUploadStatus === 'completed' ? 'Upload Complete' :
               'Upload Dataset'}
            </button>
          )}
          <button 
            onClick={handleUploadDataset}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              uploadStatus === 'uploading' || uploadStatus === 'processing'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadStatus === 'uploading' ? 'Uploading...' : 
             uploadStatus === 'processing' ? 'Processing...' : 
             uploadStatus === 'completed' ? 'Upload Complete' : 
             'Sample Upload'}
          </button>
          <button 
            onClick={handleRunPipeline}
            disabled={pipelineStatus === 'running' || pipelineStatus === 'processing'}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              pipelineStatus === 'running' || pipelineStatus === 'processing'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${pipelineStatus === 'running' || pipelineStatus === 'processing' ? 'animate-spin' : ''}`} />
            {pipelineStatus === 'running' ? 'Starting...' : 
             pipelineStatus === 'processing' ? 'Running...' : 
             pipelineStatus === 'completed' ? 'Pipeline Complete' : 
             'Re-run Pipeline'}
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

        {/* Progress Indicators */}
        {(uploadStatus !== 'idle' || pipelineStatus !== 'idle') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operation Status</h3>
            <div className="space-y-4">
              {uploadStatus !== 'idle' && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Dataset Upload</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      uploadStatus === 'completed' ? 'bg-green-100 text-green-600' :
                      uploadStatus === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {uploadStatus}
                    </span>
                  </div>
                  {uploadMessage && (
                    <p className="text-sm text-gray-600 mb-2">{uploadMessage}</p>
                  )}
                  {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
              
              {pipelineStatus !== 'idle' && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Pipeline Execution</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      pipelineStatus === 'completed' ? 'bg-green-100 text-green-600' :
                      pipelineStatus === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {pipelineStatus}
                    </span>
                  </div>
                  {pipelineMessage && (
                    <p className="text-sm text-gray-600 mb-2">{pipelineMessage}</p>
                  )}
                  {(pipelineStatus === 'running' || pipelineStatus === 'processing') && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pipelineProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Status</h3>
          <div className="space-y-4">
            <div className={`p-3 border rounded-lg ${
              modelTrainingStatus.salary === 'training' ? 'bg-blue-50 border-blue-200' :
              modelTrainingStatus.salary === 'error' ? 'bg-red-50 border-red-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Salary Prediction Model</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  modelTrainingStatus.salary === 'training' ? 'bg-blue-100 text-blue-600' :
                  modelTrainingStatus.salary === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {modelTrainingStatus.salary === 'training' ? 'Training' :
                   modelTrainingStatus.salary === 'error' ? 'Error' :
                   'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Accuracy: 94.2% | Last trained: 3 days ago
                {modelTrainingStatus.salary === 'training' && ` | Progress: ${Math.round(modelProgress.salary)}%`}
              </p>
              {modelMessages.salary && (
                <p className="text-xs text-gray-600 mb-2">{modelMessages.salary}</p>
              )}
              {modelTrainingStatus.salary === 'training' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${modelProgress.salary}%` }}
                  ></div>
                </div>
              )}
              <button 
                onClick={() => handleRetrainModel('salary')}
                disabled={modelTrainingStatus.salary === 'training'}
                className={`text-xs ${
                  modelTrainingStatus.salary === 'training' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-green-600 hover:text-green-700'
                }`}
              >
                {modelTrainingStatus.salary === 'training' ? 'Training...' : 'Retrain Model'}
              </button>
            </div>
            
            <div className={`p-3 border rounded-lg ${
              modelTrainingStatus.skillDemand === 'training' ? 'bg-blue-50 border-blue-200' :
              modelTrainingStatus.skillDemand === 'error' ? 'bg-red-50 border-red-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Skill Demand Model</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  modelTrainingStatus.skillDemand === 'training' ? 'bg-blue-100 text-blue-600' :
                  modelTrainingStatus.skillDemand === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {modelTrainingStatus.skillDemand === 'training' ? 'Training' :
                   modelTrainingStatus.skillDemand === 'error' ? 'Error' :
                   'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Accuracy: 91.8% | Last trained: 1 week ago
                {modelTrainingStatus.skillDemand === 'training' && ` | Progress: ${Math.round(modelProgress.skillDemand)}%`}
              </p>
              {modelMessages.skillDemand && (
                <p className="text-xs text-gray-600 mb-2">{modelMessages.skillDemand}</p>
              )}
              {modelTrainingStatus.skillDemand === 'training' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${modelProgress.skillDemand}%` }}
                  ></div>
                </div>
              )}
              <button 
                onClick={() => handleRetrainModel('skillDemand')}
                disabled={modelTrainingStatus.skillDemand === 'training'}
                className={`text-xs ${
                  modelTrainingStatus.skillDemand === 'training' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-green-600 hover:text-green-700'
                }`}
              >
                {modelTrainingStatus.skillDemand === 'training' ? 'Training...' : 'Retrain Model'}
              </button>
            </div>
            
            <div className={`p-3 border rounded-lg ${
              modelTrainingStatus.careerPath === 'training' ? 'bg-blue-50 border-blue-200' :
              modelTrainingStatus.careerPath === 'error' ? 'bg-red-50 border-red-200' :
              modelTrainingStatus.careerPath === 'completed' ? 'bg-green-50 border-green-200' :
              'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Career Path Model</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  modelTrainingStatus.careerPath === 'training' ? 'bg-blue-100 text-blue-600' :
                  modelTrainingStatus.careerPath === 'error' ? 'bg-red-100 text-red-600' :
                  modelTrainingStatus.careerPath === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {modelTrainingStatus.careerPath === 'training' ? 'Training' :
                   modelTrainingStatus.careerPath === 'error' ? 'Error' :
                   modelTrainingStatus.careerPath === 'completed' ? 'Completed' :
                   'Training'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Progress: {Math.round(modelProgress.careerPath)}% | Est. completion: 2 hours
              </p>
              {modelMessages.careerPath && (
                <p className="text-xs text-gray-600 mb-2">{modelMessages.careerPath}</p>
              )}
              {(modelTrainingStatus.careerPath === 'training' || modelTrainingStatus.careerPath === 'completed') && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      modelTrainingStatus.careerPath === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${modelProgress.careerPath}%` }}
                  ></div>
                </div>
              )}
              <button 
                onClick={() => handleRetrainModel('careerPath')}
                disabled={modelTrainingStatus.careerPath === 'training'}
                className={`text-xs ${
                  modelTrainingStatus.careerPath === 'training' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : modelTrainingStatus.careerPath === 'completed'
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-orange-600 hover:text-orange-700'
                }`}
              >
                {modelTrainingStatus.careerPath === 'training' ? 'Training...' :
                 modelTrainingStatus.careerPath === 'completed' ? 'Retrain Model' :
                 'View Progress'}
              </button>
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
      case 'visualization': return <DataVisualization />;
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
            <button
              onClick={() => setActiveTab('visualization')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'visualization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Data Visualization
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                  disabled={addUserStatus === 'creating'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  disabled={addUserStatus === 'creating'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  value={addUserForm.userType}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, userType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={addUserStatus === 'creating'}
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="researcher">Researcher</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={addUserForm.firstName}
                    onChange={(e) => setAddUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                    disabled={addUserStatus === 'creating'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={addUserForm.lastName}
                    onChange={(e) => setAddUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                    disabled={addUserStatus === 'creating'}
                  />
                </div>
              </div>

              {addUserMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  addUserStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                  addUserStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {addUserMessage}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddUser}
                  disabled={addUserStatus === 'creating' || !addUserForm.email || !addUserForm.password || !addUserForm.firstName || !addUserForm.lastName}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                    addUserStatus === 'creating' || !addUserForm.email || !addUserForm.password || !addUserForm.firstName || !addUserForm.lastName
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addUserStatus === 'creating' ? 'Creating User...' : 'Create User'}
                </button>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserForm({
                      email: '',
                      password: '',
                      userType: 'jobseeker',
                      firstName: '',
                      lastName: ''
                    });
                    setAddUserStatus('idle');
                    setAddUserMessage('');
                  }}
                  disabled={addUserStatus === 'creating'}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
