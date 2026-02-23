import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { savePortfolioToBackend, publishPortfolioToBackend } from '../../utils/portfolioHelper'
import { portfolioAPI } from '../../services/api'
import toast from 'react-hot-toast'
import PublishSuccessModal from '../modals/PublishSuccessModal'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Edit3, 
  X, 
  Plus, 
  Palette, 
  Figma,
  Layers,
  Users,
  Target,
  MapPin,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon
} from 'lucide-react'

function UIUXDesignerTemplateEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const [isPreview, setIsPreview] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedPortfolio, setPublishedPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [portfolioId, setPortfolioId] = useState(null)
  const [customSubdomain, setCustomSubdomain] = useState('')

  // Load existing portfolio data if editing
  useEffect(() => {
    const existingPortfolio = location.state?.existingPortfolio
    const portfolioIdParam = location.state?.portfolioId
    
    if (existingPortfolio) {
      console.log('📝 Loading existing UIUX portfolio for edit');
      loadPortfolioData(existingPortfolio)
    } else if (portfolioIdParam) {
      console.log('📝 Fetching UIUX portfolio by ID:', portfolioIdParam);
      fetchPortfolioById(portfolioIdParam)
    }
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    if (portfolio.templateData && Object.keys(portfolio.templateData).length > 0) {
      console.log('✅ UIUX portfolio data loaded from templateData');
      setPortfolioData(portfolio.templateData)
    } else {
      console.warn('⚠️ No templateData found for UIUX, reconstructing from portfolio fields');
      // Reconstruct portfolioData from portfolio fields
      const allSkills = Array.isArray(portfolio.skills) 
        ? portfolio.skills.map(skill => typeof skill === 'string' ? skill : skill?.name || skill)
        : [];
      
      const reconstructedCaseStudies = Array.isArray(portfolio.projects)
        ? portfolio.projects.map(project => ({
            ...project,
            tools: Array.isArray(project.technologies) ? project.technologies : (Array.isArray(project.tools) ? project.tools : []),
            category: project.category || 'mobile',
            image: project.images?.[0]?.url || project.image || '',
            behanceUrl: project.links?.behance || project.behanceUrl || ''
          }))
        : [];
      
      const reconstructedData = {
        profile: {
          name: `${portfolio.personalInfo?.firstName || ''} ${portfolio.personalInfo?.lastName || ''}`.trim() || 'Sarah Johnson',
          title: portfolio.personalInfo?.tagline || 'UI/UX Designer',
          specialization: 'ui-ux',
          description: portfolio.personalInfo?.bio || '',
          profileImage: portfolio.personalInfo?.profileImage?.url || '',
          bannerImage: '',
          location: portfolio.personalInfo?.location || '',
          email: portfolio.personalInfo?.email || '',
          phone: portfolio.personalInfo?.phone || '',
          website: portfolio.personalInfo?.website || '',
          dribbble: portfolio.socialLinks?.dribbble || '',
          behance: portfolio.socialLinks?.behance || ''
        },
        designTools: {
          design: allSkills,
          prototype: [],
          research: [],
          other: []
        },
        caseStudies: reconstructedCaseStudies,
        experience: [],
        education: [],
        awards: [],
        testimonials: []
      };
      setPortfolioData(reconstructedData);
    }
    if (portfolio.subdomain) {
      const subdomain = portfolio.subdomain.replace('.portiqqo.me', '');
      setCustomSubdomain(subdomain)
    }
    setPortfolioId(portfolio._id)
    // Store in localStorage for publish function
    localStorage.setItem('savedPortfolioId', portfolio._id)
    if (portfolio.subdomain) {
      localStorage.setItem('savedPortfolioSubdomain', portfolio.subdomain)
    }
  }

  const fetchPortfolioById = async (id) => {
    try {
      setLoadingPortfolio(true)
      const response = await portfolioAPI.getById(id)
      if (response.data.success) {
        loadPortfolioData(response.data.portfolio)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      toast.error('Failed to load portfolio data')
    } finally {
      setLoadingPortfolio(false)
    }
  }

  // Editable portfolio data
  const [portfolioData, setPortfolioData] = useState({
    profile: {
      name: "Sarah Johnson",
      title: "UI/UX Designer",
      specialization: "ui-ux", // ui, ux, ui-ux, product-design
      description: "Passionate UI/UX designer with 4+ years of experience creating user-centered digital experiences. Specialized in mobile apps, web platforms, and design systems.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
      location: "New York, NY",
      email: "sarah@designer.com",
      phone: "+1 (555) 123-4567",
      website: "www.sarahjohnson.design",
      dribbble: "https://dribbble.com/sarahjohnson",
      behance: "https://behance.net/sarahjohnson"
    },
    designTools: {
      design: ["Figma", "Adobe XD", "Sketch", "Adobe Creative Suite"],
      prototype: ["Figma", "InVision", "Principle", "Framer"],
      research: ["Miro", "FigJam", "UsabilityHub", "Maze"],
      other: ["Webflow", "Notion", "Slack", "Jira"]
    },
    caseStudies: [
      {
        id: 1,
        title: "FinTech Mobile App",
        category: "mobile",
        image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&h=400&fit=crop",
        description: "Complete redesign of a mobile banking app focusing on user experience and accessibility.",
        challenge: "Users struggled with complex navigation and unclear financial terminology.",
        solution: "Implemented intuitive navigation, simplified language, and improved visual hierarchy.",
        results: "40% increase in user engagement and 25% reduction in support tickets.",
        tools: ["Figma", "Principle", "UsabilityHub"],
        duration: "3 months",
        role: "Lead UI/UX Designer",
        year: "2024",
        behanceUrl: "https://behance.net/project/fintech-app",
        prototypeUrl: "https://figma.com/proto/fintech"
      },
      {
        id: 2,
        title: "E-learning Platform",
        category: "web",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
        description: "Design system and interface for an online learning platform targeting professionals.",
        challenge: "Creating an engaging learning experience for time-constrained professionals.",
        solution: "Developed a modular design system with bite-sized learning components.",
        results: "65% completion rate increase and 4.8/5 user satisfaction rating.",
        tools: ["Figma", "Adobe XD", "Miro"],
        duration: "4 months", 
        role: "Senior UI/UX Designer",
        year: "2024",
        behanceUrl: "https://behance.net/project/elearning",
        prototypeUrl: "https://figma.com/proto/elearning"
      }
    ],
    skills: [
      { name: "User Research", level: 95, category: "ux" },
      { name: "Wireframing", level: 92, category: "ux" },
      { name: "Visual Design", level: 90, category: "ui" },
      { name: "Prototyping", level: 88, category: "both" },
      { name: "Usability Testing", level: 85, category: "ux" },
      { name: "Design Systems", level: 87, category: "ui" }
    ],
    services: [
      {
        icon: "Palette",
        title: "UI Design",
        description: "Beautiful and functional user interfaces that align with brand identity and user needs."
      },
      {
        icon: "Users",
        title: "UX Research & Strategy",
        description: "User research, personas, journey mapping, and strategic design recommendations."
      },
      {
        icon: "Layers",
        title: "Design Systems",
        description: "Comprehensive design systems to ensure consistency across all digital touchpoints."
      },
      {
        icon: "Target",
        title: "Usability Testing",
        description: "User testing and optimization to improve conversion rates and user satisfaction."
      }
    ],
    footer: {
      companyName: "Sarah Johnson Design",
      tagline: "Designing meaningful digital experiences",
      quickStats: {
        projects: "30+",
        experience: "4+ years",
        clients: "50+",
        awards: "8+"
      },
      socialLinks: [
        { platform: "Dribbble", url: "https://dribbble.com/sarahjohnson", icon: "Palette" },
        { platform: "Behance", url: "https://behance.net/sarahjohnson", icon: "Layers" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/sarahjohnson", icon: "Globe" }
      ],
      copyright: "© 2024 Sarah Johnson. All rights reserved."
    }
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'web', name: 'Web Design' },
    { id: 'branding', name: 'Branding' },
    { id: 'research', name: 'Research' },
    { id: 'prototype', name: 'Prototypes' }
  ]

  const specializationOptions = [
    { value: 'ui', label: 'UI Designer', icon: <Palette className="w-5 h-5" /> },
    { value: 'ux', label: 'UX Designer', icon: <Users className="w-5 h-5" /> },
    { value: 'ui-ux', label: 'UI/UX Designer', icon: <Layers className="w-5 h-5" /> },
    { value: 'product-design', label: 'Product Designer', icon: <Target className="w-5 h-5" /> }
  ]

  const toolCategories = [
    { key: 'design', name: 'Design Tools', icon: <Palette className="w-5 h-5" /> },
    { key: 'prototype', name: 'Prototyping', icon: <Layers className="w-5 h-5" /> },
    { key: 'research', name: 'Research & Testing', icon: <Users className="w-5 h-5" /> },
    { key: 'other', name: 'Other Tools', icon: <Target className="w-5 h-5" /> }
  ]

  const filteredCaseStudies = portfolioData && portfolioData.caseStudies
    ? (selectedCategory === 'all' 
        ? portfolioData.caseStudies 
        : portfolioData.caseStudies.filter(study => study.category === selectedCategory))
    : []

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const handleImageUpload = (field, section = null) => {
    setUploadType(field)
    setEditingSection(section)
    setShowUploadModal(true)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        
        if (editingSection === 'profile') {
          setPortfolioData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              [uploadType]: imageUrl
            }
          }))
        } else if (editingSection === 'caseStudies') {
          // Handle case study image uploads
          console.log('Case study image upload:', uploadType, imageUrl)
        }
      }
      reader.readAsDataURL(file)
    }
    setShowUploadModal(false)
    setUploadType('')
    setEditingSection(null)
  }

  const updateProfileField = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }))
  }

  const updateDesignTools = (category, tools) => {
    setPortfolioData(prev => ({
      ...prev,
      designTools: {
        ...prev.designTools,
        [category]: tools
      }
    }))
  }

  const addCaseStudy = () => {
    const newCaseStudy = {
      id: Date.now(),
      title: "New Project",
      category: "mobile",
      image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&h=400&fit=crop",
      description: "Project description...",
      challenge: "What was the main challenge?",
      solution: "How did you solve it?",
      results: "What were the results?",
      tools: [],
      duration: "2 months",
      role: "UI/UX Designer",
      year: "2024",
      behanceUrl: "",
      prototypeUrl: ""
    }
    setPortfolioData(prev => ({
      ...prev,
      caseStudies: [...prev.caseStudies, newCaseStudy]
    }))
  }

  const updateCaseStudy = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      caseStudies: prev.caseStudies.map(study => 
        study.id === id ? { ...study, [field]: value } : study
      )
    }))
  }

  const removeCaseStudy = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      caseStudies: prev.caseStudies.filter(study => study.id !== id)
    }))
  }

  const addSkill = () => {
    const newSkill = { name: "New Skill", level: 70, category: "both" }
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }))
  }

  const updateSkill = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const removeSkill = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addService = () => {
    const newService = {
      icon: "Palette",
      title: "New Service",
      description: "Service description..."
    }
    setPortfolioData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }))
  }

  const updateService = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }))
  }

  const removeService = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const updateFooterField = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value
      }
    }))
  }

  const updateFooterStats = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickStats: {
          ...prev.footer.quickStats,
          [field]: value
        }
      }
    }))
  }

  const updateSocialLink = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer.socialLinks.map((link, i) => 
          i === index ? { ...link, [field]: value } : link
        )
      }
    }))
  }

  const addSocialLink = () => {
    const newLink = { platform: "New Platform", url: "", icon: "Globe" }
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: [...prev.footer.socialLinks, newLink]
      }
    }))
  }

  const removeSocialLink = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer.socialLinks.filter((_, i) => i !== index)
      }
    }))
  }

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-8 h-8" />
      case 'Users': return <Users className="w-8 h-8" />
      case 'Layers': return <Layers className="w-8 h-8" />
      case 'Target': return <Target className="w-8 h-8" />
      case 'Figma': return <Figma className="w-8 h-8" />
      case 'Globe': return <Globe className="w-8 h-8" />
      default: return <Palette className="w-8 h-8" />
    }
  }

  const savePortfolio = async () => {
    const savedPortfolio = await savePortfolioToBackend(portfolioData, 'ui-ux-designer', customSubdomain, null, portfolioId)
    
    // Update portfolioId with the saved portfolio's ID
    if (savedPortfolio && savedPortfolio.id) {
      console.log('✅ UIUX Portfolio saved, updating portfolioId:', savedPortfolio.id);
      setPortfolioId(savedPortfolio.id)
    }
  }

  const publishPortfolio = async () => {
    try {
      const savedPortfolio = await savePortfolioToBackend(portfolioData, 'ui-ux-designer', customSubdomain, null, portfolioId)
      
      // Update portfolioId if we just saved
      if (savedPortfolio && savedPortfolio.id) {
        setPortfolioId(savedPortfolio.id)
        localStorage.setItem('savedPortfolioId', savedPortfolio.id)
      }
      
      const result = await publishPortfolioToBackend('ui-ux-designer')
      if (result) {
        setPublishedPortfolio(result)
        setShowPublishModal(true)
      }
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  if (isPreview) {
    // Preview mode rendering would go here
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Preview Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Editor</span>
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={savePortfolio}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={publishPortfolio}
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Publish</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Preview content would go here */}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Templates</span>
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setIsPreview(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={savePortfolio}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={publishPortfolio}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>Publish Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UI/UX Designer Portfolio Editor</h1>
          <p className="text-gray-600">Customize your design portfolio with case studies, design process, and professional information.</p>
        </div>

        {/* Portfolio URL Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio URL</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your subdomain
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={customSubdomain}
                  onChange={(e) => setCustomSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="your-name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  pattern="[a-z0-9\-]+"
                />
                <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 whitespace-nowrap">
                  .portiqqo.me
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use lowercase letters, numbers, and hyphens only. Leave empty to auto-generate from your name.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Profile Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-2 text-purple-600" />
              Designer Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="relative group">
                  <img
                    src={portfolioData.profile.bannerImage}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleImageUpload('bannerImage', 'profile')}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <Upload className="w-8 h-8 text-white" />
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="relative group w-32 h-32">
                  <img
                    src={portfolioData.profile.profileImage}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <button
                    onClick={() => handleImageUpload('profileImage', 'profile')}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={portfolioData.profile.name}
                  onChange={(e) => updateProfileField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={portfolioData.profile.title}
                  onChange={(e) => updateProfileField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Design Specialization */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Specialization</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {specializationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateProfileField('specialization', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        portfolioData.profile.specialization === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {option.icon}
                        <span className="text-xs font-medium text-center">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={portfolioData.profile.description}
                  onChange={(e) => updateProfileField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.profile.location}
                  onChange={(e) => updateProfileField('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={portfolioData.profile.email}
                  onChange={(e) => updateProfileField('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.profile.phone}
                  onChange={(e) => updateProfileField('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={portfolioData.profile.website}
                  onChange={(e) => updateProfileField('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dribbble</label>
                <input
                  type="url"
                  value={portfolioData.profile.dribbble}
                  onChange={(e) => updateProfileField('dribbble', e.target.value)}
                  placeholder="https://dribbble.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Behance</label>
                <input
                  type="url"
                  value={portfolioData.profile.behance}
                  onChange={(e) => updateProfileField('behance', e.target.value)}
                  placeholder="https://behance.net/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Design Tools Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Palette className="w-6 h-6 mr-2 text-purple-600" />
              Design Tools & Software
            </h2>

            <div className="space-y-6">
              {toolCategories.map((category) => (
                <div key={category.key} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-purple-600 mr-2">{category.icon}</span>
                    {category.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.designTools[category.key].map((tool, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        {tool}
                        <button
                          onClick={() => {
                            const newTools = portfolioData.designTools[category.key].filter((_, i) => i !== index)
                            updateDesignTools(category.key, newTools)
                          }}
                          className="ml-2 w-4 h-4 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <button
                      onClick={() => {
                        const newTool = prompt(`Add new ${category.name.toLowerCase()}:`)
                        if (newTool) {
                          updateDesignTools(category.key, [...portfolioData.designTools[category.key], newTool])
                        }
                      }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Case Studies Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Layers className="w-6 h-6 mr-2 text-purple-600" />
                Case Studies & Projects
              </h2>
              <button
                onClick={addCaseStudy}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Case Study</span>
              </button>
            </div>

            {/* Case Study Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                How to Create Effective Case Studies
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="text-blue-800 font-medium">Define the problem & challenge</p>
                    <p className="text-blue-600 text-sm">Clearly articulate what user problem you solved</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="text-blue-800 font-medium">Explain your design process & solution</p>
                    <p className="text-blue-600 text-sm">Show your research, ideation, and design decisions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="text-blue-800 font-medium">Share measurable results & impact</p>
                    <p className="text-blue-600 text-sm">Include metrics, user feedback, and business outcomes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="text-blue-800 font-medium">Add prototypes and live links</p>
                    <p className="text-blue-600 text-sm">Link to Figma prototypes, Behance projects, or live sites</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {portfolioData.caseStudies.map((study, index) => (
                <div key={study.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="relative group mb-4">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageUpload('image', 'caseStudies')}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => removeCaseStudy(study.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={study.title}
                        onChange={(e) => updateCaseStudy(study.id, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={study.category}
                          onChange={(e) => updateCaseStudy(study.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="mobile">Mobile App</option>
                          <option value="web">Web Design</option>
                          <option value="branding">Branding</option>
                          <option value="research">Research</option>
                          <option value="prototype">Prototype</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={study.year}
                          onChange={(e) => updateCaseStudy(study.id, 'year', e.target.value)}
                          placeholder="2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Overview</label>
                      <textarea
                        value={study.description}
                        onChange={(e) => updateCaseStudy(study.id, 'description', e.target.value)}
                        placeholder="Brief project description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Challenge/Problem</label>
                      <textarea
                        value={study.challenge}
                        onChange={(e) => updateCaseStudy(study.id, 'challenge', e.target.value)}
                        placeholder="What problem did you solve?"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Solution/Process</label>
                      <textarea
                        value={study.solution}
                        onChange={(e) => updateCaseStudy(study.id, 'solution', e.target.value)}
                        placeholder="How did you solve it?"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Results/Impact</label>
                      <textarea
                        value={study.results}
                        onChange={(e) => updateCaseStudy(study.id, 'results', e.target.value)}
                        placeholder="What were the results? Include metrics if possible."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <input
                          type="text"
                          value={study.duration}
                          onChange={(e) => updateCaseStudy(study.id, 'duration', e.target.value)}
                          placeholder="3 months"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                        <input
                          type="text"
                          value={study.role}
                          onChange={(e) => updateCaseStudy(study.id, 'role', e.target.value)}
                          placeholder="Lead UI/UX Designer"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tools Used</label>
                      <input
                        type="text"
                        value={study.tools.join(', ')}
                        onChange={(e) => updateCaseStudy(study.id, 'tools', e.target.value.split(', ').filter(t => t))}
                        placeholder="Figma, Principle, UsabilityHub"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Behance Project URL</label>
                        <input
                          type="url"
                          value={study.behanceUrl}
                          onChange={(e) => updateCaseStudy(study.id, 'behanceUrl', e.target.value)}
                          placeholder="https://behance.net/gallery/project"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prototype URL</label>
                        <input
                          type="url"
                          value={study.prototypeUrl}
                          onChange={(e) => updateCaseStudy(study.id, 'prototypeUrl', e.target.value)}
                          placeholder="https://figma.com/proto/prototype-link"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-600" />
                Skills & Expertise
              </h2>
              <button
                onClick={addSkill}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ui">UI</option>
                    <option value="ux">UX</option>
                    <option value="both">Both</option>
                  </select>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm font-medium text-gray-600 w-10">{skill.level}%</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                Services
              </h2>
              <button
                onClick={addService}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-purple-600">
                      {getServiceIcon(service.icon)}
                    </div>
                    <button
                      onClick={() => removeService(index)}
                      className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <select
                      value={service.icon}
                      onChange={(e) => updateService(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Palette">Palette</option>
                      <option value="Users">Users</option>
                      <option value="Layers">Layers</option>
                      <option value="Target">Target</option>
                      <option value="Figma">Figma</option>
                      <option value="Globe">Globe</option>
                    </select>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      placeholder="Service title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Service description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer Section - Same structure as other templates */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-purple-600" />
              Footer Settings
            </h2>

            <div className="space-y-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={portfolioData.footer.companyName}
                      onChange={(e) => updateFooterField('companyName', e.target.value)}
                      placeholder="Your Design Studio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={portfolioData.footer.tagline}
                      onChange={(e) => updateFooterField('tagline', e.target.value)}
                      placeholder="Your design philosophy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                    <input
                      type="text"
                      value={portfolioData.footer.copyright}
                      onChange={(e) => updateFooterField('copyright', e.target.value)}
                      placeholder="© 2024 Your Name. All rights reserved."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.projects}
                      onChange={(e) => updateFooterStats('projects', e.target.value)}
                      placeholder="30+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.experience}
                      onChange={(e) => updateFooterStats('experience', e.target.value)}
                      placeholder="4+ years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clients</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.clients}
                      onChange={(e) => updateFooterStats('clients', e.target.value)}
                      placeholder="50+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Awards</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.awards}
                      onChange={(e) => updateFooterStats('awards', e.target.value)}
                      placeholder="8+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
                  <button
                    onClick={addSocialLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolioData.footer.socialLinks.map((link, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          placeholder="Dribbble"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="https://dribbble.com/username"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select
                          value={link.icon}
                          onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Palette">Palette</option>
                          <option value="Layers">Layers</option>
                          <option value="Globe">Globe</option>
                          <option value="Mail">Mail</option>
                          <option value="Phone">Phone</option>
                          <option value="Figma">Figma</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Image</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Choose an image file to upload</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Select File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Success Modal */}
      <PublishSuccessModal 
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        portfolioUrl={publishedPortfolio?.publicUrl}
        subdomain={publishedPortfolio?.subdomain}
      />
    </div>
  )
}

export default UIUXDesignerTemplateEditor