'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Code, Brain, Globe, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { analyticsApi, type SkillCount, type CountryData, type SalaryBySkill, type JobTrends, type CompanyCount } from '../../../utils/api';

const LANGUAGES = new Set([
  'javascript', 'python', 'typescript', 'java', 'c#', 'c++', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'dart', 'sql', 'shell',
  'objective-c', 'perl', 'lua', 'haskell', 'elixir', 'clojure',
]);

const FRAMEWORKS = new Set([
  'react', 'angular', 'vue', 'vue.js', 'node.js', 'nodejs', 'django', 'flask',
  'fastapi', 'spring', 'spring boot', 'express', 'express.js', 'laravel',
  'rails', 'ruby on rails', 'next.js', 'nextjs', 'svelte', 'nuxt', 'blazor',
  'asp.net', 'asp.net core', 'fastapi', 'tensorflow', 'pytorch',
]);

const DEVOPS_TOOLS = new Set([
  'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab ci',
  'github actions', 'aws', 'azure', 'gcp', 'google cloud', 'linux',
  'nginx', 'redis', 'kafka', 'rabbitmq', 'elasticsearch',
  'prometheus', 'grafana', 'circleci', 'bitbucket pipelines',
]);

const DATABASES = new Set([
  'mongodb', 'postgresql', 'mysql', 'sql server', 'sqlite', 'cassandra',
  'dynamodb', 'firebase', 'supabase', 'oracle', 'mariadb', 'neo4j',
]);

