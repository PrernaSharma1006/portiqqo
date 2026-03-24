import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { User, LogOut, Settings, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const getUserDisplayName = () => {
    if (!user) return 'User'
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) {
      return user.firstName
    }
    return user.email?.split('@')[0] || 'User'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    const words = name.split(' ')
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 py-3 md:py-4 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container-width px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Separate on Left */}
          <Link 
            to="/" 
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold hover:opacity-80 transition-all duration-300 flex items-center group"
          >
            <span className="text-white group-hover:text-gray-200 transition-colors">porti</span>
            <span className="text-blue-400 inline-flex group-hover:text-blue-300 transition-colors">
              <span>q</span>
              <span className="inline-block transform scale-x-[-1]">q</span>
            </span>
            <span className="text-white group-hover:text-gray-200 transition-colors">o</span>
          </Link>

          {/* Navigation Container - Pill Shaped - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center space-x-2 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg dark:bg-slate-800/20 dark:border-slate-700/30">
              <button
                onClick={() => {
                  if (window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    window.location.href = '/'
                  }
                }}
                className="px-6 py-1.5 text-white hover:bg-white/20 hover:scale-105 rounded-full transition-all duration-300 font-medium text-base hover:shadow-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  if (window.location.pathname === '/') {
                    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = '/#templates'
                  }
                }}
                className="px-6 py-1.5 text-white hover:bg-white/20 hover:scale-105 rounded-full transition-all duration-300 font-medium text-base hover:shadow-lg"
              >
                Templates
              </button>
              <button
                onClick={() => {
                  if (window.location.pathname === '/') {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = '/#pricing'
                  }
                }}
                className="px-6 py-1.5 text-white hover:bg-white/20 hover:scale-105 rounded-full transition-all duration-300 font-medium text-base hover:shadow-lg"
              >
                Pricing
              </button>
              
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="px-6 py-1.5 text-white hover:bg-white/20 hover:scale-105 rounded-full transition-all duration-300 font-medium text-base hover:shadow-lg"
                >
                  Dashboard
                </Link>
              ) : null}
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-200 border border-white/20 text-white hover:scale-110 dark:bg-slate-800/20 dark:border-slate-700/30 dark:hover:bg-slate-700/30"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons / User Menu - Outside nav pill */}
            {isAuthenticated && user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-200 border border-white/20 dark:bg-slate-800/20 dark:border-slate-700/30 dark:hover:bg-slate-700/30"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getUserInitials()}
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 z-50 overflow-hidden transition-colors duration-300"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="px-5 py-4 bg-gradient-to-br from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                        Dashboard
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition-all mt-1 border-t border-gray-100 dark:border-slate-700"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <Link
                to="/auth"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all duration-300"
              >
                Get Started
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-white/10 dark:hover:bg-slate-700/30 rounded-full transition-all"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-4 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl p-4 transition-colors duration-300"
            >
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } else {
                      window.location.href = '/'
                    }
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      window.location.href = '/#templates'
                    }
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Templates
                </button>
                <button
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      window.location.href = '/#pricing'
                    }
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Pricing
                </button>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth"
                      className="block px-4 py-2 mx-2 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header