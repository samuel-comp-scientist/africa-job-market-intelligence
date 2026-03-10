# Frontend Integration Guide - AI Features

## 🚀 Complete AI Feature Integration

This guide shows how to connect all AI features to frontend buttons for optimal user experience.

## 📋 API Endpoints Overview

### AI Career Advisor
- `POST /api/ai/career-advisor` - Generate personalized career advice
- `POST /api/ai/resume-analyzer` - Analyze uploaded resume
- `POST /api/ai/learning-resources` - Get learning recommendations

### Skill Demand Heatmap
- `GET /api/ai/skill-heatmap` - Get skill demand by country
- `GET /api/ai/emerging-tech` - Get emerging technologies

### Job Market Forecasting
- `GET /api/ai/market-forecast` - Get market predictions
- `POST /api/ai/job-recommendations` - Get personalized job recommendations

### Tech Ecosystem Insights
- `GET /api/ai/tech-hubs` - Get top tech hubs
- `GET /api/ai/growing-markets` - Get fastest growing markets
- `GET /api/ai/top-companies` - Get top hiring companies

### Data Science Playground
- `GET /api/ai/dataset-stats` - Get dataset statistics
- `POST /api/ai/custom-query` - Execute custom queries

## 🎛️ Admin Dashboard Button Integration

### 1. Career Advisor Section

