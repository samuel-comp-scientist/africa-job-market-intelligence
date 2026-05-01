'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle2, XCircle, AlertCircle, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CareerPath {
  title: string;
  requiredSkills: string[];
  demandLevel: string;
  growthRate: number;
  averageSalary: { min: number; max: number };
}

interface SkillGapResult {
  career: string;
  matchingSkills: string[];
  missingSkills: string[];
  skillScore: number;
  weightedScore: number;
  readinessLevel: string;
  learningRoadmap?: {
    totalSkills: number;
    estimatedTotalTime: number;
    skills: Array<{ skill: string; priority: number; estimatedTime: number; resources: Array<{ title: string; platform: string; duration: string; level: string }> }>;
  };
  careerInfo: {
    demandLevel: string;
    growthRate: number;
    averageSalary: { min: number; max: number };
  };
}

interface Recommendation {
  skill: string;
  priority: number;
  estimatedTime: string;
  resources: Array<{ title: string; platform: string; duration: string; level: string }>;
}

const CAREER_ICONS: Record<string, string> = {
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Data Scientist': '📊',
  'DevOps Engineer': '🔧',
  'Machine Learning Engineer': '🤖',
  'Full Stack Developer': '🚀',
};

const DEMAND_COLORS: Record<string, string> = {
  'Very High': 'bg-red-100 text-red-700',
  'High': 'bg-orange-100 text-orange-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-green-100 text-green-700',
};

export default function CareerRoadmapsPage() {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [userSkills, setUserSkills] = useState('');
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gapLoading, setGapLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'gap' | 'recommend'>('roadmaps');

  useEffect(() => {
    fetch(`${API_BASE}/api/ai/career-paths`)
      .then(r => r.json())
      .then(d => { if (d.success) setCareers(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const analyzeGap = async () => {
    if (!selectedCareer || !userSkills.trim()) return;
    setGapLoading(true);
    try {
      const skills = userSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/api/ai/skill-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkills: skills, desiredCareer: selectedCareer }),
      });
      const d = await res.json();
      if (d.success) setSkillGap(d.data);
    } catch {}
    setGapLoading(false);
  };

  const getRecommendations = async () => {
    if (!userSkills.trim()) return;
    setRecLoading(true);
    try {
      const skills = userSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/api/ai/skill-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkills: skills, desiredCareer: selectedCareer || undefined }),
      });
      const d = await res.json();
      if (d.success) {
        setRecommendations(d.data.recommendations || []);
        setTrending(d.data.trending || []);
      }
    } catch {}
    setRecLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Career Roadmaps</h1>
            <p className="text-gray-600 mt-1">Explore tech careers, analyze your skill gaps, and get AI-powered recommendations</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'roadmaps' as const, label: 'Career Paths', icon: Brain },
              { id: 'gap' as const, label: 'Skill Gap Analysis', icon: AlertCircle },
              { id: 'recommend' as const, label: 'AI Recommendations', icon: Lightbulb },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Career Paths Tab */}
          {activeTab === 'roadmaps' && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careers.map(career => (
                    <div key={career.title} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CAREER_ICONS[career.title] || '💼'}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{career.title}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${DEMAND_COLORS[career.demandLevel] || 'bg-gray-100 text-gray-600'}`}>
                          {career.demandLevel}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Salary Range</span>
                          <span className="font-medium">${career.averageSalary.min.toLocaleString()} – ${career.averageSalary.max.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Growth Rate</span>
                          <span className="font-medium text-green-600">+{Math.round(career.growthRate * 100)}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {career.requiredSkills.map(skill => (
                            <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedCareer(career.title); setActiveTab('gap'); }}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm hover:bg-blue-50 font-medium"
                      >
                        Analyze My Fit <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Skill Gap Analysis Tab */}
          {activeTab === 'gap' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Input */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyze Your Skill Gap</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Your Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={userSkills}
                      onChange={e => setUserSkills(e.target.value)}
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Target Career</label>
                    <select
                      value={selectedCareer}
                      onChange={e => setSelectedCareer(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a career path</option>
                      {careers.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={analyzeGap}
                    disabled={gapLoading || !selectedCareer || !userSkills.trim()}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {gapLoading ? 'Analyzing...' : 'Analyze Skill Gap'}
                  </button>
                </div>
              </div>

              {/* Results */}
              {skillGap && (
                <>
                  {/* Score */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{skillGap.career}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        skillGap.skillScore >= 70 ? 'bg-green-100 text-green-700' :
                        skillGap.skillScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {skillGap.readinessLevel} ({skillGap.skillScore}%)
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                      <div className={`h-3 rounded-full transition-all ${
                        skillGap.skillScore >= 70 ? 'bg-green-500' :
                        skillGap.skillScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${skillGap.skillScore}%` }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matching */}
                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> You Have ({skillGap.matchingSkills.length})
                        </h4>
                        <div className="space-y-1.5">
                          {skillGap.matchingSkills.map(s => (
                            <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Missing */}
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <XCircle className="h-4 w-4" /> Missing ({skillGap.missingSkills.length})
                        </h4>
                        <div className="space-y-1.5">
                          {skillGap.missingSkills.map(s => (
                            <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                              <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Roadmap */}
                  {skillGap.learningRoadmap && skillGap.learningRoadmap.skills.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" /> Learning Roadmap
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {skillGap.learningRoadmap.totalSkills} skills to learn • Estimated {skillGap.learningRoadmap.estimatedTotalTime} months total
                      </p>
                      <div className="space-y-4">
                        {skillGap.learningRoadmap.skills.map((s, i) => (
                          <div key={s.skill} className="border border-gray-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                <span className="font-medium text-gray-900 capitalize">{s.skill}</span>
                              </div>
                              <span className="text-xs text-gray-500">~{s.estimatedTime} months</span>
                            </div>
                            {s.resources.length > 0 && (
                              <div className="mt-2 space-y-1 ml-9">
                                {s.resources.map(r => (
                                  <div key={r.title} className="text-xs text-gray-500">
                                    {r.title} — <span className="text-gray-700">{r.platform}</span> ({r.duration}, {r.level})
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* AI Recommendations Tab */}
          {activeTab === 'recommend' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Skill Recommendations</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Your Current Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={userSkills}
                      onChange={e => setUserSkills(e.target.value)}
                      placeholder="e.g., JavaScript, React, CSS"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Target Career (optional)</label>
                    <select
                      value={selectedCareer}
                      onChange={e => setSelectedCareer(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">General recommendations</option>
                      {careers.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={getRecommendations}
                    disabled={recLoading || !userSkills.trim()}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {recLoading ? 'Generating...' : 'Get Recommendations'}
                  </button>
                </div>
              </div>

              {recommendations.length > 0 && (
                <>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" /> Skills to Learn Next
                    </h3>
                    <div className="space-y-3">
                      {recommendations.map((rec, i) => (
                        <div key={rec.skill} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                i < 2 ? 'bg-red-500' : i < 4 ? 'bg-orange-500' : 'bg-blue-500'
                              }`}>{i + 1}</span>
                              <span className="font-medium text-gray-900 capitalize">{rec.skill}</span>
                            </div>
                            <span className="text-xs text-gray-500">~{rec.estimatedTime}</span>
                          </div>
                          {rec.resources.length > 0 && (
                            <div className="mt-2 space-y-1 ml-10">
                              {rec.resources.map(r => (
                                <div key={r.title} className="text-xs text-gray-500">
                                  {r.title} — <span className="text-gray-700">{r.platform}</span> ({r.duration})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {trending.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" /> Trending Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trending.map(t => (
                          <span key={t} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
