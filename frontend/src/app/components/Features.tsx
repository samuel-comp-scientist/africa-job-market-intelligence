'use client';

import { BarChart3, TrendingUp, Brain, Eye, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Features() {
  const router = useRouter();

  const features = [
    {
      icon: BarChart3,
      title: 'Skill Demand Analytics',
      description: 'Track real-time demand for tech skills across African markets. Identify which programming languages, frameworks, and tools employers are looking for right now.',
      color: 'blue',
      stats: '89% accuracy'
    },
    {
      icon: TrendingUp,
      title: 'Salary Trend Insights',
      description: 'Get comprehensive salary data by role, experience level, and location. Negotiate better compensation with data-backed insights.',
      color: 'green',
      stats: '15+ countries'
    },
    {
      icon: Brain,
      title: 'AI Career Predictions',
      description: 'Leverage machine learning to predict career growth opportunities and skill gaps. Get personalized recommendations for your career path.',
      color: 'purple',
      stats: 'AI-powered'
    },
    {
      icon: Eye,
      title: 'Job Market Visualization',
      description: 'Interactive dashboards and charts make complex job market data easy to understand. Export insights for presentations and reports.',
      color: 'orange',
      stats: 'Real-time data'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Analytics for Your Career
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the insights you need to make informed decisions about your tech career in Africa
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => router.push('/demo')}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats Badge */}
                <div className={`inline-flex items-center px-3 py-1 bg-${feature.color}-50 border border-${feature.color}-200 rounded-full text-sm font-medium text-${feature.color}-700`}>
                  {feature.stats}
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
