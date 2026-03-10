'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, BarChart3, User, Briefcase, Database, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CTA() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    const dashboardRoutes: Record<string, string> = {
      jobseeker: '/dashboard/jobseeker',
      recruiter: '/dashboard/recruiter',
      researcher: '/dashboard/researcher',
      developer: '/dashboard/developer',
      admin: '/dashboard/admin'
    };
    
    return dashboardRoutes[user.userType] || '/dashboard';
  };

  const getUserBenefits = () => {
    if (!user) return [
      'Real-time job market data',
      'AI-powered career predictions',
      'Salary insights across 15+ countries',
      'Interactive analytics dashboard',
      'Exportable reports and data',
      '24/7 customer support'
    ];
    
    const benefitsMap: Record<string, string[]> = {
      jobseeker: [
        'Personalized job recommendations',
        'AI career advisor and roadmap',
        'Resume analysis and optimization',
        'Skill gap identification',
        'Salary intelligence by role',
        'Interview preparation tools'
      ],
      recruiter: [
        'Talent market insights',
        'Salary benchmarking data',
        'Hiring trend analytics',
        'Competitor intelligence',
        'Candidate matching tools',
        'Recruitment ROI tracking'
      ],
      researcher: [
        'Comprehensive datasets',
        'Advanced analytics tools',
        'Custom report generation',
        'Trend analysis algorithms',
        'Data export capabilities',
        'Research collaboration tools'
      ],
      developer: [
        'API access and documentation',
        'Real-time data endpoints',
        'Code examples and SDKs',
        'Rate limit monitoring',
        'Webhook integrations',
        'Developer support'
      ],
      admin: [
        'User management dashboard',
        'System analytics and monitoring',
        'Content moderation tools',
        'Performance metrics',
        'Security audit logs',
        'Platform configuration'
      ]
    };
    
    return benefitsMap[user.userType] || benefitsMap.jobseeker;
  };

  const getUserCTA = () => {
    if (!user) return {
      headline: 'Start Exploring Africa\'s Job Market Data Today',
      subtext: 'Join thousands of tech professionals making data-driven career decisions across Africa',
      buttonText: 'Get Started Now',
      trustBadge: 'No credit card required • Free 14-day trial'
    };
    
    const ctaMap: Record<string, any> = {
      jobseeker: {
        headline: 'Ready to Take Your Career to the Next Level?',
        subtext: 'Access your personalized dashboard and discover opportunities tailored to your skills and goals',
        buttonText: 'Go to Your Dashboard',
        trustBadge: 'Free career analysis • Personalized recommendations'
      },
      recruiter: {
        headline: 'Find the Perfect Talent for Your Team',
        subtext: 'Leverage data-driven insights to make smarter hiring decisions and build your dream team',
        buttonText: 'Access Recruiter Tools',
        trustBadge: 'Advanced analytics • Talent intelligence'
      },
      researcher: {
        headline: 'Unlock Deep Insights into Africa\'s Tech Market',
        subtext: 'Explore comprehensive datasets and discover trends that shape the future of tech in Africa',
        buttonText: 'Access Research Tools',
        trustBadge: 'Premium datasets • Advanced analytics'
      },
      developer: {
        headline: 'Build Amazing Applications with Our API',
        subtext: 'Integrate real-time job market data into your applications and create innovative solutions',
        buttonText: 'Access Developer Portal',
        trustBadge: 'RESTful API • Comprehensive documentation'
      },
      admin: {
        headline: 'Manage and Grow the Platform',
        subtext: 'Monitor system performance, manage users, and ensure the best experience for everyone',
        buttonText: 'Go to Admin Dashboard',
        trustBadge: 'System controls • Advanced analytics'
      }
    };
    
    return ctaMap[user.userType] || ctaMap.jobseeker;
  };

  const benefits = getUserBenefits();
  const cta = getUserCTA();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {cta.headline}
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          {cta.subtext}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">45,678</div>
            <div className="text-gray-600">Jobs Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Countries Covered</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-left">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <button
              onClick={() => router.push(getDashboardLink())}
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {cta.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => router.push('/signup')}
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {cta.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-full">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">
              {cta.trustBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
