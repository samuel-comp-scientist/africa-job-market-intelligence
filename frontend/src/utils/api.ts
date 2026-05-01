const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface SkillCount {
  skill: string;
  count: number;
}

export interface CountryData {
  country: string;
  count: number;
  avgSalary: number;
}

export interface SalaryBySkill {
  skill: string;
  avgSalary: number;
  count: number;
}

export interface CompanyCount {
  company: string;
  count: number;
}

export interface JobTrends {
  [month: string]: number;
}

export const analyticsApi = {
  getTopSkills(limit = 10) {
    return api<SkillCount[]>(`/api/analytics/top-skills?limit=${limit}`);
  },

  getCountries() {
    return api<CountryData[]>('/api/analytics/countries');
  },

  getSalaryBySkill() {
    return api<SalaryBySkill[]>('/api/analytics/salary');
  },

  getJobTrends() {
    return api<JobTrends>('/api/analytics/trends');
  },

  getTopCompanies(limit = 10) {
    return api<CompanyCount[]>(`/api/analytics/companies?limit=${limit}`);
  },
};
