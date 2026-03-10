'use client';

import { useState } from 'react';
import { FileText, Upload, Brain, CheckCircle, XCircle, AlertCircle, Target, TrendingUp, BookOpen } from 'lucide-react';

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: MissingSkill[];
  jobCompatibility: JobMatch[];
  recommendations: Recommendation[];
  marketInsights: MarketInsight[];
}

interface MissingSkill {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  demand: number;
  learningResources: LearningResource[];
}

interface JobMatch {
  title: string;
  company: string;
  match: number;
  missingSkills: string[];
  salary: string;
}

interface Recommendation {
  type: 'skill' | 'certification' | 'project' | 'experience';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  impact: string;
}

interface LearningResource {
  title: string;
  platform: string;
  type: 'course' | 'tutorial' | 'certification';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  duration: string;
}

interface MarketInsight {
  type: 'strength' | 'opportunity' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
}

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'text/plain' || file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      setResumeFile(file);
      // In a real app, you'd parse the file here
      // For demo, we'll use sample text
      setResumeText(`John Doe
Software Developer
Email: john.doe@email.com | Phone: +234-801-234-5678

EXPERIENCE
Senior Frontend Developer | TechCorp Nigeria | 2022-Present
- Developed and maintained React applications for 50k+ users
- Improved application performance by 40% through optimization
- Led a team of 3 junior developers

Full Stack Developer | StartupHub | 2020-2022
- Built REST APIs using Node.js and Express
- Implemented responsive web designs with React and TypeScript
- Collaborated with cross-functional teams

SKILLS
Programming: JavaScript, TypeScript, Python, HTML, CSS
Frameworks: React, Node.js, Express, Django
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, AWS, Jenkins

EDUCATION
Bachelor of Science in Computer Science | University of Lagos | 2016-2020
- GPA: 3.8/4.0
- Dean's List for 6 semesters

PROJECTS
E-commerce Platform | Personal Project | 2021
- Built full-stack e-commerce platform with React and Node.js
- Implemented payment integration with Stripe
- Deployed on AWS with Docker

Task Management App | Team Project | 2020
- Developed collaborative task management application
- Used React for frontend and Firebase for backend
- Won best project award in university hackathon`);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockAnalysis: ResumeAnalysis = {
      score: 72,
      strengths: [
        'Strong React and JavaScript experience',
        'Full-stack development capabilities',
        'Team leadership experience',
        'Good educational background',
        'Project portfolio with real applications'
      ],
      weaknesses: [
        'Limited cloud computing experience',
        'No machine learning/AI skills',
        'Missing modern DevOps practices',
        'Limited experience with microservices',
        'No recent certifications'
      ],
      missingSkills: [
        {
          skill: 'Cloud Computing (AWS/Azure)',
          importance: 'critical',
          demand: 85,
          learningResources: [
            {
              title: 'AWS Cloud Practitioner',
              platform: 'AWS Training',
              type: 'certification',
              url: '#',
              difficulty: 'beginner',
              rating: 4.7,
              duration: '40 hours'
            },
            {
              title: 'Cloud Architecture 101',
              platform: 'Coursera',
              type: 'course',
              url: '#',
              difficulty: 'intermediate',
              rating: 4.6,
              duration: '60 hours'
            }
          ]
        },
        {
          skill: 'Machine Learning',
          importance: 'important',
          demand: 78,
          learningResources: [
            {
              title: 'Machine Learning A-Z',
              platform: 'Udemy',
              type: 'course',
              url: '#',
              difficulty: 'intermediate',
              rating: 4.8,
              duration: '80 hours'
            }
          ]
        },
        {
          skill: 'Kubernetes',
          importance: 'important',
          demand: 72,
          learningResources: [
            {
              title: 'Kubernetes for Beginners',
              platform: 'YouTube',
              type: 'tutorial',
              url: '#',
              difficulty: 'beginner',
              rating: 4.5,
              duration: '30 hours'
            }
          ]
        },
        {
          skill: 'GraphQL',
          importance: 'nice-to-have',
          demand: 65,
          learningResources: [
            {
              title: 'GraphQL Masterclass',
              platform: 'Udemy',
              type: 'course',
              url: '#',
              difficulty: 'intermediate',
              rating: 4.7,
              duration: '45 hours'
            }
          ]
        }
      ],
      jobCompatibility: [
        {
          title: 'Senior Frontend Developer',
          company: 'TechCorp Africa',
          match: 92,
          missingSkills: ['Cloud Computing'],
          salary: '$2,800-$3,500'
        },
        {
          title: 'Full Stack Developer',
          company: 'FinTech Innovations',
          match: 85,
          missingSkills: ['GraphQL', 'Kubernetes'],
          salary: '$2,500-$3,200'
        },
        {
          title: 'Software Engineer',
          company: 'Digital Agency Hub',
          match: 78,
          missingSkills: ['Cloud Computing', 'Machine Learning'],
          salary: '$2,200-$2,800'
        },
        {
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          match: 45,
          missingSkills: ['Kubernetes', 'Cloud Computing', 'CI/CD'],
          salary: '$2,800-$3,500'
        }
      ],
      recommendations: [
        {
          type: 'skill',
          title: 'Learn Cloud Computing',
          description: 'AWS/Azure skills are in high demand and will significantly increase your job opportunities',
          priority: 'high',
          estimatedTime: '2-3 months',
          impact: '+35% job matches'
        },
        {
          type: 'certification',
          title: 'Get AWS Certified',
          description: 'AWS Cloud Practitioner certification is highly valued by employers',
          priority: 'high',
          estimatedTime: '1-2 months',
          impact: '+25% salary potential'
        },
        {
          type: 'project',
          title: 'Build Cloud-Native Project',
          description: 'Create a project using AWS services and containerization',
          priority: 'medium',
          estimatedTime: '1-2 months',
          impact: '+20% portfolio strength'
        },
        {
          type: 'skill',
          title: 'Learn Machine Learning Basics',
          description: 'ML skills are becoming essential for many developer roles',
          priority: 'medium',
          estimatedTime: '3-4 months',
          impact: '+15% job opportunities'
        }
      ],
      marketInsights: [
        {
          type: 'strength',
          title: 'Strong Frontend Skills',
          description: 'Your React and JavaScript skills are in high demand across Africa',
          actionable: false
        },
        {
          type: 'opportunity',
          title: 'Cloud Skills Gap',
          description: 'Adding cloud skills could increase your salary by 30-40%',
          actionable: true
        },
        {
          type: 'warning',
          title: 'Limited AI/ML Experience',
          description: 'AI skills are becoming standard requirements for senior roles',
          actionable: true
        }
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getImportanceColor = (importance: string): string => {
    switch (importance) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'important': return 'text-orange-600 bg-orange-100';
      case 'nice-to-have': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">AI Resume Analyzer</h2>
        </div>

        {!analysis ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your resume here or click to upload
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supports PDF, DOCX, and TXT files
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </div>

            {/* Resume Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste your resume text:
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeResume}
              disabled={isAnalyzing || (!resumeFile && !resumeText.trim())}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  AI Analyzing Your Resume...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Score Overview */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(analysis.score)} mb-4`}>
                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Score</h3>
              <p className="text-gray-600">
                {analysis.score >= 80 ? 'Excellent! Your resume is very strong.' :
                 analysis.score >= 60 ? 'Good! With some improvements, you could be excellent.' :
                 analysis.score >= 40 ? 'Fair. Significant improvements needed.' :
                 'Poor. Major improvements required.'}
              </p>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-4 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">!</span>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Missing Skills Analysis
              </h4>
              <div className="space-y-4">
                {analysis.missingSkills.map((skill, index) => (
                  <div key={index} className="bg-white rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{skill.skill}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(skill.importance)}`}>
                            {skill.importance}
                          </span>
                          <span className="text-xs text-gray-600">{skill.demand}% demand</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Recommended Learning Resources:</p>
                      {skill.learningResources.map((resource, i) => (
                        <div key={i} className="bg-gray-50 rounded p-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {resource.platform}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                            <span>⭐ {resource.rating} • {resource.duration}</span>
                            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                              Start Learning →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Compatibility */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Job Compatibility
              </h4>
              <div className="space-y-3">
                {analysis.jobCompatibility.map((job, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">{job.title}</h5>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          job.match >= 80 ? 'text-green-600' :
                          job.match >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {job.match}%
                        </div>
                        <div className="text-sm text-gray-600">{job.salary}</div>
                      </div>
                    </div>
                    {job.missingSkills.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Missing skills:</span> {job.missingSkills.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Personalized Recommendations
              </h4>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{rec.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>⏱️ {rec.estimatedTime}</span>
                      <span className="font-medium text-green-600">{rec.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Market Insights
              </h4>
              <div className="space-y-3">
                {analysis.marketInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{insight.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      </div>
                      <div className="ml-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          insight.type === 'strength' ? 'bg-green-100 text-green-700' :
                          insight.type === 'opportunity' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {insight.type}
                        </span>
                      </div>
                    </div>
                    {insight.actionable && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        💡 Actionable insight - see recommendations above
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setAnalysis(null);
                setResumeFile(null);
                setResumeText('');
              }}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
