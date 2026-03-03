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
  Briefcase,
  Award,
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Target
} from 'lucide-react'

function GeneralPortfolioTemplateEditor() {
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

  // Load existing portfolio when editing from dashboard
  useEffect(() => {
    const existingPortfolio = location.state?.existingPortfolio
    const portfolioIdParam = location.state?.portfolioId
    if (existingPortfolio) {
      loadPortfolioData(existingPortfolio)
    } else if (portfolioIdParam) {
      fetchPortfolioById(portfolioIdParam)
    }
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    if (portfolio.templateData && Object.keys(portfolio.templateData).length > 0) {
      setPortfolioData(portfolio.templateData)
    }
    if (portfolio.subdomain) {
      setCustomSubdomain(portfolio.subdomain.replace('.portiqqo.me', ''))
    }
    setPortfolioId(portfolio._id)
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
      name: "Jordan Smith",
      title: "Creative Professional",
      tagline: "Bringing ideas to life with passion and creativity",
      description: "Versatile creative professional with expertise in multiple disciplines. Passionate about creating impactful work that makes a difference.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
      location: "San Francisco, CA",
      email: "jordan@portfolio.com",
      phone: "+1 (555) 456-7890",
      website: "www.jordansmith.com",
      linkedin: "https://linkedin.com/in/jordansmith",
      years: "5+"
    },
    about: {
      intro: "I'm a creative professional dedicated to delivering high-quality work that exceeds expectations.",
      mission: "To create meaningful solutions that combine creativity, functionality, and user experience.",
      values: ["Innovation", "Quality", "Collaboration", "Integrity"]
    },
    projects: [
      {
        id: 1,
        title: "Brand Identity Redesign",
        category: "branding",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop",
        description: "Complete brand identity redesign for a tech startup, including logo, color palette, and brand guidelines.",
        details: "Created a modern, professional brand identity that reflects the company's innovative approach and values.",
        tags: ["Branding", "Design", "Strategy"],
        year: "2024",
        client: "Tech Startup Inc.",
        projectUrl: "https://example.com/project1",
        featured: true
      },
      {
        id: 2,
        title: "Marketing Campaign",
        category: "marketing",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        description: "Multi-channel marketing campaign that increased engagement by 150%.",
        details: "Developed and executed a comprehensive marketing strategy across social media, email, and paid advertising.",
        tags: ["Marketing", "Social Media", "Analytics"],
        year: "2024",
        client: "E-commerce Brand",
        projectUrl: "https://example.com/project2",
        featured: true
      }
    ],
    skills: [
      { name: "Project Management", level: 90, category: "management" },
      { name: "Creative Strategy", level: 88, category: "strategy" },
      { name: "Communication", level: 92, category: "soft-skills" },
      { name: "Problem Solving", level: 87, category: "soft-skills" },
      { name: "Team Leadership", level: 85, category: "management" },
      { name: "Client Relations", level: 90, category: "soft-skills" }
    ],
    services: [
      {
        icon: "Briefcase",
        title: "Consulting",
        description: "Strategic consulting services to help your business grow and thrive."
      },
      {
        icon: "Target",
        title: "Strategy Development",
        description: "Comprehensive strategies tailored to your unique goals and challenges."
      },
      {
        icon: "Award",
        title: "Project Management",
        description: "End-to-end project management ensuring timely and quality delivery."
      },
      {
        icon: "User",
        title: "Workshops & Training",
        description: "Interactive workshops and training sessions for teams and individuals."
      }
    ],
    experience: [
      {
        id: 1,
        title: "Senior Consultant",
        company: "Consulting Firm",
        period: "2022 - Present",
        description: "Leading strategic projects for Fortune 500 clients across various industries.",
        achievements: [
          "Managed 15+ high-impact projects",
          "Increased client satisfaction by 40%",
          "Built and led cross-functional teams"
        ]
      },
      {
        id: 2,
        title: "Project Manager",
        company: "Creative Agency",
        period: "2019 - 2022",
        description: "Coordinated creative projects from concept to completion.",
        achievements: [
          "Delivered 50+ projects on time and within budget",
          "Improved team efficiency by 30%",
          "Established quality assurance processes"
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: "Master's in Business Administration",
        school: "University Name",
        year: "2019",
        description: "Specialized in Strategic Management and Innovation"
      },
      {
        id: 2,
        degree: "Bachelor's in Communications",
        school: "College Name",
        year: "2017",
        description: "Focus on Digital Media and Marketing"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Emily Chen",
        role: "CEO, Tech Company",
        content: "Working with Jordan was a game-changer for our business. Their strategic thinking and execution are top-notch.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Jordan Smith Portfolio",
      tagline: "Creating impact through creativity and strategy",
      quickStats: {
        projects: "100+",
        experience: "5+ years",
        clients: "50+",
        awards: "10+"
      },
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/jordansmith", icon: "Globe" },
        { platform: "Website", url: "https://jordansmith.com", icon: "Globe" }
      ],
      copyright: "© 2024 Jordan Smith. All rights reserved."
    }
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'branding', name: 'Branding' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'other', name: 'Other' }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(project => project.category === selectedCategory)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
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

  const updateAboutField = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }))
  }

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "other",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      description: "Project description...",
      details: "Project details...",
      tags: [],
      year: "2024",
      client: "Client Name",
      projectUrl: "",
      featured: false
    }
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const updateProject = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }))
  }

  const addSkill = () => {
    const newSkill = { name: "New Skill", level: 70, category: "soft-skills" }
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
      icon: "Briefcase",
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

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: "Job Title",
      company: "Company Name",
      period: "Year - Year",
      description: "Job description...",
      achievements: []
    }
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }))
  }

  const updateExperience = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "Degree Name",
      school: "School Name",
      year: "Year",
      description: "Description..."
    }
    setPortfolioData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }))
  }

  const updateEducation = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
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
      case 'Briefcase': return <Briefcase className="w-8 h-8" />
      case 'Target': return <Target className="w-8 h-8" />
      case 'Award': return <Award className="w-8 h-8" />
      case 'User': return <User className="w-8 h-8" />
      case 'FileText': return <FileText className="w-8 h-8" />
      case 'Globe': return <Globe className="w-8 h-8" />
      default: return <Briefcase className="w-8 h-8" />
    }
  }

  const savePortfolio = async () => {
    const saved = await savePortfolioToBackend(portfolioData, 'general', customSubdomain, null, portfolioId)
    if (saved?._id || saved?.id) {
      setPortfolioId(saved._id || saved.id)
    }
  }

  const publishPortfolio = async () => {
    try {
      const saved = await savePortfolioToBackend(portfolioData, 'general', customSubdomain, null, portfolioId)
      if (saved?._id || saved?.id) {
        setPortfolioId(saved._id || saved.id)
      }
      const result = await publishPortfolioToBackend('general')
      if (result) {
        setPublishedPortfolio(result)
        setShowPublishModal(true)
      }
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                  onClick={publishPortfolio}
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Publish</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">General Portfolio Editor</h1>
          <p className="text-gray-600">Create a flexible, professional portfolio perfect for any profession or industry.</p>
        </div>

        <div className="space-y-12">
          {/* Profile Section - Similar structure to other templates but simpler */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-2 text-purple-600" />
              Profile Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={portfolioData.profile.title}
                  onChange={(e) => updateProfileField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={portfolioData.profile.tagline}
                  onChange={(e) => updateProfileField('tagline', e.target.value)}
                  placeholder="Brief tagline or headline"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Description</label>
                <textarea
                  value={portfolioData.profile.description}
                  onChange={(e) => updateProfileField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={portfolioData.profile.years}
                  onChange={(e) => updateProfileField('years', e.target.value)}
                  placeholder="5+"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.profile.linkedin}
                  onChange={(e) => updateProfileField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Projects Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-purple-600" />
                Projects & Work
              </h2>
              <button
                onClick={addProject}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-8">
              {portfolioData.projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="relative group mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeProject(project.id)}
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
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={project.category}
                          onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="branding">Branding</option>
                          <option value="marketing">Marketing</option>
                          <option value="consulting">Consulting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => updateProject(project.id, 'year', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <input
                        type="text"
                        value={project.client}
                        onChange={(e) => updateProject(project.id, 'client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                      <input
                        type="url"
                        value={project.projectUrl}
                        onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={project.tags.join(', ')}
                        onChange={(e) => updateProject(project.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        placeholder="Tag1, Tag2, Tag3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills, Services, Experience sections would follow the same pattern as other templates */}
          {/* For brevity, I'm including just the footer section */}

          {/* Footer Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-purple-600" />
              Footer Settings
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={portfolioData.footer.companyName}
                      onChange={(e) => updateFooterField('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={portfolioData.footer.tagline}
                      onChange={(e) => updateFooterField('tagline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                    <input
                      type="text"
                      value={portfolioData.footer.copyright}
                      onChange={(e) => updateFooterField('copyright', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.projects}
                      onChange={(e) => updateFooterStats('projects', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.experience}
                      onChange={(e) => updateFooterStats('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clients</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.clients}
                      onChange={(e) => updateFooterStats('clients', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Awards</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.awards}
                      onChange={(e) => updateFooterStats('awards', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
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
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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

export default GeneralPortfolioTemplateEditor
