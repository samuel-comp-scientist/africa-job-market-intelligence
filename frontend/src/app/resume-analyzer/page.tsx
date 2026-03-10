'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

export default function ResumeAnalyzerPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading resume analyzer...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Resume Analyzer 📄
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your resume and get instant AI-powered analysis. Discover your strengths, identify skill gaps, and receive personalized recommendations to boost your career in the African tech job market.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Analysis</h3>
              <p className="text-sm text-gray-600">AI extracts and analyzes your technical skills</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resume Scoring</h3>
              <p className="text-sm text-gray-600">Get scored against market requirements</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Matching</h3>
              <p className="text-sm text-gray-600">Find jobs that match your profile</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Resources</h3>
              <p className="text-sm text-gray-600">Get recommendations to fill skill gaps</p>
            </div>
          </div>

          {/* Resume Analyzer Component */}
          <ResumeAnalyzer />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
