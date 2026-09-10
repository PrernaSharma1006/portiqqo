import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Dribbble, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Youtube,
  Facebook
} from 'lucide-react'

function TemplateFooter({
  name = 'John Doe',
  title = 'Professional Specialist',
  tagline = 'Crafting digital experiences with passion and precision.',
  email = '',
  phone = '',
  location = '',
  socialLinks = {},
  quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ],
  stats = [],
  accentColor = 'purple',
  isHidden = false
}) {
  if (isHidden) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Accent color map for dynamic styling
  const colorMap = {
    purple: {
      accentText: 'text-purple-400',
      buttonBg: 'bg-purple-600 hover:bg-purple-500 text-white',
      glow: 'from-purple-600/20 to-pink-600/20',
      badge: 'bg-purple-400'
    },
    blue: {
      accentText: 'text-blue-400',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white',
      glow: 'from-blue-600/20 to-cyan-600/20',
      badge: 'bg-blue-400'
    },
    emerald: {
      accentText: 'text-emerald-400',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      glow: 'from-emerald-600/20 to-teal-600/20',
      badge: 'bg-emerald-400'
    },
    orange: {
      accentText: 'text-orange-400',
      buttonBg: 'bg-orange-600 hover:bg-orange-500 text-white',
      glow: 'from-orange-600/20 to-amber-600/20',
      badge: 'bg-orange-400'
    },
    rose: {
      accentText: 'text-rose-400',
      buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white',
      glow: 'from-rose-600/20 to-pink-600/20',
      badge: 'bg-rose-400'
    },
    amber: {
      accentText: 'text-amber-400',
      buttonBg: 'bg-amber-600 hover:bg-amber-500 text-white',
      glow: 'from-amber-600/20 to-orange-600/20',
      badge: 'bg-amber-400'
    },
    indigo: {
      accentText: 'text-indigo-400',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      glow: 'from-indigo-600/20 to-purple-600/20',
      badge: 'bg-indigo-400'
    }
  }

  const theme = colorMap[accentColor] || colorMap.purple

  // Normalize social links into array format with platform & url
  let normalizedSocial = []
  if (Array.isArray(socialLinks)) {
    normalizedSocial = socialLinks
      .filter(item => item && (item.url || item.href))
      .map(item => ({
        platform: item.platform || item.name || 'Link',
        url: item.url || item.href
      }))
  } else if (socialLinks && typeof socialLinks === 'object') {
    normalizedSocial = Object.entries(socialLinks)
      .filter(([_, url]) => Boolean(url))
      .map(([platform, url]) => ({ platform, url }))
  }

  // Normalize stats array/object
  let normalizedStats = []
  if (Array.isArray(stats)) {
    normalizedStats = stats.map(st => ({
      label: st.label || st.key || st.name || '',
      value: st.value || st.count || ''
    }))
  } else if (stats && typeof stats === 'object') {
    normalizedStats = Object.entries(stats).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: String(value)
    }))
  }

  const renderSocialIcon = (platformName) => {
    const key = (platformName || '').toLowerCase()
    if (key.includes('github')) return <Github className="w-4 h-4" />
    if (key.includes('linkedin')) return <Linkedin className="w-4 h-4" />
    if (key.includes('twitter') || key === 'x') return <Twitter className="w-4 h-4" />
    if (key.includes('instagram')) return <Instagram className="w-4 h-4" />
    if (key.includes('dribbble')) return <Dribbble className="w-4 h-4" />
    if (key.includes('youtube')) return <Youtube className="w-4 h-4" />
    if (key.includes('facebook')) return <Facebook className="w-4 h-4" />
    return <Globe className="w-4 h-4" />
  }

  return (
    <footer className="relative bg-slate-950 text-slate-200 overflow-hidden pt-16 pb-8 border-t border-slate-800/80">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className={`absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r ${theme.glow} blur-3xl`} />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl ${theme.buttonBg} flex items-center justify-center font-bold text-xl shadow-lg shadow-black/40`}>
                {name ? name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight !text-white">{name}</h3>
                <p className={`text-sm font-medium ${theme.accentText}`}>{title}</p>
              </div>
            </div>

            {tagline && (
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                {tagline}
              </p>
            )}

            {/* Status indicator */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for new projects & opportunities</span>
            </div>

            {/* Social Links Icons */}
            {normalizedSocial.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {normalizedSocial.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-200 text-xs font-medium"
                    title={item.platform}
                  >
                    {renderSocialIcon(item.platform)}
                    <span className="capitalize">{item.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider !text-slate-200">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center space-x-1.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.badge} opacity-60`}></span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider !text-slate-200">Get In Touch</h4>
            
            <div className="space-y-3 text-sm">
              {email && (
                <a 
                  href={`mailto:${email}`} 
                  className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <Mail className={`w-4 h-4 ${theme.accentText}`} />
                  <span className="truncate">{email}</span>
                </a>
              )}
              
              {phone && (
                <a 
                  href={`tel:${phone}`} 
                  className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <Phone className={`w-4 h-4 ${theme.accentText}`} />
                  <span>{phone}</span>
                </a>
              )}

              {location && (
                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                  <MapPin className={`w-4 h-4 ${theme.accentText}`} />
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Quick Stats if provided */}
            {normalizedStats.length > 0 && (
              <div className="pt-2">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 !text-slate-400">Quick Stats</h5>
                <div className="grid grid-cols-2 gap-2">
                  {normalizedStats.map((st, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                      <div className={`text-base font-bold ${theme.accentText}`}>{st.value}</div>
                      <div className="text-xs text-slate-400 capitalize">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Back to Top Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <span>Powered by</span>
              <a 
                href="mailto:portfolio.builder659@gmail.com" 
                className={`font-semibold ${theme.accentText} hover:underline`}
              >
                Portiqqo
              </a>
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all duration-200"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default TemplateFooter
