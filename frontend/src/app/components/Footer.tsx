'use client';

import { TrendingUp, Github, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Africa Market Intelligence</h3>
                <p className="text-xs text-gray-500">Job Market Platform</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              Empowering African tech professionals with data-driven insights to make informed career decisions and navigate the evolving job market landscape.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-3 text-blue-500" />
                <span>info@africamarketintelligence.com</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-4 w-4 mr-3 text-blue-500" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-3 text-blue-500" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Features</a></li>
              <li><a href="#analytics" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Analytics</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">How It Works</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">About</a></li>
              <li><a href="https://github.com/africamarketintelligence" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a></li>
              <li><a href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Documentation</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 Africa Market Intelligence. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
              <a href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
