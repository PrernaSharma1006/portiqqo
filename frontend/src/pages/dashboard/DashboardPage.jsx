import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Palette, Camera, Code, Layers, Briefcase, Pencil, Monitor, ExternalLink, Edit, Trash2, Copy, Check, Crown, Clock, Globe, ShieldCheck, CheckCircle2, AlertCircle, X, Loader2, BarChart3, TrendingUp, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { portfolioAPI, getApiUrl } from '../../services/api'
import toast from 'react-hot-toast'
import TemplateMosaicGrid from '../../components/templates/TemplateMosaicGrid'
import PortfolioAnalyticsModal from '../../components/modals/PortfolioAnalyticsModal'

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
  const [copiedId, setCopiedId] = useState(null)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [switchingPortfolio, setSwitchingPortfolio] = useState(false)
  const [subscription, setSubscription] = useState(null)

  const isPremium = subscription?.type === 'premium' && subscription?.status === 'active'

  // Fetch subscription status
  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(getApiUrl('/api/subscriptions/me'), {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setSubscription(data.subscription)
    } catch (_) {}
  }

  // Fetch user's existing portfolios on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPortfolios()
      fetchSubscription()
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
    // Clear old localStorage step-builder portfolios
    ;['generalPortfolio', 'developerPortfolio', 'photographerPortfolio',
      'videoEditorPortfolio', 'uiuxPortfolio', 'portfolios'].forEach(k => localStorage.removeItem(k))
  }

  const routeMap = {
    'web-developer': '/editor/web-developer',
    'uiux-designer': '/editor/ui-ux-designer',
    'video-editor': '/editor/video-editor',
    'photographer': '/editor/photographer',
    'digital-marketer': '/editor/digital-marketer',
    'general': '/editor/general-portfolio'
  }

  const handleTemplateSelect = (templateId) => {
    if (existingPortfolios.length > 0 && !isPremium) {
      // Free users: ask to replace or upgrade
      setPendingTemplate(templateId)
      return
    }
    navigate(routeMap[templateId] || '/editor/general-portfolio')
  }

  const handleConfirmSwitch = async () => {
    if (!pendingTemplate || existingPortfolios.length === 0) return
    try {
      setSwitchingPortfolio(true)
      // Delete all existing portfolios
      await Promise.all(existingPortfolios.map(p => portfolioAPI.delete(p._id)))
      setExistingPortfolios([])
      toast.success('Previous portfolio deleted. Starting fresh!')
      navigate(routeMap[pendingTemplate] || '/editor/general-portfolio')
    } catch (error) {
      console.error('Error switching portfolio:', error)
      toast.error('Failed to delete existing portfolio')
    } finally {
      setSwitchingPortfolio(false)
      setPendingTemplate(null)
    }
  }

  const handleEditPortfolio = (portfolio) => {
    // Map profession to editor route
    const professionToRoute = {
      'developer': '/editor/web-developer',
      'ui-ux-designer': '/editor/ui-ux-designer',
      'video-editor': '/editor/video-editor',
      'photographer': '/editor/photographer',
      'digital-marketer': '/editor/digital-marketer',
      'general': '/editor/general-portfolio'
    }
    
    const route = professionToRoute[portfolio.profession] || '/builder/general'
    navigate(route, { state: { portfolioId: portfolio._id, existingPortfolio: portfolio } })
  }

  const getPortfolioUrl = (portfolio) => {
    if (!portfolio) return null
    if (portfolio.publicUrl) return portfolio.publicUrl
    if (portfolio.customDomain && portfolio.customDomainVerified) return `https://${portfolio.customDomain}`
    const sub = portfolio.subdomain?.replace(/\.portiqqo\.me$/, '')
    return sub ? `${window.location.origin}/${sub}` : null
  }

  const handleViewPortfolio = (portfolio) => {
    const url = getPortfolioUrl(portfolio)
    if (url) window.open(url, '_blank')
  }

  const handleCopyLink = (portfolio) => {
    const url = getPortfolioUrl(portfolio)
    if (url) {
      navigator.clipboard.writeText(url)
      setCopiedId(portfolio._id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const getTrialInfo = (portfolio) => {
    if (!portfolio.freeTrialEndsAt) return null
    const now = new Date()
    const trialEnd = new Date(portfolio.freeTrialEndsAt)
    const msLeft = trialEnd - now
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
    return { expired: daysLeft <= 0, daysLeft: Math.max(0, daysLeft) }
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

  // Visitor Analytics modal state & handler
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [analyticsPortfolio, setAnalyticsPortfolio] = useState(null)

  const handleOpenAnalyticsModal = (portfolio) => {
    setAnalyticsPortfolio(portfolio)
    setShowAnalyticsModal(true)
  }

  // Custom Domain modal state & handlers
  const [showDomainModal, setShowDomainModal] = useState(false)
  const [domainPortfolio, setDomainPortfolio] = useState(null)
  const [customDomainInput, setCustomDomainInput] = useState('')
  const [savingDomain, setSavingDomain] = useState(false)
  const [verifyingDomain, setVerifyingDomain] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  const handleOpenDomainModal = (portfolio) => {
    setDomainPortfolio(portfolio)
    setCustomDomainInput(portfolio.customDomain || '')
    setVerificationResult(null)
    setShowDomainModal(true)
  }

  const handleSaveDomain = async () => {
    if (!domainPortfolio || !customDomainInput.trim()) {
      toast.error('Please enter a domain name')
      return
    }
    setSavingDomain(true)
    try {
      const res = await portfolioAPI.setCustomDomain(domainPortfolio._id, customDomainInput.trim())
      if (res.data.success) {
        toast.success('Custom domain saved! Follow DNS instructions below.')
        setDomainPortfolio(prev => ({
          ...prev,
          customDomain: res.data.customDomain,
          customDomainVerified: res.data.customDomainVerified
        }))
        await fetchPortfolios()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set custom domain')
    } finally {
      setSavingDomain(false)
    }
  }

  const handleVerifyDomain = async () => {
    if (!domainPortfolio) return
    setVerifyingDomain(true)
    try {
      const res = await portfolioAPI.verifyCustomDomain(domainPortfolio._id)
      if (res.data.success && res.data.verified) {
        toast.success('🎉 Domain verified! Your portfolio is live on your custom domain.')
        setDomainPortfolio(prev => ({
          ...prev,
          customDomainVerified: true
        }))
        setVerificationResult({ success: true, message: res.data.message })
        await fetchPortfolios()
      } else {
        toast.error(res.data.message || 'DNS verification pending')
        setVerificationResult({ success: false, message: res.data.message, details: res.data.details })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed')
      setVerificationResult({ success: false, message: err.response?.data?.message || 'Verification failed' })
    } finally {
      setVerifyingDomain(false)
    }
  }

  const handleRemoveDomain = async () => {
    if (!domainPortfolio) return
    try {
      const res = await portfolioAPI.removeCustomDomain(domainPortfolio._id)
      if (res.data.success) {
        toast.success('Custom domain removed')
        setCustomDomainInput('')
        setDomainPortfolio(prev => ({
          ...prev,
          customDomain: null,
          customDomainVerified: false
        }))
        setVerificationResult(null)
        await fetchPortfolios()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove domain')
    }
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
        <title>Dashboard - Portiqqo</title>
        <meta name="description" content="Manage your portfolio website, analytics, and custom domain settings" />
      </Helmet>

      <div className="min-h-screen bg-[#f9f6f0] dark:bg-[#141210] text-stone-900 dark:text-stone-100 transition-colors duration-300">
        <div className="container-width section-padding page-padding">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5ebe0] dark:bg-stone-900 border border-[#e6ccb2] dark:border-stone-800 rounded-full mb-6 text-xs sm:text-sm font-semibold text-stone-900 dark:text-pink-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>
                {isAuthenticated && user ? `Welcome back, ${user.firstName}!` : 'Welcome!'}
              </span>
              {isPremium && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#f472b6] text-stone-950 text-xs font-black rounded-full ml-1">
                  <Crown className="w-3 h-3 fill-stone-950" /> Premium
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
              {existingPortfolios.length > 0 ? 'Your Portfolio Dashboard' : 'Choose Your Perfect Template'}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-3 leading-relaxed">
              {existingPortfolios.length > 0 
                ? 'Manage your portfolio website, track visitor analytics, and set up your custom domain.'
                : 'Select a professionally designed template that matches your craft and publish your portfolio in minutes.'}
            </p>
            {isAuthenticated && user && (
              <p className="text-xs text-stone-500 dark:text-stone-400 break-all mb-6">
                Signed in as <span className="font-medium text-stone-800 dark:text-stone-200">{user.email}</span>
              </p>
            )}

            {/* ── Subscription & Plan Status Banner ── */}
            <div className="max-w-3xl mx-auto bg-[#fdfbf7] dark:bg-[#1a1816] border border-[#e6ccb2] dark:border-stone-800 rounded-2xl p-6 shadow-md relative overflow-hidden text-left transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${isPremium ? 'bg-[#f472b6]' : 'bg-gradient-to-r from-pink-400 via-amber-400 to-pink-500'}`} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isPremium ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300 border border-pink-300 dark:border-pink-800">
                        <Crown className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                        {subscription?.planName || (subscription?.billingInterval === 'year' ? 'Yearly Premium Plan' : 'Monthly Premium Plan')}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        (subscription?.trialDaysLeft ?? 7) > 0 
                          ? 'bg-[#f5ebe0] text-stone-900 dark:bg-stone-900 dark:text-pink-300 border border-[#e6ccb2] dark:border-stone-700' 
                          : 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-pink-500" />
                        {(subscription?.trialDaysLeft ?? 7) > 0 
                          ? `7-Day Free Trial (${subscription?.trialDaysLeft ?? 7} ${subscription?.trialDaysLeft === 1 ? 'day' : 'days'} remaining)` 
                          : 'Free Trial Expired'}
                      </span>
                    )}

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f5ebe0] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-[#e6ccb2] dark:border-stone-700">
                      Limit: {existingPortfolios.length} / {subscription?.portfolioLimit || 1} {subscription?.portfolioLimit === 1 ? 'portfolio' : 'portfolios'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {isPremium ? 'Portiqqo Premium Membership Active' : 'Portfolio Plan Status'}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    {isPremium ? (
                      <>Unlimited portfolio creation, custom domain mapping & zero branding active until <strong className="text-pink-600 dark:text-pink-400">{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Next Renewal'}</strong>.</>
                    ) : (
                      (subscription?.trialDaysLeft ?? 7) > 0 ? (
                        <>You are currently on your <strong>7-Day Free Trial</strong>. Upgrade to <strong>Monthly (₹81/mo)</strong> or <strong>Yearly (₹700/yr)</strong> to unlock custom domain mapping & unlimited publishing.</>
                      ) : (
                        <>Your free trial has ended. Upgrade via Razorpay to publish portfolios and unlock custom domains!</>
                      )
                    )}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => navigate('/pricing')}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isPremium
                        ? 'bg-[#f5ebe0] dark:bg-stone-800 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-[#e6ccb2] dark:border-stone-700'
                        : 'bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 shadow-md shadow-pink-500/20'
                    }`}
                  >
                    <Crown className="w-4 h-4 text-stone-950" />
                    <span>{isPremium ? 'Manage Plan' : 'Upgrade via Razorpay'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Existing Portfolios Section */}
          {!loadingPortfolios && existingPortfolios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900 dark:text-stone-50">Your Portfolio</h2>
                <span className="text-sm text-stone-500 dark:text-stone-400 font-semibold">
                  {existingPortfolios.length} {existingPortfolios.length === 1 ? 'portfolio' : 'portfolios'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {existingPortfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio._id}
                    whileHover={{ y: -4 }}
                    className="bg-[#fdfbf7] dark:bg-[#1a1816] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#e6ccb2] dark:border-stone-800"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">{portfolio.title}</h3>
                          <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                            {portfolio.profession?.replace(/-/g, ' ')}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5">
                            {portfolio.isPublished && (
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-300 dark:border-emerald-800">
                                Published
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenAnalyticsModal(portfolio)}
                              className="px-2.5 py-0.5 bg-[#f5ebe0] dark:bg-stone-800 text-stone-900 dark:text-pink-300 text-xs font-bold rounded-full flex items-center gap-1 border border-[#e6ccb2] dark:border-stone-700 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 transition-colors cursor-pointer"
                              title="View Visitor Analytics"
                            >
                              <Eye className="w-3 h-3 text-pink-500" />
                              <span>{portfolio.views || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* URLs Section */}
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 min-h-[28px] bg-[#f5ebe0]/60 dark:bg-stone-900/60 p-2 rounded-xl border border-[#e6ccb2]/60 dark:border-stone-800">
                          {getPortfolioUrl(portfolio) ? (
                            <>
                              <ExternalLink className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                              <a 
                                href={getPortfolioUrl(portfolio)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400 hover:underline truncate flex-1"
                              >
                                {getPortfolioUrl(portfolio)}
                              </a>
                              <button
                                onClick={() => handleCopyLink(portfolio)}
                                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#e6ccb2] dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
                                title="Copy link"
                              >
                                {copiedId === portfolio._id
                                  ? <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                                  : <Copy className="w-4 h-4" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-stone-400 dark:text-stone-500 italic">Save portfolio to generate your link</span>
                          )}
                        </div>

                        {/* Custom Domain Badge if configured */}
                        {portfolio.customDomain && (
                          <div className="flex items-center gap-2 text-xs bg-[#f5ebe0]/80 dark:bg-stone-900/80 px-3 py-1.5 rounded-xl border border-[#e6ccb2] dark:border-stone-800">
                            <Globe className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                            <a
                              href={`https://${portfolio.customDomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 hover:underline truncate flex-1"
                            >
                              {portfolio.customDomain}
                            </a>
                            {portfolio.customDomainVerified ? (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> Pending
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPortfolio(portfolio)}
                          className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 rounded-xl font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit Portfolio
                        </button>
                        <button
                          onClick={() => handleOpenAnalyticsModal(portfolio)}
                          className="py-2.5 px-3 bg-[#f5ebe0] dark:bg-stone-800 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl font-bold transition-all duration-300 flex items-center gap-1.5 text-xs border border-[#e6ccb2] dark:border-stone-700"
                          title="Visitor Analytics & Insights"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-pink-500" />
                          <span className="hidden sm:inline">Analytics</span>
                        </button>
                        <button
                          onClick={() => handleOpenDomainModal(portfolio)}
                          className="py-2.5 px-3 bg-[#f5ebe0] dark:bg-stone-800 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl font-bold transition-all duration-300 flex items-center gap-1.5 text-xs border border-[#e6ccb2] dark:border-stone-700"
                          title="Custom Domain Settings"
                        >
                          <Globe className="w-3.5 h-3.5 text-pink-500" />
                          <span className="hidden sm:inline">Domain</span>
                        </button>
                        {getPortfolioUrl(portfolio) && (
                          <button
                            onClick={() => handleViewPortfolio(portfolio)}
                            className="py-2.5 px-3 bg-[#f5ebe0] dark:bg-stone-800 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl font-bold transition-all duration-300 border border-[#e6ccb2] dark:border-stone-700"
                            title="View Portfolio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(portfolio)}
                          className="py-2.5 px-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all duration-300 border border-red-200 dark:border-red-900/40"
                          title="Delete Portfolio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Templates Grid — Only shown when user has NO existing portfolio */}
          {existingPortfolios.length === 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900 dark:text-stone-50 mb-2">
                  Choose a Template to Get Started
                </h2>
                <p className="text-stone-600 dark:text-stone-300 text-sm">
                  Select a template below to start building your portfolio
                </p>
              </div>
              <TemplateMosaicGrid isDashboard={true} onSelectTemplate={(t) => handleTemplateSelect(t.id)} />
            </div>
          )}
        </div>
      </div>

      {/* Switch Template Confirmation Modal */}
      {pendingTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#fdfbf7] dark:bg-[#1a1816] border border-[#e6ccb2] dark:border-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative transition-colors duration-300"
          >
            <button
              onClick={() => setPendingTemplate(null)}
              className="absolute top-4 right-4 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#f5ebe0] dark:bg-stone-900 border border-[#e6ccb2] dark:border-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-pink-500 fill-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Want Another Portfolio?</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Free accounts are limited to <strong>1 portfolio</strong>. Upgrade to Premium for unlimited portfolios, or delete your existing one to switch.
              </p>
            </div>

            {existingPortfolios[0] && (
              <div className="bg-[#f5ebe0]/60 dark:bg-stone-900/60 border border-[#e6ccb2] dark:border-stone-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-stone-800 dark:text-stone-200 font-medium text-center">
                  Current portfolio: <span className="font-bold">{existingPortfolios[0].title}</span>
                </p>
                {getPortfolioUrl(existingPortfolios[0]) && (
                  <p className="text-xs font-mono text-pink-600 dark:text-pink-400 text-center mt-1">
                    {getPortfolioUrl(existingPortfolios[0])}
                  </p>
                )}
              </div>
            )}

            {/* Upgrade option — only for free users */}
            {!isPremium && (
              <button
                onClick={() => { setPendingTemplate(null); navigate('/pricing') }}
                className="w-full mb-3 py-3 px-4 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-xl font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                <Crown className="w-5 h-5 text-stone-950" />
                Upgrade to Premium — Unlock Unlimited Portfolios
              </button>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e6ccb2] dark:border-stone-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#fdfbf7] dark:bg-[#1a1816] text-stone-400 dark:text-stone-500 text-xs">{isPremium ? 'Delete existing to create a new one' : 'or'}</span>
              </div>
            </div>

            {/* Delete & switch option */}
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl p-3 mb-3">
              <p className="text-xs text-red-700 dark:text-red-300 font-semibold text-center">
                ⚠️ Deleting is permanent and cannot be undone
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setPendingTemplate(null)}
                disabled={switchingPortfolio}
                className="flex-1 py-3 px-4 bg-[#f5ebe0] dark:bg-stone-800 hover:bg-[#e6ccb2] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 border border-[#e6ccb2] dark:border-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSwitch}
                disabled={switchingPortfolio}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {switchingPortfolio ? 'Deleting...' : 'Delete & Switch'}
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative transition-colors duration-300"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Delete Portfolio?</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Are you sure you want to delete <strong>{portfolioToDelete.title}</strong>?
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This will permanently delete your portfolio at{' '}
                <span className="font-medium">{getPortfolioUrl(portfolioToDelete) || portfolioToDelete.subdomain}</span>
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-400 text-center">
                ⚠️ This action cannot be undone
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Portfolio
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Domain Modal */}
      {showDomainModal && domainPortfolio && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative transition-colors duration-300 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => { setShowDomainModal(false); setDomainPortfolio(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Custom Domain</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {domainPortfolio.title} ({getPortfolioUrl(domainPortfolio) || domainPortfolio.subdomain})
                </p>
              </div>
            </div>

            {!isPremium ? (
              /* Non-Premium Locked State */
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <h4 className="text-lg font-bold">Premium Feature</h4>
                  </div>
                  <p className="text-sm text-purple-100 mb-4 leading-relaxed">
                    Connect your own branded domain (e.g. <span className="font-mono text-yellow-300 font-bold">yourname.com</span> or <span className="font-mono text-yellow-300 font-bold">portfolio.yourname.design</span>) to stand out to clients with a 100% white-labeled experience.
                  </p>
                  
                  <ul className="space-y-2.5 text-xs sm:text-sm text-purple-200 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Use any custom domain or subdomain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Automatic SSL security certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Unlimited portfolios & advanced analytics</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      setShowDomainModal(false)
                      navigate('/pricing')
                    }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-900 font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5 text-slate-900" />
                    Upgrade to Premium (₹81/month)
                  </button>
                </div>
              </div>
            ) : (
              /* Premium Active State */
              <div className="space-y-6">
                {/* Current Status */}
                {domainPortfolio.customDomain ? (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    domainPortfolio.customDomainVerified
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    {domainPortfolio.customDomainVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                          {domainPortfolio.customDomain}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          domainPortfolio.customDomainVerified
                            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                            : 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                        }`}>
                          {domainPortfolio.customDomainVerified ? 'Verified & Live' : 'DNS Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {domainPortfolio.customDomainVerified
                          ? 'Your custom domain is connected and serving your live portfolio.'
                          : 'DNS records need to be pointed before this domain can become active.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Enter your custom domain name below to connect it to this portfolio.
                  </div>
                )}

                {/* Input & Save */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Custom Domain Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={(e) => setCustomDomainInput(e.target.value)}
                      placeholder="e.g. yourname.com or portfolio.yourname.com"
                      className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono"
                    />
                    <button
                      onClick={handleSaveDomain}
                      disabled={savingDomain || !customDomainInput.trim()}
                      className="py-2.5 px-5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 flex-shrink-0"
                    >
                      {savingDomain ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Domain'
                      )}
                    </button>
                  </div>
                </div>

                {/* DNS Setup Instructions */}
                <div className="bg-slate-50 dark:bg-slate-700/60 rounded-xl p-4 border border-slate-200 dark:border-slate-600 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    DNS Configuration Instructions
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Log in to your domain provider (GoDaddy, Cloudflare, Namecheap, etc.) and add ONE of the following DNS records:
                  </p>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">
                          <th className="py-1.5 px-2 font-medium">Type</th>
                          <th className="py-1.5 px-2 font-medium">Host / Name</th>
                          <th className="py-1.5 px-2 font-medium">Value / Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-600 font-mono">
                        <tr>
                          <td className="py-2 px-2 font-bold text-purple-600 dark:text-purple-400">CNAME</td>
                          <td className="py-2 px-2">@ or subdomain</td>
                          <td className="py-2 px-2 text-slate-800 dark:text-slate-200 font-semibold">cname.portiqqo.me</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-bold text-blue-600 dark:text-blue-400">A</td>
                          <td className="py-2 px-2">@</td>
                          <td className="py-2 px-2 text-slate-800 dark:text-slate-200 font-semibold">143.198.128.45</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Note: DNS records may take up to 24 hours to propagate across global DNS servers.
                  </p>
                </div>

                {/* Verification result messages */}
                {verificationResult && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    verificationResult.success
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                  }`}>
                    {verificationResult.message}
                  </div>
                )}

                {/* Actions: Verify & Remove */}
                {domainPortfolio.customDomain && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleVerifyDomain}
                      disabled={verifyingDomain}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      {verifyingDomain ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking DNS Records...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Check & Verify DNS
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleRemoveDomain}
                      className="py-3 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-300 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Visitor Analytics Modal */}
      <PortfolioAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        portfolio={analyticsPortfolio}
      />
    </>
  )
}

export default DashboardPage