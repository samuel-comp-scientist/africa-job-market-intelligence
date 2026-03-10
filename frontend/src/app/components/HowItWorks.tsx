'use client';

import { Database, Cpu, Brain, BarChart3, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Database,
      title: 'Collect Job Data',
      description: 'We continuously gather and analyze job postings from leading African job boards, company career pages, and professional networks.',
      details: ['50,000+ job postings', '15+ African countries', 'Real-time updates']
    },
    {
      icon: Cpu,
      title: 'Analyze Skills and Salaries',
      description: 'Our advanced algorithms process job descriptions to extract skill requirements, experience levels, and compensation data.',
      details: ['Skill extraction', 'Salary analysis', 'Experience classification']
    },
    {
      icon: Brain,
      title: 'Generate AI Insights',
      description: 'Machine learning models identify trends, predict market movements, and provide actionable career recommendations.',
      details: ['Trend prediction', 'Career pathing', 'Skill gap analysis']
    },
    {
      icon: BarChart3,
      title: 'Visualize Job Market Trends',
      description: 'Transform complex data into intuitive dashboards, charts, and reports that help you make informed career decisions.',
      details: ['Interactive charts', 'Custom reports', 'Data export']
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From raw job data to actionable career insights in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-blue-300 transition-colors">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-sm">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-full">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Processing 1000+ job postings per hour
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
