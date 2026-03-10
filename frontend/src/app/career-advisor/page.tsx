'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AICareerAdvisor from '../components/AICareerAdvisor';

export default function CareerAdvisorPage() {
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
              <p className="mt-4 text-gray-600">Loading career advisor...</p>
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
              AI Career Advisor 🧠
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized career guidance powered by AI. Enter your skills and desired career to receive a comprehensive roadmap for success in the African tech job market.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-sm text-gray-600">AI identifies missing skills for your target career</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Roadmap</h3>
              <p className="text-sm text-gray-600">Step-by-step plan to reach your career goals</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Salary Prediction</h3>
              <p className="text-sm text-gray-600">Estimate your earning potential</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎲</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Probability</h3>
              <p className="text-sm text-gray-600">Calculate your chances of landing the job</p>
            </div>
          </div>

          {/* AI Career Advisor Component */}
          <AICareerAdvisor />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
