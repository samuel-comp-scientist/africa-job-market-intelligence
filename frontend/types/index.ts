// Global type definitions for African Job Market Intelligence Platform

// User Types
export type UserType = 'jobseeker' | 'dataanalyst' | 'recruiter';

// User Interfaces
export interface User {
  _id: string;
  email: string;
  name: string;
  displayName: string;
  userType: UserType;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    bio?: string;
    location?: {
      country: string;
      city: string;
    };
  };
  jobseekerProfile?: {
    careerLevel: string;
    targetRoles: string[];
    currentSkills: Array<{
      name: string;
      level: string;
      yearsOfExperience: number;
    }>;
    desiredSkills: Array<{
      name: string;
      priority: string;
    }>;
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string;
    };
    experience?: Array<{
      company: string;
      role: string;
      duration: string;
    }>;
    education?: Array<{
      institution: string;
      degree: string;
      year: string;
    }>;
  };
  employerProfile?: {
    company: string;
    industry: string;
    size: string;
    headquarters: {
      country: string;
      city: string;
    };
    website?: string;
    description?: string;
  };
  preferences: {
    dashboard: {
      savedJobs: string[];
      savedSearches: string[];
      notifications: boolean;
    };
  };
  activity: {
    lastLogin: string;
    profileViews: number;
    applications: number;
  };
  subscription: {
    plan: string;
    limits: {
      savedJobs: number;
      savedSearches: number;
      skillAnalysis: number;
    };
  };
  verification: {
    emailVerified: boolean;
    phoneVerified?: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Job Interfaces
export interface Job {
  _id: string;
  jobTitle: string;
  company: string;
  country: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  jobDescription: string;
  jobUrl: string;
  source: string;
  postedDate: Date;
  expiryDate?: Date;
  seniorityLevel: string;
  jobType: string;
  isActive: boolean;
  applicationCount?: number;
  viewCount?: number;
}

// Skill Interfaces
export interface Skill {
  _id: string;
  name: string;
  category: string;
  demand: {
    current: {
      count: number;
      percentage: number;
      trend: string;
    };
  };
  salary: {
    average: number;
    min: number;
    max: number;
    median: number;
  };
  growth: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  popularity: {
    score: number;
    rank: number;
  };
  relatedSkills?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Company Interfaces
export interface Company {
  _id: string;
  name: string;
  industry: string;
  size: string;
  headquarters: {
    country: string;
    city: string;
  };
  website?: string;
  description?: string;
  jobCount: number;
  activeJobs: number;
  rating: {
    average: number;
    count: number;
  };
  foundedYear?: number;
  fundingStage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Salary Analytics Interfaces
export interface SalaryAnalytics {
  _id: string;
  period: string;
  date: Date;
  currency: string;
  overall: {
    average: number;
    minimum: number;
    maximum: number;
    median: number;
    count: number;
    standardDeviation: number;
  };
  bySkill: Array<{
    skill: string;
    average: number;
    minimum: number;
    maximum: number;
    median: number;
    count: number;
    growth: number;
  }>;
  byCountry: Array<{
    country: string;
    average: number;
    minimum: number;
    maximum: number;
    median: number;
    count: number;
    growth: number;
  }>;
  bySeniority: Array<{
    level: string;
    average: number;
    minimum: number;
    maximum: number;
    median: number;
    count: number;
    growth: number;
  }>;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  trends: {
    monthOverMonth: number;
    quarterOverQuarter: number;
    yearOverYear: number;
  };
  metadata: {
    totalJobsAnalyzed: number;
    dataQuality: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API Response Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface DashboardResponse {
  user: {
    name: string;
    careerLevel: string;
    skillsCount: number;
    profileComplete: number;
  };
  insights: {
    topSkills: Skill[];
    salaryOverview: {
      average?: number;
    };
    jobRecommendations: Array<{
      jobTitle: string;
      demand: number;
      avgSalary: number;
      companies: number;
      locations: number;
    }>;
    skillGapAnalysis: {
      hasSkills: number;
      missingSkills: string[];
      gapPercentage: number;
    };
    careerRecommendations: Array<{
      role: string;
      readinessScore: number;
      timeline: string;
      avgSalary: number;
      growth: number;
      missingSkills: string[];
    }>;
    marketTrends: {
      growingSkills: string[];
      decliningSkills: string[];
      emergingTechnologies: string[];
      marketGrowth: number;
    };
  };
  stats: {
    savedJobs: number;
    savedSearches: number;
    profileViews: number;
    lastLogin: string;
  };
}

// Form Interfaces
export interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  careerLevel?: string;
  rememberMe?: boolean;
  agreeToTerms?: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  careerLevel?: string;
  agreeToTerms?: string;
  rememberMe?: string;
  general?: string;
}

// Dashboard Component Props
export interface DashboardProps {
  user: User;
}

// Navigation Interfaces
export interface Tab {
  id: string;
  label: string;
  icon: any;
  href?: string;
}

// Filter Interfaces
export interface JobFilters {
  keyword?: string;
  country?: string;
  skill?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: string;
  seniorityLevel?: string;
  postedDate?: string;
}

export interface SkillFilters {
  category?: string;
  demand?: string;
  growth?: string;
  country?: string;
}

export interface SalaryFilters {
  skill?: string;
  country?: string;
  experience?: string;
  jobRole?: string;
  industry?: string;
}

// Export and Data Interfaces
export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  dataset: string;
  filters?: Record<string, any>;
}

export interface DatasetInfo {
  name: string;
  totalRecords: number;
  lastUpdated: Date;
  size: string;
  description?: string;
}

// Chart Interfaces
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export interface ChartOptions {
  responsive: boolean;
  plugins?: Record<string, any>;
  scales?: Record<string, any>;
}

// Notification Interfaces
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Pagination Interfaces
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
