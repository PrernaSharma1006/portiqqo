import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Palette, Camera, Code, Layers, Briefcase, Pencil, Monitor, ExternalLink, Crown, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { portfolioAPI } from '../../services/api'
import toast from 'react-hot-toast'

const templates = [
  {
    id: 'web-developer',
    name: 'Web Developer',
    description: 'Perfect for showcasing your coding projects and technical skills',
    icon: Code,
    color: 'from-blue-500 via-cyan-500 to-teal-400',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    features: ['Project Gallery', 'Tech Stack', 'GitHub Integration'],
    available: true,
    badgeColor: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'uiux-designer',
    name: 'UI/UX Designer',
    description: 'Display your design process and creative solutions beautifully',
    icon: Palette,
    color: 'from-rose-500 via-pink-500 to-fuchsia-400',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    features: ['Case Studies', 'Design Process', 'Figma Embeds'],
    available: true,
    badgeColor: 'from-rose-400 to-pink-400'
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Showcase your video projects with embedded players and reels',
    icon: Monitor,
    color: 'from-emerald-500 via-green-500 to-lime-400',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    features: ['Video Showcase', 'YouTube Integration', 'Showreel'],
    available: true,
    badgeColor: 'from-emerald-400 to-green-400'
  },
  {
    id: 'photographer',
    name: 'Photo Editor',
    description: 'Stunning layouts for photography and thumbnail editing showcase',
    icon: Camera,
    color: 'from-violet-500 via-purple-500 to-indigo-400',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
    features: ['Photo Galleries', 'Thumbnail Editor', 'Portfolio Display'],
    available: true,
    badgeColor: 'from-violet-400 to-purple-400'
  },
  {
    id: 'digital-marketer',
    name: 'Digital Marketer',
    description: 'Present your campaigns, results, and marketing expertise',
    icon: Briefcase,
    color: 'from-orange-500 via-amber-500 to-yellow-400',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    features: ['Campaign Results', 'Analytics', 'Client Testimonials'],
    available: true,
    badgeColor: 'from-orange-400 to-amber-400'
  },
  {
    id: 'general',
    name: 'General Portfolio',
    description: 'Flexible template suitable for any profession or creative field',
    icon: Sparkles,
    color: 'from-slate-500 via-gray-500 to-zinc-400',
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=600&h=400&fit=crop',
    features: ['Customizable', 'Multi-Purpose', 'Easy Setup'],
    available: true,
    badgeColor: 'from-slate-400 to-gray-400'
  }
]

