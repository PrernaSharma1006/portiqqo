import { Link } from 'react-router-dom'
import Header from './Header'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative container-width section-padding py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-base">PB</span>
                </div>
                <span className="text-xl font-heading font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Portiqqo
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md leading-relaxed text-sm">
                Create stunning professional portfolios with ease. 
                Showcase your work and get discovered by potential clients and employers.
              </p>
              <div className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <a href="mailto:portfolio.builder659@gmail.com" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm">
                  portfolio.builder659@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-base mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
                      } else {
                        window.location.href = '/#templates'
                      }
                    }}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                      } else {
                        window.location.href = '/#features'
                      }
                    }}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                      } else {
                        window.location.href = '/#pricing'
                      }
                    }}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h3 className="font-semibold text-base mb-4 text-white">Support & Contact</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help-center" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="mailto:portfolio.builder659@gmail.com" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 group-hover:w-3 transition-all duration-300"></span>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-gray-400 text-xs">
                &copy; 2025 Portiqqo. All rights reserved.
              </p>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 text-xs">Need help?</span>
                <a 
                  href="mailto:portfolio.builder659@gmail.com"
                  className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout