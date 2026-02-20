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
  Image as ImageIcon,
  Video,
  Music,
  Film,
  Monitor,
  Camera,
  MapPin,
  Mail,
  Phone,
  Globe
} from 'lucide-react'

function VideoEditorTemplateEditor() {
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
      console.log('📝 Loading existing video editor portfolio for edit');
      loadPortfolioData(existingPortfolio)
    } else if (portfolioIdParam) {
      console.log('📝 Fetching video editor portfolio by ID:', portfolioIdParam);
      fetchPortfolioById(portfolioIdParam)
    }
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    if (portfolio.templateData) {
      console.log('✅ Video editor portfolio data loaded successfully');
      setPortfolioData(portfolio.templateData)
    }
    if (portfolio.subdomain) {
      const subdomain = portfolio.subdomain.replace('.portiqqo.me', '');
      setCustomSubdomain(subdomain)
    }
    setPortfolioId(portfolio._id)
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
      name: "Alex Chen",
      title: "Professional Video Editor",
      description: "Creating cinematic stories through the art of video editing. Specializing in commercials, music videos, and documentary filmmaking with 8+ years of experience.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=400&fit=crop",
      location: "Los Angeles, CA",
      email: "alex@videoeditor.com",
      phone: "+1 (555) 123-4567",
      website: "www.alexchen.video"
    },
    work: [
      {
        id: 1,
        title: "Nike Commercial Campaign",
        category: "commercial",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "2:30",
        description: "High-energy commercial showcasing Nike's new athletic wear line with dynamic cuts and motion graphics.",
        client: "Nike",
        year: "2024"
      },
      {
        id: 2,
        title: "Indie Music Video",
        category: "music",
        youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        duration: "3:45",
        description: "Artistic music video with color grading and creative transitions for emerging indie artist.",
        client: "Luna Records",
        year: "2024"
      }
    ],
    skills: [
      { name: "Adobe Premiere Pro", level: 95 },
      { name: "After Effects", level: 90 },
      { name: "DaVinci Resolve", level: 85 },
      { name: "Final Cut Pro", level: 88 }
    ],
    services: [
      {
        icon: "Video",
        title: "Commercial Video Editing",
        description: "Professional editing for commercials, advertisements, and promotional content with high-impact results."
      },
      {
        icon: "Music",
        title: "Music Video Production",
        description: "Creative music video editing with artistic flair, color grading, and rhythm-based cuts."
      }
    ],
    footer: {
      companyName: "Alex Chen Studio",
      tagline: "Creating cinematic stories through professional video editing",
      email: "alex@videoeditor.com",
      phone: "+1 (555) 123-4567",
      location: "Los Angeles, CA",
      website: "www.alexchen.video",
      quickStats: {
        projects: "50+",
        experience: "8+ years",
        clients: "100+",
        awards: "15+"
      },
      services: [
        { title: "Commercial Video Editing", description: "Professional editing for commercials, advertisements, and promotional content with high-impact results." },
        { title: "Music Video Production", description: "Creative music video editing with artistic flair, color grading, and rhythm-based cuts." },
        { title: "Documentary Editing", description: "Compelling storytelling through documentary-style editing with narrative structure." }
      ],
      socialLinks: [
        { platform: "YouTube", url: "https://youtube.com/@alexchen", icon: "Video" },
        { platform: "Instagram", url: "https://instagram.com/alexchen", icon: "Camera" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/alexchen", icon: "Globe" }
      ],
      copyright: "© 2024 Alex Chen. All rights reserved."
    }
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'music', name: 'Music Videos' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'personal', name: 'Personal' },
    { id: 'content', name: 'Content' }
  ]

  const filteredWork = selectedCategory === 'all' 
    ? portfolioData.work 
    : portfolioData.work.filter(work => work.category === selectedCategory)

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

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
        } else if (editingSection === 'work') {
          // Handle work image uploads
          console.log('Work image upload:', uploadType, imageUrl)
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

  const addWorkItem = () => {
    const newWork = {
      id: Date.now(),
      title: "New Project",
      category: "commercial",
      youtubeUrl: "",
      duration: "0:00",
      description: "Project description...",
      client: "Client Name",
      year: "2024"
    }
    setPortfolioData(prev => ({
      ...prev,
      work: [...prev.work, newWork]
    }))
  }

  const updateWorkItem = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      work: prev.work.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeWorkItem = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      work: prev.work.filter(item => item.id !== id)
    }))
  }

  const addSkill = () => {
    const newSkill = { name: "New Skill", level: 70 }
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
      icon: "Video",
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

  const addFooterService = () => {
    const newService = { title: "New Service", description: "Service description..." }
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        services: [...prev.footer.services, newService]
      }
    }))
  }

  const updateFooterService = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        services: prev.footer.services.map((service, i) => 
          i === index ? { ...service, [field]: value } : service
        )
      }
    }))
  }

  const removeFooterService = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        services: prev.footer.services.filter((_, i) => i !== index)
      }
    }))
  }

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Video': return <Video className="w-8 h-8" />
      case 'Music': return <Music className="w-8 h-8" />
      case 'Film': return <Film className="w-8 h-8" />
      case 'Monitor': return <Monitor className="w-8 h-8" />
      case 'Camera': return <Camera className="w-8 h-8" />
      case 'Edit3': return <Edit3 className="w-8 h-8" />
      default: return <Video className="w-8 h-8" />
    }
  }

  const savePortfolio = async () => {
    await savePortfolioToBackend(portfolioData, 'video-editor', customSubdomain, null, portfolioId)
  }

  const publishPortfolio = async () => {
    try {
      await savePortfolioToBackend(portfolioData, 'video-editor', customSubdomain, null, portfolioId)
      const result = await publishPortfolioToBackend('video-editor')
      if (result) {
        setPublishedPortfolio(result)
        setShowPublishModal(true)
      }
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  if (isPreview) {
    // Preview mode - render the template with current data
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

        {/* Complete Preview Content */}
        <div>
          {/* Banner Section */}
          <section className="relative h-96 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${portfolioData.profile.bannerImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
            </div>
            
            <div className="relative z-10 h-full flex items-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                  <div>
                    <img
                      src={portfolioData.profile.profileImage}
                      alt={portfolioData.profile.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                      {portfolioData.profile.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-3">
                      {portfolioData.profile.title}
                    </p>
                    <p className="text-lg text-gray-300 max-w-2xl">
                      {portfolioData.profile.description}
                    </p>
                  </div>
                  
                  <div className="text-white space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{portfolioData.profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{portfolioData.profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{portfolioData.profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{portfolioData.profile.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Work Portfolio Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  My Work
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Showcasing creative video editing projects across various industries and styles
                </p>
              </motion.div>

              {/* Category Filter */}
              <div className="flex justify-center mb-12">
                <div className="bg-gray-100 p-2 rounded-xl">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {filteredWork.map((work, index) => {
                  const videoId = getYouTubeVideoId(work.youtubeUrl)
                  return (
                    <motion.div
                      key={work.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                      variants={fadeInUp}
                      whileHover={{ y: -10 }}
                    >
                      {/* YouTube Video Embed */}
                      {videoId ? (
                        <div className="relative aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                            title={work.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                            {work.duration}
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No video available</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{work.title}</h3>
                          <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm capitalize">
                            {work.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{work.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{work.client}</span>
                          <span>{work.year}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Skills & Expertise
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Proficiency in industry-standard video editing software and techniques
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {portfolioData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                      <span className="text-sm font-medium text-purple-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Services
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Professional video editing services tailored to your creative vision
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioData.services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-purple-600 mb-6">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                {/* Get In Touch */}
                <div>
                  <h4 className="text-xl font-bold mb-6 text-purple-400">Get In Touch</h4>
                  <div className="space-y-4">
                    {portfolioData.footer.email && (
                      <a href={`mailto:${portfolioData.footer.email}`} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <span>{portfolioData.footer.email}</span>
                      </a>
                    )}
                    {portfolioData.footer.phone && (
                      <a href={`tel:${portfolioData.footer.phone}`} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span>{portfolioData.footer.phone}</span>
                      </a>
                    )}
                    {portfolioData.footer.location && (
                      <div className="flex items-center space-x-3 text-gray-300">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span>{portfolioData.footer.location}</span>
                      </div>
                    )}
                    {portfolioData.footer.website && (
                      <a href={`https://${portfolioData.footer.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span>{portfolioData.footer.website}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h4 className="text-xl font-bold mb-6 text-purple-400">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(portfolioData.footer.quickStats).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center hover:bg-opacity-70 transition-all">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-xl font-bold mb-6 text-purple-400">Services</h4>
                  <div className="space-y-4">
                    {portfolioData.footer.services.map((service, index) => (
                      <div key={index} className="group">
                        <h5 className="font-semibold text-white group-hover:text-purple-400 transition-colors mb-1">
                          {service.title}
                        </h5>
                        <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links & Copyright */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-wrap justify-center gap-4">
                    {portfolioData.footer.socialLinks.map((link, index) => (
                      <a 
                        key={index} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-all text-gray-300 hover:text-white hover:scale-110"
                        title={link.platform}
                      >
                        {getServiceIcon(link.icon)}
                      </a>
                    ))}
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-gray-400 text-sm">{portfolioData.footer.copyright}</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Editor Portfolio Editor</h1>
          <p className="text-gray-600">Customize your video editing portfolio with your personal information and work samples.</p>
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
              Profile Information
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
            </div>
          </motion.div>

          {/* Work Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Video className="w-6 h-6 mr-2 text-purple-600" />
                Portfolio Work
              </h2>
              <button
                onClick={addWorkItem}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                How to Add Your Video Projects
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="text-blue-800 font-medium">Upload your video to YouTube</p>
                    <p className="text-blue-600 text-sm">Make sure your video is public or unlisted so it can be embedded</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="text-blue-800 font-medium">Copy the YouTube URL</p>
                    <p className="text-blue-600 text-sm">From your browser address bar (e.g., https://www.youtube.com/watch?v=example)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="text-blue-800 font-medium">Click "Add Project" and paste the URL</p>
                    <p className="text-blue-600 text-sm">The video will automatically appear as a preview in your portfolio</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="text-blue-800 font-medium">Add project details</p>
                    <p className="text-blue-600 text-sm">Fill in title, description, client info, and select category</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 Pro Tip:</strong> Make sure your YouTube videos have engaging thumbnails and titles as they'll be displayed exactly as they appear on YouTube!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.work.map((item, index) => {
                const videoId = getYouTubeVideoId(item.youtubeUrl)
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="relative mb-4">
                      {/* YouTube Video Preview */}
                      {videoId ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                            title={item.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Enter YouTube URL below</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => removeWorkItem(item.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateWorkItem(item.id, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        value={item.youtubeUrl}
                        onChange={(e) => updateWorkItem(item.id, 'youtubeUrl', e.target.value)}
                        placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {!getYouTubeVideoId(item.youtubeUrl) && item.youtubeUrl && (
                        <div className="text-red-600 text-sm flex items-center space-x-1">
                          <X className="w-4 h-4" />
                          <span>Invalid YouTube URL. Please use a valid YouTube link.</span>
                        </div>
                      )}
                      {getYouTubeVideoId(item.youtubeUrl) && (
                        <div className="text-green-600 text-sm flex items-center space-x-1">
                          <Video className="w-4 h-4" />
                          <span>✅ Video loaded successfully!</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.category}
                          onChange={(e) => updateWorkItem(item.id, 'category', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="commercial">Commercial</option>
                          <option value="music">Music Video</option>
                          <option value="documentary">Documentary</option>
                          <option value="personal">Personal</option>
                          <option value="content">Content</option>
                        </select>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => updateWorkItem(item.id, 'duration', e.target.value)}
                          placeholder="Duration (e.g., 3:45)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateWorkItem(item.id, 'description', e.target.value)}
                        placeholder="Project description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.client}
                          onChange={(e) => updateWorkItem(item.id, 'client', e.target.value)}
                          placeholder="Client"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateWorkItem(item.id, 'year', e.target.value)}
                          placeholder="Year"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Edit3 className="w-6 h-6 mr-2 text-purple-600" />
                Skills
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
                <Monitor className="w-6 h-6 mr-2 text-purple-600" />
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
                      <option value="Video">Video</option>
                      <option value="Music">Music</option>
                      <option value="Film">Film</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Camera">Camera</option>
                      <option value="Edit3">Edit</option>
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
                      placeholder="Your Studio/Company Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={portfolioData.footer.tagline}
                      onChange={(e) => updateFooterField('tagline', e.target.value)}
                      placeholder="Your professional tagline"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={portfolioData.footer.email}
                      onChange={(e) => updateFooterField('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={portfolioData.footer.phone}
                      onChange={(e) => updateFooterField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={portfolioData.footer.location}
                      onChange={(e) => updateFooterField('location', e.target.value)}
                      placeholder="City, State/Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="text"
                      value={portfolioData.footer.website}
                      onChange={(e) => updateFooterField('website', e.target.value)}
                      placeholder="www.yourwebsite.com"
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
                      placeholder="50+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.experience}
                      onChange={(e) => updateFooterStats('experience', e.target.value)}
                      placeholder="8+ years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clients</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.clients}
                      onChange={(e) => updateFooterStats('clients', e.target.value)}
                      placeholder="100+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Awards</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.awards}
                      onChange={(e) => updateFooterStats('awards', e.target.value)}
                      placeholder="15+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Services Offered</h3>
                  <button
                    onClick={addFooterService}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolioData.footer.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Service {index + 1}</h4>
                        <button
                          onClick={() => removeFooterService(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => updateFooterService(index, 'title', e.target.value)}
                            placeholder="Service Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateFooterService(index, 'description', e.target.value)}
                            placeholder="Brief description of the service..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                          placeholder="YouTube"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="https://youtube.com/@username"
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
                          <option value="Video">Video</option>
                          <option value="Camera">Camera</option>
                          <option value="Globe">Globe</option>
                          <option value="Mail">Mail</option>
                          <option value="Phone">Phone</option>
                          <option value="Edit3">Edit</option>
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

              {/* Copyright */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Copyright</h3>
                <input
                  type="text"
                  value={portfolioData.footer.copyright}
                  onChange={(e) => updateFooterField('copyright', e.target.value)}
                  placeholder="© 2024 Your Name. All rights reserved."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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

export default VideoEditorTemplateEditor