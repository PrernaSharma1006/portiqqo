import { Link } from 'react-router-dom'
import Header from './Header'
import Threads from '../ui/Threads'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden w-full max-w-full">
        {children}
      </main>

      {/* Footer with WebGL Threads */}
      <footer className="relative bg-[#141210] dark:bg-[#0c0a09] text-stone-100 overflow-hidden border-t border-stone-800/80">
        {/* React Bits Threads Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Threads 
            color={[0.96, 0.45, 0.71]}
            amplitude={1.2}
            distance={0.15}
            enableMouseInteraction={true}
          />
        </div>

        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container-width section-padding py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f472b6] to-[#ec4899] rounded-xl flex items-center justify-center shadow-md shadow-pink-500/20 transform hover:scale-105 transition-transform duration-300">
                  <span className="text-stone-950 font-black text-base tracking-tight">PB</span>
                </div>
                <span className="text-2xl font-heading font-extrabold text-stone-100 tracking-tight">
                  Portiqqo
                </span>
              </div>
              <p className="text-stone-400 mb-5 max-w-md leading-relaxed text-sm">
                Create stunning professional portfolios with ease. 
                Showcase your work and get discovered by potential clients and employers worldwide.
              </p>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-stone-800/90 border border-stone-700/60 rounded-lg flex items-center justify-center group-hover:bg-[#f472b6] transition-colors duration-300">
                  <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-950 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <a href="mailto:portfolio.builder659@gmail.com" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 text-sm font-medium">
                  portfolio.builder659@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-base mb-4 text-stone-100 tracking-tight">Quick Links</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 flex items-center group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
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
                    className="text-stone-300 hover:text-pink-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
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
                    className="text-stone-300 hover:text-pink-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
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
                    className="text-stone-300 hover:text-pink-400 transition-colors duration-300 cursor-pointer flex items-center group text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h3 className="font-bold text-base mb-4 text-stone-100 tracking-tight">Support & Contact</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/help-center" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 flex items-center group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="mailto:portfolio.builder659@gmail.com" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 flex items-center group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 flex items-center group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-stone-300 hover:text-pink-400 transition-colors duration-300 flex items-center group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2.5 group-hover:w-3 transition-all duration-300"></span>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-800/80 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-stone-400 text-xs">
                &copy; 2025 Portiqqo. All rights reserved.
              </p>
              <div className="flex items-center space-x-3">
                <span className="text-stone-400 text-xs">Need help?</span>
                <a 
                  href="mailto:portfolio.builder659@gmail.com"
                  className="px-5 py-2 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-xl text-xs font-extrabold transition-all duration-300 shadow-md shadow-pink-500/20 hover:scale-105"
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