'use client';

import { useState } from 'react';
import { Brain, Target, TrendingUp, DollarSign, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: number;
}

interface CareerPlan {
  targetCareer: string;
  currentSkills: Skill[];
  missingSkills: Skill[];
  estimatedSalary: string;
  jobProbability: number;
  learningRoadmap: LearningStep[];
  marketInsights: MarketInsight[];
}

interface LearningStep {
  step: number;
  title: string;
  skills: string[];
  estimatedTime: string;
  resources: LearningResource[];
  priority: 'high' | 'medium' | 'low';
}

interface LearningResource {
  title: string;
  platform: string;
  type: 'course' | 'tutorial' | 'book' | 'certification';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  duration: string;
}

interface MarketInsight {
  type: 'growth' | 'demand' | 'competition' | 'salary';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export default function AICareerAdvisor() {
  const [userInput, setUserInput] = useState({
    currentSkills: [] as Skill[],
    desiredCareer: '',
    country: 'Nigeria',
    experienceLevel: 'entry'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [careerPlan, setCareerPlan] = useState<CareerPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C#', 
    'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
    'Data Science', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Power BI',
    'DevOps', 'CI/CD', 'Git', 'Linux', 'React Native', 'Flutter', 'Swift',
    'Kotlin', 'GraphQL', 'REST APIs', 'Microservices', 'Blockchain', 'Cybersecurity'
  ];

  const careers = [
    'Data Scientist', 'AI Engineer', 'Machine Learning Engineer', 'Data Analyst',
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Cloud Engineer', 'Mobile Developer',
    'Cybersecurity Analyst', 'Blockchain Developer', 'Game Developer',
    'UI/UX Designer', 'Product Manager', 'Technical Writer'
  ];

  const countries = [
    'Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Morocco', 'Ghana',
    'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Senegal', 'Ivory Coast'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'junior', label: 'Junior (2-5 years)' },
    { value: 'mid', label: 'Mid-Level (5-8 years)' },
    { value: 'senior', label: 'Senior (8-12 years)' },
    { value: 'lead', label: 'Lead/Principal (12+ years)' }
  ];

  const addSkill = (skillName: string, level: string) => {
    const newSkill: Skill = {
      name: skillName,
      level: level as any
    };
    setUserInput(prev => ({
      ...prev,
      currentSkills: [...prev.currentSkills, newSkill]
    }));
  };

  const removeSkill = (skillName: string) => {
    setUserInput(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(skill => skill.name !== skillName)
    }));
  };

  const generateCareerPlan = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI-generated career plan
    const mockCareerPlan: CareerPlan = {
      targetCareer: userInput.desiredCareer,
      currentSkills: userInput.currentSkills,
      missingSkills: generateMissingSkills(userInput.desiredCareer, userInput.currentSkills),
      estimatedSalary: generateSalaryEstimate(userInput.desiredCareer, userInput.country, userInput.experienceLevel),
      jobProbability: generateJobProbability(userInput.currentSkills, userInput.desiredCareer),
      learningRoadmap: generateLearningRoadmap(userInput.desiredCareer, userInput.currentSkills),
      marketInsights: generateMarketInsights(userInput.desiredCareer, userInput.country)
    };
    
    setCareerPlan(mockCareerPlan);
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const generateMissingSkills = (career: string, currentSkills: Skill[]): Skill[] => {
    const careerRequirements: Record<string, string[]> = {
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Deep Learning', 'TensorFlow'],
      'AI Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'NLP', 'MLOps'],
      'Frontend Developer': ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Tailwind'],
      'Backend Developer': ['Node.js', 'Python', 'SQL', 'APIs', 'Docker', 'Microservices'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git'],
      'Mobile Developer': ['React Native', 'Flutter', 'TypeScript', 'Mobile UI', 'APIs']
    };
    
    const required = careerRequirements[career] || [];
    const current = currentSkills.map(s => s.name);
    const missing = required.filter(skill => !current.includes(skill));
    
    return missing.map(skill => ({
      name: skill,
      level: 'beginner'
    }));
  };

  const generateSalaryEstimate = (career: string, country: string, experience: string): string => {
    const baseSalaries: Record<string, Record<string, string>> = {
      'Data Scientist': {
        'Nigeria': '$2,500 - $4,200',
        'South Africa': '$3,500 - $5,800',
        'Kenya': '$2,200 - $3,800',
        'Egypt': '$1,800 - $3,200'
      },
      'AI Engineer': {
        'Nigeria': '$3,200 - $5,500',
        'South Africa': '$4,200 - $7,000',
        'Kenya': '$2,800 - $4,800',
        'Egypt': '$2,400 - $4,000'
      },
      'Frontend Developer': {
        'Nigeria': '$1,800 - $3,200',
        'South Africa': '$2,500 - $4,200',
        'Kenya': '$1,600 - $2,800',
        'Egypt': '$1,400 - $2,400'
      }
    };
    
    return baseSalaries[career]?.[country] || '$2,000 - $3,500';
  };

  const generateJobProbability = (currentSkills: Skill[], career: string): number => {
    const careerRequirements: Record<string, string[]> = {
      'Data Scientist': ['Python', 'Machine Learning', 'SQL'],
      'AI Engineer': ['Python', 'Machine Learning', 'Deep Learning'],
      'Frontend Developer': ['JavaScript', 'React', 'TypeScript']
    };
    
    const required = careerRequirements[career] || [];
    const current = currentSkills.map(s => s.name);
    const overlap = required.filter(skill => current.includes(skill)).length;
    
    return Math.min(Math.round((overlap / required.length) * 100), 95);
  };

  const generateLearningRoadmap = (career: string, currentSkills: Skill[]): LearningStep[] => {
    const missingSkills = generateMissingSkills(career, currentSkills);
    
    return [
      {
        step: 1,
        title: 'Foundation Skills',
        skills: missingSkills.slice(0, 2),
        estimatedTime: '2-3 months',
        priority: 'high',
        resources: [
          {
            title: 'Complete Python Bootcamp',
            platform: 'Udemy',
            type: 'course',
            url: '#',
            difficulty: 'beginner',
            rating: 4.8,
            duration: '60 hours'
          },
          {
            title: 'Machine Learning A-Z',
            platform: 'Coursera',
            type: 'course',
            url: '#',
            difficulty: 'intermediate',
            rating: 4.7,
            duration: '80 hours'
          }
        ]
      },
      {
        step: 2,
        title: 'Advanced Technologies',
        skills: missingSkills.slice(2, 4),
        estimatedTime: '3-4 months',
        priority: 'medium',
        resources: [
          {
            title: 'Deep Learning Specialization',
            platform: 'Coursera',
            type: 'certification',
            url: '#',
            difficulty: 'advanced',
            rating: 4.9,
            duration: '120 hours'
          }
        ]
      },
      {
        step: 3,
        title: 'Practical Projects',
        skills: missingSkills.slice(4),
        estimatedTime: '2-3 months',
        priority: 'medium',
        resources: [
          {
            title: 'Build Real Projects',
            platform: 'YouTube',
            type: 'tutorial',
            url: '#',
            difficulty: 'intermediate',
            rating: 4.6,
            duration: '40 hours'
          }
        ]
      }
    ];
  };

  const generateMarketInsights = (career: string, country: string): MarketInsight[] => {
    return [
      {
        type: 'growth',
        title: 'High Growth Market',
        description: `${career} roles in ${country} are growing at 35% annually`,
        impact: 'positive',
        confidence: 0.92
      },
      {
        type: 'demand',
        title: 'Strong Demand',
        description: `Companies are actively hiring ${career.toLowerCase()}s with 500+ open positions`,
        impact: 'positive',
        confidence: 0.88
      },
      {
        type: 'competition',
        title: 'Moderate Competition',
        description: `Medium competition level with good opportunities for qualified candidates`,
        impact: 'neutral',
        confidence: 0.75
      }
    ];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">AI Career Advisor</h2>
        </div>

        {!showResults ? (
          <div className="space-y-6">
            {/* Current Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Current Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {userInput.currentSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name} ({skill.level})
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const skill = e.target.value;
                    if (skill) {
                      addSkill(skill, 'intermediate');
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Select skill...</option>
                  {availableSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const skill = e.target.value;
                    if (skill) {
                      addSkill(skill, 'intermediate');
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Add skill...</option>
                  {availableSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desired Career */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Career
              </label>
              <select
                value={userInput.desiredCareer}
                onChange={(e) => setUserInput(prev => ({ ...prev, desiredCareer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your target career...</option>
                {careers.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={userInput.country}
                onChange={(e) => setUserInput(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={userInput.experienceLevel}
                onChange={(e) => setUserInput(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCareerPlan}
              disabled={isAnalyzing || !userInput.desiredCareer || userInput.currentSkills.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  AI Analyzing Your Career Path...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate AI Career Plan
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Personalized Career Plan
              </h3>
              <p className="text-gray-600">
                Target Career: <span className="font-semibold text-blue-600">{careerPlan?.targetCareer}</span>
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Estimated Salary</h4>
                </div>
                <p className="text-2xl font-bold text-green-900">{careerPlan?.estimatedSalary}</p>
                <p className="text-sm text-green-700">Based on market data</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Job Probability</h4>
                </div>
                <p className="text-2xl font-bold text-blue-900">{careerPlan?.jobProbability}%</p>
                <p className="text-sm text-blue-700">Match with current skills</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-900">Market Growth</h4>
                </div>
                <p className="text-2xl font-bold text-purple-900">+35%</p>
                <p className="text-sm text-purple-700">Annual growth rate</p>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Your Current Skills
                </h4>
                <div className="space-y-2">
                  {careerPlan?.currentSkills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Missing Skills
                </h4>
                <div className="space-y-2">
                  {careerPlan?.missingSkills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Roadmap */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Learning Roadmap
              </h4>
              <div className="space-y-6">
                {careerPlan?.learningRoadmap.map((step, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        Step {step.step}: {step.title}
                      </h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {step.estimatedTime}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          step.priority === 'high' ? 'bg-red-100 text-red-700' :
                          step.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {step.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Skills: </span>
                      {step.skills.map((skill, i) => (
                        <span key={i} className="text-sm bg-white px-2 py-1 rounded mr-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {step.resources.map((resource, i) => (
                        <div key={i} className="bg-white rounded p-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
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

            {/* Market Insights */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Market Insights
              </h4>
              <div className="space-y-3">
                {careerPlan?.marketInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{insight.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        insight.impact === 'positive' ? 'bg-green-100 text-green-700' :
                        insight.impact === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {insight.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                      <span>Type: {insight.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowResults(false)}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              Generate New Career Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
