import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { savePortfolioToBackend, publishPortfolioToBackend } from '../../utils/portfolioHelper'
import { portfolioAPI } from '../../services/api'
import toast from 'react-hot-toast'
import PublishSuccessModal from '../modals/PublishSuccessModal'
import {
  ArrowLeft, Save, Eye, EyeOff, Upload, X, Plus,
  TrendingUp, Target, Users, BarChart3, Award, Mail, Phone,
  Globe, MapPin, ChevronDown, ChevronUp
} from 'lucide-react'

function DigitalMarketerTemplateEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const [uploadTarget, setUploadTarget] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedPortfolio, setPublishedPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [portfolioId, setPortfolioId] = useState(null)
  const [customSubdomain, setCustomSubdomain] = useState('')
  const [expandedCampaign, setExpandedCampaign] = useState(null)
  const [expandedService, setExpandedService] = useState(null)

  useEffect(() => {
    const existing = location.state?.existingPortfolio
    const idParam = location.state?.portfolioId
    if (existing) loadPortfolioData(existing)
    else if (idParam) fetchPortfolioById(idParam)
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    if (portfolio.templateData && Object.keys(portfolio.templateData).length > 0) {
      setPortfolioData(portfolio.templateData)
    }
    if (portfolio.subdomain) setCustomSubdomain(portfolio.subdomain.replace('.portiqqo.me', ''))
    setPortfolioId(portfolio._id)
    localStorage.setItem('savedPortfolioId', portfolio._id)
    if (portfolio.subdomain) localStorage.setItem('savedPortfolioSubdomain', portfolio.subdomain)
  }

  const fetchPortfolioById = async (id) => {
    try {
      setLoadingPortfolio(true)
      const response = await portfolioAPI.getById(id)
      if (response.data.success) loadPortfolioData(response.data.portfolio)
    } catch (error) {
      toast.error('Failed to load portfolio data')
    } finally {
      setLoadingPortfolio(false)
    }
  }

  const [portfolioData, setPortfolioData] = useState({
    profile: {
      name: 'Sofia Rodriguez',
      title: 'Digital Marketing Strategist',
      bio: 'Results-driven digital marketing strategist with 8+ years of experience driving growth for brands. Specialized in data-driven campaigns that deliver measurable ROI.',
      specialties: ['PPC Advertising', 'Social Media', 'SEO', 'Content Marketing'],
      location: 'Miami, FL',
      email: 'sofia@marketing.com',
      phone: '+1 (555) 567-8901',
      website: 'www.sofiamarketing.com',
      linkedin: 'https://linkedin.com/in/sofia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face',
    },
    metrics: {
      budgetManaged: '$2.5M+',
      avgROI: '340%',
      campaignsLaunched: '150+',
      clientsServed: '45+',
    },
    campaigns: [
      {
        id: 1,
        title: 'E-commerce Growth Campaign',
        client: 'FashionForward Inc.',
        category: 'E-commerce',
        duration: '6 months',
        budget: '$125,000',
        roi: '450%',
        channels: ['Google Ads', 'Facebook Ads', 'Email Marketing', 'SEO'],
        description: 'Complete digital transformation driving record-breaking revenue growth through integrated multi-channel approach.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        testimonial: 'Sofia\'s strategy increased our online revenue by 450%.',
        testimonialAuthor: 'John Smith, CEO FashionForward',
        featured: true,
      },
      {
        id: 2,
        title: 'SaaS Lead Generation',
        client: 'TechSolutions Pro',
        category: 'B2B SaaS',
        duration: '12 months',
        budget: '$200,000',
        roi: '380%',
        channels: ['LinkedIn Ads', 'Content Marketing', 'Marketing Automation'],
        description: 'Sophisticated B2B lead generation strategy targeting enterprise clients.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        testimonial: 'Our lead quality improved dramatically.',
        testimonialAuthor: 'Lisa Chen, CMO TechSolutions',
        featured: true,
      },
    ],
    services: [
      {
        id: 1,
        name: 'PPC Management',
        price: 'Starting at $2,500/mo',
        description: 'Google Ads, Facebook Ads, and multi-platform campaign management with ROI optimization',
        deliverables: ['Campaign Setup', 'Ongoing Optimization', 'Monthly Reports', 'A/B Testing'],
      },
      {
        id: 2,
        name: 'SEO Strategy',
        price: 'Starting at $1,800/mo',
        description: 'Complete SEO audit, strategy development, and implementation for organic growth',
        deliverables: ['Technical Audit', 'Content Strategy', 'Link Building', 'Performance Tracking'],
      },
      {
        id: 3,
        name: 'Social Media Marketing',
        price: 'Starting at $1,200/mo',
        description: 'Social media strategy, content creation, and community management',
        deliverables: ['Content Calendar', 'Community Management', 'Influencer Outreach', 'Analytics'],
      },
    ],
    tools: {
      analytics: ['Google Analytics', 'Google Tag Manager', 'Hotjar', 'Mixpanel'],
      advertising: ['Google Ads', 'Facebook Ads Manager', 'LinkedIn Campaign Manager'],
      automation: ['HubSpot', 'Marketo', 'Mailchimp', 'Klaviyo'],
      seo: ['SEMrush', 'Ahrefs', 'Screaming Frog', 'Google Search Console'],
    },
    certifications: [
      'Google Ads Certified',
      'Facebook Blueprint Certified',
      'HubSpot Inbound Certified',
      'Google Analytics IQ',
    ],
    footer: {
      tagline: 'Driving growth through data-driven marketing.',
      copyright: '',
    },
    hiddenSections: [],
  })

  // ─── Section visibility ────────────────────────────────────────────────────
  const toggleSection = (name) =>
    setPortfolioData(prev => ({
      ...prev,
      hiddenSections: prev.hiddenSections.includes(name)
        ? prev.hiddenSections.filter(s => s !== name)
        : [...prev.hiddenSections, name],
    }))
  const isSectionHidden = (name) => portfolioData.hiddenSections.includes(name)

  // ─── Profile ────────────────────────────────────────────────────────────────
  const updateProfile = (field, value) =>
    setPortfolioData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }))

  const addSpecialty = () =>
    setPortfolioData(prev => ({ ...prev, profile: { ...prev.profile, specialties: [...prev.profile.specialties, 'New Specialty'] } }))

  const updateSpecialty = (i, value) =>
    setPortfolioData(prev => ({ ...prev, profile: { ...prev.profile, specialties: prev.profile.specialties.map((s, idx) => idx === i ? value : s) } }))

  const removeSpecialty = (i) =>
    setPortfolioData(prev => ({ ...prev, profile: { ...prev.profile, specialties: prev.profile.specialties.filter((_, idx) => idx !== i) } }))

  // ─── Metrics ────────────────────────────────────────────────────────────────
  const updateMetric = (field, value) =>
    setPortfolioData(prev => ({ ...prev, metrics: { ...prev.metrics, [field]: value } }))

  // ─── Campaigns ──────────────────────────────────────────────────────────────
  const addCampaign = () => {
    const id = Date.now()
    setPortfolioData(prev => ({
      ...prev,
      campaigns: [...prev.campaigns, { id, title: 'New Campaign', client: 'Client Name', category: 'Digital', duration: '3 months', budget: '$10,000', roi: '200%', channels: [], description: 'Campaign description...', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', testimonial: '', testimonialAuthor: '', featured: false }],
    }))
    setExpandedCampaign(id)
  }

  const updateCampaign = (id, field, value) =>
    setPortfolioData(prev => ({ ...prev, campaigns: prev.campaigns.map(c => c.id === id ? { ...c, [field]: value } : c) }))

  const removeCampaign = (id) =>
    setPortfolioData(prev => ({ ...prev, campaigns: prev.campaigns.filter(c => c.id !== id) }))

  const addChannel = (campaignId) =>
    updateCampaign(campaignId, 'channels', [...(portfolioData.campaigns.find(c => c.id === campaignId)?.channels || []), 'New Channel'])

  const updateChannel = (campaignId, i, value) => {
    const channels = [...(portfolioData.campaigns.find(c => c.id === campaignId)?.channels || [])]
    channels[i] = value
    updateCampaign(campaignId, 'channels', channels)
  }

  const removeChannel = (campaignId, i) => {
    const channels = (portfolioData.campaigns.find(c => c.id === campaignId)?.channels || []).filter((_, idx) => idx !== i)
    updateCampaign(campaignId, 'channels', channels)
  }

  // ─── Services ───────────────────────────────────────────────────────────────
  const addService = () => {
    const id = Date.now()
    setPortfolioData(prev => ({
      ...prev,
      services: [...prev.services, { id, name: 'New Service', price: 'Starting at $X/mo', description: 'Service description...', deliverables: ['Deliverable 1'] }],
    }))
    setExpandedService(id)
  }

  const updateService = (id, field, value) =>
    setPortfolioData(prev => ({ ...prev, services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s) }))

  const removeService = (id) =>
    setPortfolioData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }))

  const addDeliverable = (serviceId) => {
    const deliverables = [...(portfolioData.services.find(s => s.id === serviceId)?.deliverables || []), 'New Deliverable']
    updateService(serviceId, 'deliverables', deliverables)
  }

  const updateDeliverable = (serviceId, i, value) => {
    const deliverables = [...(portfolioData.services.find(s => s.id === serviceId)?.deliverables || [])]
    deliverables[i] = value
    updateService(serviceId, 'deliverables', deliverables)
  }

  const removeDeliverable = (serviceId, i) => {
    const deliverables = (portfolioData.services.find(s => s.id === serviceId)?.deliverables || []).filter((_, idx) => idx !== i)
    updateService(serviceId, 'deliverables', deliverables)
  }

  // ─── Tools ──────────────────────────────────────────────────────────────────
  const addTool = (category) =>
    setPortfolioData(prev => ({ ...prev, tools: { ...prev.tools, [category]: [...prev.tools[category], 'New Tool'] } }))

  const updateTool = (category, i, value) =>
    setPortfolioData(prev => ({ ...prev, tools: { ...prev.tools, [category]: prev.tools[category].map((t, idx) => idx === i ? value : t) } }))

  const removeTool = (category, i) =>
    setPortfolioData(prev => ({ ...prev, tools: { ...prev.tools, [category]: prev.tools[category].filter((_, idx) => idx !== i) } }))

  // ─── Certifications ─────────────────────────────────────────────────────────
  const addCert = () =>
    setPortfolioData(prev => ({ ...prev, certifications: [...prev.certifications, 'New Certification'] }))

  const updateCert = (i, value) =>
    setPortfolioData(prev => ({ ...prev, certifications: prev.certifications.map((c, idx) => idx === i ? value : c) }))

  const removeCert = (i) =>
    setPortfolioData(prev => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== i) }))

  // ─── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = (target) => {
    setUploadTarget(target)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (uploadTarget === 'avatar') updateProfile('avatar', ev.target.result)
      else if (uploadTarget?.startsWith('campaign-')) {
        const id = parseInt(uploadTarget.split('-')[1])
        updateCampaign(id, 'image', ev.target.result)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ─── Save / Publish ──────────────────────────────────────────────────────────
  const savePortfolio = async () => {
    const saved = await savePortfolioToBackend(portfolioData, 'digital-marketer', customSubdomain, null, portfolioId)
    if (saved?._id || saved?.id) setPortfolioId(saved._id || saved.id)
  }

  const publishPortfolio = async () => {
    try {
      const saved = await savePortfolioToBackend(portfolioData, 'digital-marketer', customSubdomain, null, portfolioId)
      if (saved?._id || saved?.id) setPortfolioId(saved._id || saved.id)
      const result = await publishPortfolioToBackend('digital-marketer')
      if (result) { setPublishedPortfolio(result); setShowPublishModal(true) }
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

  const SectionToggle = ({ name, label }) => (
    <button
      onClick={() => toggleSection(name)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden(name) ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
    >
      {isSectionHidden(name) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      {isSectionHidden(name) ? 'Hidden' : 'Visible'}
    </button>
  )

  if (loadingPortfolio) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <div className="flex space-x-3">
              <button onClick={() => setIsPreview(!isPreview)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button onClick={savePortfolio} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button onClick={publishPortfolio} className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <span>Publish Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Marketer Portfolio Editor</h1>
          <p className="text-gray-600">Showcase your campaigns, ROI results, and marketing expertise.</p>
        </div>

        {/* Portfolio URL */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio URL</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">https://</span>
            <input
              type="text"
              value={customSubdomain}
              onChange={(e) => setCustomSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="your-name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-gray-500 text-sm">.portiqqo.me</span>
          </div>
        </div>

        <div className="space-y-10">

          {/* ── Profile ─────────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-orange-600" />
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="relative group w-32 h-32">
                  <img src={portfolioData.profile.avatar} alt="Avatar" className="w-32 h-32 object-cover rounded-full border-2 border-gray-200" />
                  <button onClick={() => handleImageUpload('avatar')} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[['name', 'Full Name'], ['title', 'Professional Title'], ['location', 'Location'], ['email', 'Email'], ['phone', 'Phone'], ['website', 'Website'], ['linkedin', 'LinkedIn URL']].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input type="text" value={portfolioData.profile[field]} onChange={(e) => updateProfile(field, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Summary</label>
              <textarea rows={4} value={portfolioData.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>

            {/* Specialties */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Specialties / Keywords</label>
                <button onClick={addSpecialty} className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {portfolioData.profile.specialties.map((spec, i) => (
                  <div key={i} className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                    <input type="text" value={spec} onChange={(e) => updateSpecialty(i, e.target.value)} className="bg-transparent text-sm text-orange-800 outline-none w-28" />
                    <button onClick={() => removeSpecialty(i)} className="text-orange-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Key Metrics ─────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-orange-600" />
                Key Metrics
              </h2>
              <SectionToggle name="metrics" />
            </div>
            {isSectionHidden('metrics') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}
            <div className={isSectionHidden('metrics') ? 'hidden' : ''}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[['budgetManaged', 'Total Budget Managed'], ['avgROI', 'Average ROI'], ['campaignsLaunched', 'Campaigns Launched'], ['clientsServed', 'Clients Served']].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input type="text" value={portfolioData.metrics[field]} onChange={(e) => updateMetric(field, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-bold" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Campaigns ───────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
                Campaign Case Studies
              </h2>
              <div className="flex gap-3">
                <SectionToggle name="campaigns" />
                <button onClick={addCampaign} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Campaign
                </button>
              </div>
            </div>
            {isSectionHidden('campaigns') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}

            <div className={`space-y-6 ${isSectionHidden('campaigns') ? 'hidden' : ''}`}>
              {portfolioData.campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Campaign header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer" onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{campaign.title}</span>
                      <span className="text-sm text-gray-500">• {campaign.client}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">{campaign.roi} ROI</span>
                      {campaign.featured && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Featured</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); removeCampaign(campaign.id) }} className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                      {expandedCampaign === campaign.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {expandedCampaign === campaign.id && (
                    <div className="p-5 space-y-5">
                      {/* Campaign image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Image</label>
                        <div className="relative group w-full h-40">
                          <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-lg" />
                          <button onClick={() => handleImageUpload(`campaign-${campaign.id}`)} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Upload className="w-8 h-8 text-white" />
                          </button>
                        </div>
                        <input type="url" value={campaign.image} onChange={(e) => updateCampaign(campaign.id, 'image', e.target.value)} placeholder="Or paste image URL" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[['title', 'Campaign Title'], ['client', 'Client Name'], ['category', 'Category'], ['duration', 'Duration'], ['budget', 'Budget'], ['roi', 'ROI Achieved']].map(([field, label]) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input type="text" value={campaign[field]} onChange={(e) => updateCampaign(campaign.id, field, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={3} value={campaign.description} onChange={(e) => updateCampaign(campaign.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      {/* Channels */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Channels Used</label>
                          <button onClick={() => addChannel(campaign.id)} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors">+ Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(campaign.channels || []).map((ch, i) => (
                            <div key={i} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                              <input type="text" value={ch} onChange={(e) => updateChannel(campaign.id, i, e.target.value)} className="bg-transparent text-sm text-blue-800 outline-none w-24" />
                              <button onClick={() => removeChannel(campaign.id, i)} className="text-blue-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Client Testimonial</label>
                          <textarea rows={2} value={campaign.testimonial} onChange={(e) => updateCampaign(campaign.id, 'testimonial', e.target.value)} placeholder='e.g. "Sofia doubled our revenue..."' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Author</label>
                          <input type="text" value={campaign.testimonialAuthor} onChange={(e) => updateCampaign(campaign.id, 'testimonialAuthor', e.target.value)} placeholder="e.g. John Smith, CEO Acme" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={campaign.featured} onChange={(e) => updateCampaign(campaign.id, 'featured', e.target.checked)} className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Featured campaign (shown prominently at top)</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Services ────────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Target className="w-6 h-6 mr-2 text-orange-600" />
                Services Offered
              </h2>
              <div className="flex gap-3">
                <SectionToggle name="services" />
                <button onClick={addService} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
            </div>
            {isSectionHidden('services') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}

            <div className={`space-y-4 ${isSectionHidden('services') ? 'hidden' : ''}`}>
              {portfolioData.services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer" onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}>
                    <span className="font-semibold text-gray-900">{service.name} <span className="text-orange-600 font-normal text-sm ml-2">{service.price}</span></span>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); removeService(service.id) }} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                      {expandedService === service.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  {expandedService === service.id && (
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                          <input type="text" value={service.name} onChange={(e) => updateService(service.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price / Rate</label>
                          <input type="text" value={service.price} onChange={(e) => updateService(service.id, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={2} value={service.description} onChange={(e) => updateService(service.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Deliverables</label>
                          <button onClick={() => addDeliverable(service.id)} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200">+ Add</button>
                        </div>
                        <div className="space-y-2">
                          {(service.deliverables || []).map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="text" value={d} onChange={(e) => updateDeliverable(service.id, i, e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                              <button onClick={() => removeDeliverable(service.id, i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Tools ───────────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-orange-600" />
                Marketing Tools
              </h2>
              <SectionToggle name="tools" />
            </div>
            {isSectionHidden('tools') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isSectionHidden('tools') ? 'hidden' : ''}`}>
              {[['analytics', 'Analytics'], ['advertising', 'Advertising'], ['automation', 'Automation / CRM'], ['seo', 'SEO']].map(([cat, label]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">{label}</h3>
                    <button onClick={() => addTool(cat)} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {portfolioData.tools[cat].map((tool, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={tool} onChange={(e) => updateTool(cat, i, e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        <button onClick={() => removeTool(cat, i)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Certifications ──────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-2 text-orange-600" />
                Certifications
              </h2>
              <div className="flex gap-3">
                <SectionToggle name="certifications" />
                <button onClick={addCert} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
            {isSectionHidden('certifications') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}

            <div className={`space-y-3 ${isSectionHidden('certifications') ? 'hidden' : ''}`}>
              {portfolioData.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <input type="text" value={cert} onChange={(e) => updateCert(i, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  <button onClick={() => removeCert(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <motion.div className="bg-white rounded-xl shadow-lg p-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Footer</h2>
              <SectionToggle name="footer" />
            </div>
            {isSectionHidden('footer') && <p className="text-amber-600 text-sm mb-4">⚠ This section is hidden and won't appear on your published portfolio.</p>}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isSectionHidden('footer') ? 'hidden' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input type="text" value={portfolioData.footer.tagline} onChange={(e) => setPortfolioData(prev => ({ ...prev, footer: { ...prev.footer, tagline: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text (leave blank to auto-generate)</label>
                <input type="text" value={portfolioData.footer.copyright} onChange={(e) => setPortfolioData(prev => ({ ...prev, footer: { ...prev.footer, copyright: e.target.value } }))} placeholder={`© ${new Date().getFullYear()} ${portfolioData.profile.name}`} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom save bar */}
        <div className="mt-10 flex justify-end gap-4 pb-10">
          <button onClick={savePortfolio} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Save className="w-5 h-5" /> Save Draft
          </button>
          <button onClick={publishPortfolio} className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            Publish Portfolio
          </button>
        </div>
      </div>

      {showPublishModal && publishedPortfolio && (
        <PublishSuccessModal
          portfolio={publishedPortfolio}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  )
}

export default DigitalMarketerTemplateEditor