function categorizeSkill(skill: string): 'language' | 'framework' | 'devops' | 'database' | 'other' {
  const lower = skill.toLowerCase().trim();
  if (LANGUAGES.has(lower)) return 'language';
  if (FRAMEWORKS.has(lower)) return 'framework';
  if (DEVOPS_TOOLS.has(lower)) return 'devops';
  if (DATABASES.has(lower)) return 'database';
  return 'other';
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

function fmtNumber(v: unknown, label: string): [string, string] {
  return [`${Number(v) ?? 0} ${label}`, label];
}

function capitalizeTick(props: unknown) {
  const p = props as { payload?: { value?: string } };
  return <span style={{ textTransform: 'capitalize', fontSize: 12 }}>{p.payload?.value ?? ''}</span>;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>
  );
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export default function AnalyticsPage() {
  const [skills, setSkills] = useState<SkillCount[]>([]);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [salaryBySkill, setSalaryBySkill] = useState<SalaryBySkill[]>([]);
  const [trends, setTrends] = useState<JobTrends>({});
  const [companies, setCompanies] = useState<CompanyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      analyticsApi.getTopSkills(20),
      analyticsApi.getCountries(),
      analyticsApi.getSalaryBySkill(),
      analyticsApi.getJobTrends(),
      analyticsApi.getTopCompanies(10),
    ]).then(([skillsRes, countriesRes, salaryRes, trendsRes, companiesRes]) => {
      if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
      if (countriesRes.status === 'fulfilled') setCountries(countriesRes.value);
      if (salaryRes.status === 'fulfilled') setSalaryBySkill(salaryRes.value);
      if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value);
      if (companiesRes.status === 'fulfilled') setCompanies(companiesRes.value);

      const errors = [skillsRes, countriesRes, salaryRes, trendsRes, companiesRes]
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => (r.reason as Error).message);

      if (errors.length > 0) {
        setError('Some data failed to load. Ensure the backend is running on port 5000.');
      }
      setLoading(false);
    });
  }, []);

  const categorized = skills.map((s) => ({ ...s, category: categorizeSkill(s.skill) }));
  const totalSkillCount = skills.reduce((sum, s) => sum + s.count, 0);

  const languageSkills = categorized.filter((s) => s.category === 'language');
  const frameworkSkills = categorized.filter((s) => s.category === 'framework');
  const devopsSkills = categorized.filter((s) => s.category === 'devops');

  const categoryBreakdown = [
    { name: 'Languages', value: languageSkills.reduce((s, i) => s + i.count, 0), color: '#3b82f6' },
    { name: 'Frameworks', value: frameworkSkills.reduce((s, i) => s + i.count, 0), color: '#8b5cf6' },
    { name: 'DevOps/Cloud', value: devopsSkills.reduce((s, i) => s + i.count, 0), color: '#10b981' },
    { name: 'Other', value: categorized.filter((s) => s.category === 'other' || s.category === 'database').reduce((sum, i) => sum + i.count, 0), color: '#f59e0b' },
  ].filter((c) => c.value > 0);

  const trendData = Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month: formatMonth(month), count }));

  const totalJobs = countries.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Market Intelligence</h1>
            <p className="text-gray-600 mt-1">Discover what skills are in demand across Africa's tech market</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow p-5">
                  <p className="text-sm text-gray-500">Total Jobs Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalJobs.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <p className="text-sm text-gray-500">Countries Tracked</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{countries.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <p className="text-sm text-gray-500">Unique Skills</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{skills.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <p className="text-sm text-gray-500">Top Skill</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1 capitalize">{skills[0]?.skill || '—'}</p>
                </div>
              </div>

              {/* Row 1: Top Skills + Trends Over Time */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Demanded Skills */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Top Demanded Skills</h2>
                  </div>
                  {skills.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No skill data available yet. Run the scraper or seed data first.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={skills.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="skill" type="category" width={100} tick={capitalizeTick} />
                        <Tooltip formatter={(v) => fmtNumber(v, 'jobs')} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Job Posting Trends */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Job Trends Over Time</h2>
                  </div>
                  {trendData.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No trend data available yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => fmtNumber(v, 'postings')} />
                        <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Row 2: Skill Categories + Programming Languages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Skill Category Breakdown */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Skill Categories</h2>
                  </div>
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No category data available.</p>
                  ) : (
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width="50%" height={250}>
                        <PieChart>
                          <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                            {categoryBreakdown.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => fmtNumber(v, 'mentions')} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 flex-1">
                        {categoryBreakdown.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{cat.value} ({totalSkillCount > 0 ? Math.round((cat.value / totalSkillCount) * 100) : 0}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Programming Languages */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Most Demanded Programming Languages</h2>
                  </div>
                  {languageSkills.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No language data available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {languageSkills.slice(0, 8).map((lang, i) => {
                        const maxCount = languageSkills[0]?.count || 1;
                        const pct = Math.round((lang.count / maxCount) * 100);
                        return (
                          <div key={lang.skill} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-400 w-4">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-900 capitalize w-24">{lang.skill}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                              <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm text-gray-600 w-16 text-right">{lang.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Fastest Growing (by DevOps/Frameworks) + Salary by Skill */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Fastest Growing Technologies */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Fastest Growing Technologies</h2>
                  </div>
                  {devopsSkills.length === 0 && frameworkSkills.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No growth data available yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={[...frameworkSkills.slice(0, 5), ...devopsSkills.slice(0, 5)].sort((a, b) => b.count - a.count)} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="skill" tick={capitalizeTick} interval={0} angle={-20} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => fmtNumber(v, 'jobs')} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                          {([...frameworkSkills.slice(0, 5), ...devopsSkills.slice(0, 5)].sort((a, b) => b.count - a.count)).map((_, i) => (
                            <Cell key={i} fill={i < frameworkSkills.slice(0, 5).length ? '#8b5cf6' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {([...frameworkSkills.slice(0, 5), ...devopsSkills.slice(0, 5)]).length > 0 && (
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-purple-500" /> Frameworks</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /> DevOps/Cloud</span>
                    </div>
                  )}
                </div>

                {/* Salary by Skill */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowUpRight className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Average Salary by Skill</h2>
                  </div>
                  {salaryBySkill.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No salary data available. Ensure jobs have salaryMin/salaryMax set.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={salaryBySkill.slice(0, 10)} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="skill" tick={capitalizeTick} interval={0} angle={-20} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${v / 1000}k`} />
                        <Tooltip formatter={(v) => [`$${(Number(v) ?? 0).toLocaleString()}`, 'Avg Salary']} />
                        <Bar dataKey="avgSalary" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Row 4: Country Distribution + Top Companies */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Jobs by Country */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-cyan-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Jobs by Country</h2>
                  </div>
                  {countries.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No country data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {countries.slice(0, 8).map((c) => {
                        const pct = totalJobs > 0 ? Math.round((c.count / totalJobs) * 100) : 0;
                        return (
                          <div key={c.country} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 w-28">{c.country}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
                            </div>
                            <div className="flex items-center gap-2 w-32 justify-end">
                              <span className="text-sm text-gray-600">{c.count}</span>
                              {c.avgSalary > 0 && (
                                <span className="text-xs text-gray-400">${Math.round(c.avgSalary).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Top Hiring Companies */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Top Hiring Companies</h2>
                  </div>
                  {companies.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No company data available.</p>
                  ) : (
                    <div className="space-y-2">
                      {companies.map((c, i) => (
                        <div key={c.company} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-400 w-5">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-900">{c.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{c.count} jobs</span>
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
