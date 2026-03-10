'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JobMarket.AI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
            <a href="#insights" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Insights</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Pricing</a>
            <button 
              onClick={() => router.push('/login')} 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/signup')} 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm"
            >
              Get Started
            </button>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-gray-200 pt-4">
            <a href="#features" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
            <a href="#insights" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Insights</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">How It Works</a>
            <a href="#pricing" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <button 
              onClick={() => router.push('/login')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/signup')} 
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white text-sm"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