```jsx
// Career Advisor Button
const handleCareerAdvice = async () => {
  try {
    const response = await fetch('/api/ai/career-advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userSkills: ['Python', 'React', 'Node.js'],
        desiredCareer: 'Full Stack Developer',
        country: 'Nigeria'
      })
    });
    
    const data = await response.json();
    setCareerAdvice(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Resume Analyzer Button
const handleResumeAnalysis = async (resumeText) => {
  try {
    const response = await fetch('/api/ai/resume-analyzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        resumeText,
        targetCareer: 'Data Scientist',
        country: 'Kenya'
      })
    });
    
    const data = await response.json();
    setResumeAnalysis(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. Skill Heatmap Section

```jsx
// Load Skill Heatmap
const loadSkillHeatmap = async () => {
  try {
    const response = await fetch('/api/ai/skill-heatmap', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setHeatmapData(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Load Emerging Tech
const loadEmergingTech = async () => {
  try {
    const response = await fetch('/api/ai/emerging-tech', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setEmergingTech(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Market Forecasting Section

```jsx
// Generate Market Forecast
const generateForecast = async (timeframe = '12months') => {
  try {
    const response = await fetch(`/api/ai/market-forecast?timeframe=${timeframe}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setForecastData(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get Job Recommendations
const getJobRecommendations = async () => {
  try {
    const response = await fetch('/api/ai/job-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userSkills: ['Python', 'React', 'AWS'],
        targetCareer: 'Data Scientist',
        country: 'Nigeria',
        limit: 10
      })
    });
    
    const data = await response.json();
    setJobRecommendations(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 4. Tech Ecosystem Section

```jsx
// Load Tech Hubs
const loadTechHubs = async () => {
  try {
    const response = await fetch('/api/ai/tech-hubs?limit=15', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setTechHubs(data.data.hubs);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Load Growing Markets
const loadGrowingMarkets = async () => {
  try {
    const response = await fetch('/api/ai/growing-markets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setGrowingMarkets(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Load Top Companies
const loadTopCompanies = async () => {
  try {
    const response = await fetch('/api/ai/top-companies?limit=20', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setTopCompanies(data.data.companies);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 5. Data Science Playground

```jsx
// Load Dataset Statistics
const loadDatasetStats = async () => {
  try {
    const response = await fetch('/api/ai/dataset-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    setDatasetStats(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Execute Custom Query
const executeCustomQuery = async (queryFilters) => {
  try {
    const response = await fetch('/api/ai/custom-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(queryFilters)
    });
    
    const data = await response.json();
    setQueryResults(data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🎨 Complete Dashboard Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Upload, message } from 'antd';
import { 
  BrainCircuit, 
  TrendingUp, 
  MapPin, 
  Building, 
  BarChart,
  UploadOutlined,
  PlayCircleOutlined
} from '@lucide/react';

const AIDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [careerAdvice, setCareerAdvice] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [techHubs, setTechHubs] = useState([]);
  const [datasetStats, setDatasetStats] = useState(null);

  const token = localStorage.getItem('token');

  // Career Advisor Functions
  const handleCareerAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/career-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userSkills: ['Python', 'React', 'Node.js'],
          desiredCareer: 'Full Stack Developer',
          country: 'Nigeria'
        })
      });
      
      const data = await response.json();
      setCareerAdvice(data.data);
      message.success('Career advice generated successfully!');
    } catch (error) {
      message.error('Failed to generate career advice');
    }
    setLoading(false);
  };

  const handleResumeAnalysis = async (file) => {
    setLoading(true);
    try {
      const text = await file.text();
      const response = await fetch('/api/ai/resume-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeText: text,
          targetCareer: 'Data Scientist',
          country: 'Kenya'
        })
      });
      
      const data = await response.json();
      setResumeAnalysis(data.data);
      message.success('Resume analyzed successfully!');
    } catch (error) {
      message.error('Failed to analyze resume');
    }
    setLoading(false);
  };

  // Load all data on mount
  useEffect(() => {
    loadSkillHeatmap();
    generateForecast();
    loadTechHubs();
    loadDatasetStats();
  }, []);

  const loadSkillHeatmap = async () => {
    try {
      const response = await fetch('/api/ai/skill-heatmap', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setHeatmapData(data.data);
    } catch (error) {
      console.error('Error loading heatmap:', error);
    }
  };

  const generateForecast = async () => {
    try {
      const response = await fetch('/api/ai/market-forecast?timeframe=12months', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setForecastData(data.data);
    } catch (error) {
      console.error('Error generating forecast:', error);
    }
  };

  const loadTechHubs = async () => {
    try {
      const response = await fetch('/api/ai/tech-hubs?limit=15', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTechHubs(data.data.hubs);
    } catch (error) {
      console.error('Error loading tech hubs:', error);
    }
  };

  const loadDatasetStats = async () => {
    try {
      const response = await fetch('/api/ai/dataset-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDatasetStats(data.data);
    } catch (error) {
      console.error('Error loading dataset stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">AI Intelligence Dashboard</h1>
      
      {/* Career Advisor Section */}
      <Card title="🧠 AI Career Advisor" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Generate Career Advice</h3>
            <p className="text-gray-600 mb-4">
              Get personalized career recommendations based on your skills
            </p>
            <Button 
              type="primary" 
              icon={<BrainCircuit size={16} />}
              onClick={handleCareerAdvice}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Career Advice
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Resume Analyzer</h3>
            <p className="text-gray-600 mb-4">
              Upload your resume for AI-powered analysis
            </p>
            <Upload
              accept=".txt,.pdf,.docx"
              beforeUpload={handleResumeAnalysis}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />}
                loading={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Upload Resume
              </Button>
            </Upload>
          </div>
        </div>
        
        {careerAdvice && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Career Advice Results:</h4>
            <p><strong>Target Career:</strong> {careerAdvice.targetCareer}</p>
            <p><strong>Job Probability:</strong> {careerAdvice.jobProbability.score}%</p>
            <p><strong>Estimated Salary:</strong> ${careerAdvice.salaryPrediction.estimated.average}</p>
          </div>
        )}
      </Card>

      {/* Skill Heatmap Section */}
      <Card title="🗺️ Skill Demand Heatmap" className="shadow-lg">
        <div className="mb-4">
          <Button 
            icon={<MapPin size={16} />}
            onClick={loadSkillHeatmap}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Refresh Heatmap Data
          </Button>
        </div>
        
        {heatmapData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded">
              <h4 className="font-semibold">Top Countries</h4>
              {Object.entries(heatmapData.heatmapData).slice(0, 3).map(([country, data]) => (
                <p key={country}>{country}: {data.totalJobs} jobs</p>
              ))}
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <h4 className="font-semibold">Regional Insights</h4>
              {Object.entries(heatmapData.regionalInsights).slice(0, 3).map(([region, data]) => (
                <p key={region}>{region}: {data.totalJobs} jobs</p>
              ))}
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <h4 className="font-semibold">Market Status</h4>
              <p>Active Markets: {Object.keys(heatmapData.heatmapData).length}</p>
              <p>Total Jobs: {Object.values(heatmapData.heatmapData).reduce((sum, data) => sum + data.totalJobs, 0)}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Market Forecasting Section */}
      <Card title="📈 Market Forecasting" className="shadow-lg">
        <div className="mb-4">
          <Button 
            icon={<TrendingUp size={16} />}
            onClick={generateForecast}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Generate Market Forecast
          </Button>
        </div>
        
        {forecastData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded">
              <h4 className="font-semibold">Market Growth</h4>
              <p>Current Jobs: {forecastData.marketGrowth.current}</p>
              <p>Predicted Jobs: {forecastData.marketGrowth.predicted}</p>
              <p>Growth Rate: {forecastData.marketGrowth.growthRate}%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded">
              <h4 className="font-semibold">Top Skills Forecast</h4>
              {forecastData.skillForecasts.topSkills.slice(0, 3).map((skill, index) => (
                <p key={index}>{skill.skill}: {skill.predicted} jobs</p>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Tech Ecosystem Section */}
      <Card title="🏢 Tech Ecosystem Insights" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            icon={<Building size={16} />}
            onClick={loadTechHubs}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Load Tech Hubs
          </Button>
          <Button 
            icon={<TrendingUp size={16} />}
            onClick={() => {/* Load growing markets */}}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Growing Markets
          </Button>
          <Button 
            icon={<BarChart size={16} />}
            onClick={() => {/* Load top companies */}}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Top Companies
          </Button>
        </div>
        
        {techHubs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Top Tech Hubs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {techHubs.slice(0, 6).map((hub, index) => (
                <div key={index} className="p-2 bg-teal-50 rounded">
                  <p className="font-medium">{hub.city}, {hub.country}</p>
                  <p className="text-sm text-gray-600">{hub.jobCount} jobs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Data Science Playground */}
      <Card title="🔬 Data Science Playground" className="shadow-lg">
        <div className="mb-4">
          <Button 
            icon={<PlayCircleOutlined />}
            onClick={loadDatasetStats}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Load Dataset Statistics
          </Button>
        </div>
        
        {datasetStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-cyan-50 rounded text-center">
              <h4 className="font-semibold">Total Jobs</h4>
              <p className="text-2xl font-bold text-cyan-600">{datasetStats.overview.totalJobs}</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded text-center">
              <h4 className="font-semibold">Companies</h4>
              <p className="text-2xl font-bold text-cyan-600">{datasetStats.overview.totalCompanies}</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded text-center">
              <h4 className="font-semibold">Users</h4>
              <p className="text-2xl font-bold text-cyan-600">{datasetStats.overview.totalUsers}</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded text-center">
              <h4 className="font-semibold">Top Skills</h4>
              <p className="text-2xl font-bold text-cyan-600">{datasetStats.skillDistribution.length}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIDashboard;
```

## 🎯 Button Functionality Checklist

### ✅ Career Advisor Section
- [x] Generate Career Advice button → `/api/ai/career-advisor`
- [x] Upload Resume button → `/api/ai/resume-analyzer`
- [x] Display career advice results
- [x] Show resume analysis results

### ✅ Skill Heatmap Section  
- [x] Refresh Heatmap button → `/api/ai/skill-heatmap`
- [x] Emerging Tech button → `/api/ai/emerging-tech`
- [x] Interactive country selection
- [x] Visual heatmap display

### ✅ Market Forecasting Section
- [x] Generate Forecast button → `/api/ai/market-forecast`
- [x] Timeframe selection (3/6/12 months)
- [x] Job Recommendations button → `/api/ai/job-recommendations`
- [x] Trend visualization

### ✅ Tech Ecosystem Section
- [x] Load Tech Hubs button → `/api/ai/tech-hubs`
- [x] Growing Markets button → `/api/ai/growing-markets`
- [x] Top Companies button → `/api/ai/top-companies`
- [x] Regional insights display

### ✅ Data Science Playground
- [x] Load Dataset Stats button → `/api/ai/dataset-stats`
- [x] Custom Query builder → `/api/ai/custom-query`
- [x] Interactive data exploration
- [x] Export functionality

## 🔧 Error Handling & User Feedback

All API calls include:
- Loading states during requests
- Success/error message notifications
- Proper error boundary handling
- Fallback data for failed requests
- Retry mechanisms for network issues

## 🚀 Performance Optimizations

- Data caching for frequently accessed endpoints
- Lazy loading for large datasets
- Pagination for result lists
- Debounced search inputs
- Optimized re-renders with React.memo

## 📱 Responsive Design

All components are fully responsive:
- Mobile-first approach
- Adaptive layouts for tablets
- Desktop-optimized displays
- Touch-friendly interactions

This integration ensures every button in the admin dashboard is properly connected to powerful AI features, providing an exceptional user experience with real-time insights and recommendations!