function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [existingPortfolios, setExistingPortfolios] = useState([])
  const [loadingPortfolios, setLoadingPortfolios] = useState(true)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Fetch user's existing portfolios on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPortfolios()
    }
  }, [isAuthenticated, user])

  const fetchPortfolios = async () => {
    try {
      setLoadingPortfolios(true)
      const response = await portfolioAPI.getMyPortfolios()
      if (response.data.success) {
        setExistingPortfolios(response.data.portfolios || [])
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoadingPortfolios(false)
    }
  }

  const handleTemplateSelect = (templateId) => {
    // Check if user has existing portfolios and is trying to create a new one
    if (existingPortfolios.length > 0) {
      // For now, show upgrade prompt if they have 1 portfolio (free users)
      // In future, check actual subscription status
      setShowUpgradePrompt(true)
      return
    }

    // Route to the appropriate template editor
    const routeMap = {
      'web-developer': '/editor/web-developer',
      'uiux-designer': '/editor/ui-ux-designer',
      'video-editor': '/editor/video-editor',
      'photographer': '/editor/photographer',
      'digital-marketer': '/editor/digital-marketer',
      'general': '/builder/general'
    }
    
    const route = routeMap[templateId] || '/builder/general'
    navigate(route)
  }

  const handleEditPortfolio = (portfolio) => {
    // Map profession to editor route
    const professionToRoute = {
      'developer': '/editor/web-developer',
      'ui-ux-designer': '/editor/ui-ux-designer',
      'video-editor': '/editor/video-editor',
      'photographer': '/editor/photographer',
      'digital-marketer': '/editor/digital-marketer'
    }
    
    const route = professionToRoute[portfolio.profession] || '/builder/general'
    navigate(route, { state: { portfolioId: portfolio._id, existingPortfolio: portfolio } })
  }

  const handleViewPortfolio = (portfolio) => {
    const url = `https://${portfolio.subdomain}.portiqqo.me`
    window.open(url, '_blank')
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [portfolioToDelete, setPortfolioToDelete] = useState(null)

  const handleDeleteClick = (portfolio) => {
    setPortfolioToDelete(portfolio)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!portfolioToDelete) return
    
    try {
      await portfolioAPI.delete(portfolioToDelete._id)
      toast.success('Portfolio deleted successfully!')
      
      // Refresh portfolios list
      fetchPortfolios()
      
      // Close modal
      setShowDeleteModal(false)
      setPortfolioToDelete(null)
    } catch (error) {
      console.error('Delete portfolio error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete portfolio')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPortfolioToDelete(null)
  }

  const handleTemplatePreview = (templateId, event) => {
    event.stopPropagation() // Prevent card click
    // Route to template preview
    const previewMap = {
      'web-developer': '/preview/web-developer',
      'uiux-designer': '/preview/ui-ux-designer',
      'video-editor': '/preview/video-editor',
      'photographer': '/preview/photographer',
      'digital-marketer': '/preview/digital-marketer',
      'general': '/preview/general'
    }
    
    const route = previewMap[templateId] || '/preview/general'
    navigate(route)
  }

  return (
    <>
      <Helmet>
        <title>Choose Your Template - Portiqqo</title>
        <meta name="description" content="Select the perfect template for your portfolio" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="container-width section-padding page-padding">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                {isAuthenticated && user ? `Welcome back, ${user.firstName}!` : 'Welcome!'}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
              Select a professionally designed template that matches your profession and start building your stunning portfolio in minutes
            </p>
            {isAuthenticated && user && (
              <p className="text-sm text-slate-500">
                Signed in as <span className="font-medium text-slate-700">{user.email}</span>
              </p>
            )}
          </motion.div>

          {/* Existing Portfolios Section */}
          {!loadingPortfolios && existingPortfolios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Your Portfolios</h2>
                <span className="text-sm text-slate-500">
                  {existingPortfolios.length} {existingPortfolios.length === 1 ? 'portfolio' : 'portfolios'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {existingPortfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio._id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">{portfolio.title}</h3>
                          <p className="text-sm text-slate-500 capitalize">
                            {portfolio.profession?.replace(/-/g, ' ')}
                          </p>
                        </div>
                        {portfolio.isPublished && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Published
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <a 
                          href={`https://${portfolio.subdomain}.portiqqo.me`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-700 hover:underline truncate"
                        >
                          {portfolio.subdomain}.portiqqo.me
                        </a>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditPortfolio(portfolio)}
                          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        {portfolio.isPublished && (
                          <button
                            onClick={() => handleViewPortfolio(portfolio)}
                            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300"
                            title="View Portfolio"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(portfolio)}
                          className="py-2.5 px-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium transition-all duration-300"
                          title="Delete Portfolio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Separator */}
              <div className="mt-16 mb-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 text-slate-500 text-sm font-medium">
                      {existingPortfolios.length >= 1 ? 'Upgrade to Premium to create more portfolios' : 'Or choose a new template'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Templates Grid */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
              {existingPortfolios.length > 0 ? 'Create Another Portfolio' : 'Choose Your Template'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {templates.map((template, index) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-50 group-hover:opacity-30 transition-opacity`}></div>
                      
                      {/* Icon Badge */}
                      <div className={`absolute top-4 right-4 w-14 h-14 bg-gradient-to-br ${template.badgeColor || 'from-purple-400 to-blue-400'} backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Popular Badge for first 3 */}
                      {index < 3 && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                          POPULAR
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        {template.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2.5 mb-6">
                        {template.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleTemplateSelect(template.id)}
                          className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Start Building
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                        
                        <button 
                          onClick={(e) => handleTemplatePreview(template.id, e)}
                          className="w-full py-2.5 px-4 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview Template
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          >
            <button
              onClick={() => setShowUpgradePrompt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Upgrade to Premium</h3>
              <p className="text-slate-600">
                Free users can create <strong>one portfolio</strong>. Upgrade to Premium to create unlimited portfolios!
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-slate-800 mb-3">Premium Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Unlimited portfolios
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom domain support
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradePrompt(false)
                  navigate('/subscription')
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && portfolioToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete Portfolio?</h3>
              <p className="text-slate-600 mb-2">
                Are you sure you want to delete <strong>{portfolioToDelete.title}</strong>?
              </p>
              <p className="text-sm text-slate-500">
                This will permanently delete your portfolio at{' '}
                <span className="font-medium">{portfolioToDelete.subdomain}.portiqqo.me</span>
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 text-center">
                ⚠️ This action cannot be undone
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Portfolio
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default DashboardPage