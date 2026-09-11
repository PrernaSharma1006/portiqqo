import { useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { User, LogOut, Settings, ChevronDown, Sun, Moon, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PillNav from '../ui/PillNav'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  const navItems = useMemo(() => {
    const items = [
      { 
        label: 'Home', 
        href: '/',
        onClick: (e) => {
          if (location.pathname === '/') {
            e?.preventDefault?.()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }
      },
      { 
        label: 'Templates', 
        href: '/#templates',
        onClick: (e) => {
          if (location.pathname === '/') {
            e?.preventDefault?.()
            scrollToSection('templates')
          }
        }
      },
      { 
        label: 'Pricing', 
        href: '/#pricing',
        onClick: (e) => {
          if (location.pathname === '/') {
            e?.preventDefault?.()
            scrollToSection('pricing')
          }
        }
      }
    ]
    if (isAuthenticated) {
      items.push({
        label: 'Dashboard',
        href: '/dashboard'
      })
    }
    return items
  }, [location.pathname, isAuthenticated])

  return (
    <header className="sticky top-0 z-50 py-1.5 bg-[#f9f6f0]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-[#e6ccb2]/80 dark:border-stone-800 transition-colors duration-300">
      <div className="container-width px-3 sm:px-6 md:px-8">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="text-xl sm:text-3xl font-heading font-extrabold hover:opacity-85 transition-all duration-300 flex items-center group flex-shrink-0"
          >
            <span className="text-stone-900 dark:text-stone-100 transition-colors">porti</span>
            <span className="text-pink-500 inline-flex group-hover:text-pink-600 transition-colors">
              <span>q</span>
              <span className="inline-block transform scale-x-[-1]">q</span>
            </span>
            <span className="text-stone-900 dark:text-stone-100 transition-colors">o</span>
          </Link>

          {/* Center Section: Desktop PillNav, Mobile Centered Get Started Button */}
          <div className="flex-1 flex justify-center min-w-0">
            {/* Desktop PillNav */}
            <div className="hidden md:block">
              <PillNav
                items={navItems}
                activeHref={location.pathname}
                baseColor={isDark ? '#26221f' : '#f5ebe0'}
                pillColor={isDark ? '#141210' : '#1c1917'}
                hoveredPillTextColor="#1c1917"
                pillTextColor={isDark ? '#fdfbf7' : '#fdfbf7'}
                initialLoadAnimation={false}
              />
            </div>

            {/* Mobile Centered Get Started / Dashboard Button */}
            <div className="md:hidden flex items-center justify-center">
              {isAuthenticated && user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-full font-extrabold text-xs shadow-md shadow-pink-500/20"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-1.5 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-full font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Right Actions: Theme Toggle + Mobile Menu (Three Lines) on Mobile, Desktop Auth on Desktop */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full bg-[#f5ebe0] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-[#e6ccb2] dark:border-stone-700 hover:scale-105 transition-all duration-200"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-pink-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f5ebe0] dark:bg-stone-800 border border-[#e6ccb2] dark:border-stone-700 transition-all duration-200"
                  >
                    <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-stone-950 text-xs font-black">
                      {getUserInitials()}
                    </div>
                    <span className="text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm hidden sm:inline">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 bg-[#fdfbf7] dark:bg-stone-900 rounded-2xl shadow-2xl border border-[#e6ccb2] dark:border-stone-800 py-2 z-50 overflow-hidden"
                        onMouseLeave={() => setShowUserMenu(false)}
                      >
                        <div className="px-5 py-4 bg-[#f5ebe0]/60 dark:bg-stone-800/60 border-b border-[#e6ccb2]/60 dark:border-stone-800">
                          <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-1">
                            {user.email}
                          </p>
                        </div>
                        
                        <Link
                          to="/dashboard"
                          className="flex items-center px-5 py-3 text-sm font-bold text-stone-900 dark:text-stone-100 hover:bg-[#f5ebe0] dark:hover:bg-stone-800 transition-all border-b border-[#e6ccb2]/40 dark:border-stone-800"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3 text-pink-500" />
                          My Dashboard
                        </Link>

                        <Link
                          to="/#templates"
                          className="flex items-center px-5 py-3 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-[#f5ebe0] dark:hover:bg-stone-800 transition-all"
                          onClick={() => {
                            setShowUserMenu(false)
                            scrollToSection('templates')
                          }}
                        >
                          <User className="w-4 h-4 mr-3 text-pink-500" />
                          Explore Templates
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center px-5 py-3 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-[#f5ebe0] dark:hover:bg-stone-800 transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-pink-500" />
                          Settings
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-800 transition-all mt-1 border-t border-[#e6ccb2]/60 dark:border-stone-800"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-5 py-2 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-full font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Three-Lines Menu Button on Far Right Corner */}
            <div className="md:hidden">
              <PillNav
                items={navItems}
                activeHref={location.pathname}
                baseColor={isDark ? '#26221f' : '#f5ebe0'}
                pillColor={isDark ? '#141210' : '#1c1917'}
                hoveredPillTextColor="#1c1917"
                pillTextColor={isDark ? '#fdfbf7' : '#fdfbf7'}
                initialLoadAnimation={false}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header