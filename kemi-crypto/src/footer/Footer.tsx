import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          
          {/* Kemi Crypto Info */}
          <div className="col-span-1 md:col-span-2 text-left">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black text-left">Kemi Crypto</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-md text-left">
              Advancing cryptocurrency analytics through rigorous data methodology and 
              ethical innovation. Building safer crypto systems for a better financial future.
            </p>
            <div className="flex space-x-4 justify-start">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-gray-600 transition-colors">
                {/* Twitter Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-600 transition-colors">
                {/* LinkedIn Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-gray-600 transition-colors">
                {/* GitHub Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link to="/learn-more" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/learn-more" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Resources</h4>
            <ul className="space-y-3">
              <li><a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">Datasets</a></li>
              <li><a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for updates and insights from our team.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kemi Crypto. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;