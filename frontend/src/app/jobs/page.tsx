'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, DollarSign, Building2, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { analyticsApi } from '@/utils/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Job {
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
  source: string;
  postedDate: string;
  seniorityLevel: string;
  jobType: string;
  jobUrl?: string;
}

export default function JobExplorerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('');
  const [skill, setSkill] = useState('');
  const [company, setCompany] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [seniority, setSeniority] = useState('');

  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (keyword) params.set('search', keyword);
      if (country) params.set('country', country);
      if (skill) params.set('skill', skill);
      if (seniority) params.set('seniority', seniority);

      let data;
      if (keyword || company || salaryMin || salaryMax) {
        const body: Record<string, unknown> = { page, limit: 20 };
        if (keyword) body.keywords = keyword;
        if (country) body.countries = [country];
        if (skill) body.skills = [skill];
        if (company) body.keywords = keyword ? `${keyword} ${company}` : company;
        if (salaryMin) body.salaryMin = Number(salaryMin);
        if (salaryMax) body.salaryMax = Number(salaryMax);
        if (seniority) body.seniority = [seniority];

        const res = await fetch(`${API_BASE}/api/jobs/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        data = await res.json();
        setJobs(data.jobs || []);
        setTotal(data.pagination?.total || 0);
      } else {
        const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
        data = await res.json();
        setJobs(data.jobs || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      setJobs([]);
      setTotal(0);
    }
    setLoading(false);
  }, [page, keyword, country, skill, company, salaryMin, salaryMax, seniority]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    Promise.allSettled([
      analyticsApi.getCountries(),
      analyticsApi.getTopSkills(50),
    ]).then(([countriesRes, skillsRes]) => {
      if (countriesRes.status === 'fulfilled') setAvailableCountries(countriesRes.value.map(c => c.country));
      if (skillsRes.status === 'fulfilled') setAvailableSkills(skillsRes.value.map(s => s.skill));
    });
  }, []);

  const handleSearch = () => { setPage(1); fetchJobs(); };
  const handleReset = () => {
    setKeyword(''); setCountry(''); setSkill(''); setCompany('');
    setSalaryMin(''); setSalaryMax(''); setSeniority(''); setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const seniorityLevels = ['junior', 'mid-level', 'senior', 'lead', 'architect', 'manager'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Explorer</h1>
            <p className="text-gray-600 mt-1">Browse and filter tech jobs across Africa</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search job titles, descriptions, companies..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
              >
                Search
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">All countries</option>
                    {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Skill</label>
                  <select value={skill} onChange={e => setSkill(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">All skills</option>
                    {availableSkills.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Seniority</label>
                  <select value={seniority} onChange={e => setSeniority(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">All levels</option>
                    {seniorityLevels.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Company</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Filter by company" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Min Salary</label>
                    <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Max Salary</label>
                    <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="Any" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{total.toLocaleString()} jobs found</p>
            {total > 0 && (
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            )}
          </div>

          {/* Job listings */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => {
                const expanded = expandedId === job._id;
                return (
                  <div key={job._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                    <button onClick={() => setExpandedId(expanded ? null : job._id)} className="w-full text-left p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{job.jobTitle}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.city ? `${job.city}, ` : ''}{job.country}</span>
                            {job.salaryMin && (
                              <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salaryMin.toLocaleString()} – {job.salaryMax?.toLocaleString() || 'Negotiable'} {job.currency}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.skills.slice(0, 5).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs capitalize">{s}</span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{job.skills.length - 5}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">{job.seniorityLevel}</span>
                          <span className="text-xs text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </button>
                    {expanded && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{job.jobDescription}</p>
                        <div className="flex flex-wrap gap-3">
                          {job.jobUrl && (
                            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                              <ExternalLink className="h-3.5 w-3.5" /> Apply
                            </a>
                          )}
                          <span className="text-xs text-gray-400 self-center">Source: {job.source}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}>{p}</button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
