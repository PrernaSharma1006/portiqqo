import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { savePortfolioToBackend, publishPortfolioToBackend } from '../../utils/portfolioHelper'
import PublishSuccessModal from '../modals/PublishSuccessModal'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff,
  Upload, 
  Edit3, 
  X, 
  Plus, 
  Camera, 
  Image as ImageIcon,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Aperture,
  Film
} from 'lucide-react'

function PhotographerTemplateEditor() {
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

  // Editable portfolio data
  const [portfolioData, setPortfolioData] = useState({
    profile: {
      name: "Alex Martinez",
      title: "Professional Photographer",
      specialty: "portrait", // portrait, landscape, wedding, commercial, wildlife, fashion
      description: "Award-winning photographer specializing in capturing authentic moments and stunning visuals. Over 8 years of experience in portrait and commercial photography.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=400&fit=crop",
      location: "Los Angeles, CA",
      email: "alex@photography.com",
      phone: "+1 (555) 987-6543",
      website: "www.alexmartinez.photo",
      instagram: "https://instagram.com/alexmartinezphoto",
      years: "8+"
    },
    equipment: {
      cameras: ["Canon EOS R5", "Sony A7R IV", "Fujifilm X-T4"],
      lenses: ["Canon RF 24-70mm f/2.8", "Sony FE 85mm f/1.4", "Canon RF 70-200mm f/2.8"],
      lighting: ["Profoto B10", "Godox AD600", "LED Panels"],
      accessories: ["DJI Ronin-S", "Peak Design Tripod", "Capture One Pro"]
    },
    galleries: [
      {
        id: 1,
        title: "Corporate Portraits",
        category: "portrait",
        coverImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop",
        images: [
          {
            url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop",
            title: "Executive Portrait",
            description: "Corporate headshot for Fortune 500 company",
            camera: "Canon EOS R5",
            lens: "RF 85mm f/1.2",
            settings: "f/2.0, 1/200s, ISO 100"
          },
          {
            url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
            title: "Business Professional",
            description: "LinkedIn profile photography",
            camera: "Sony A7R IV",
            lens: "FE 85mm f/1.4",
            settings: "f/1.8, 1/160s, ISO 200"
          }
        ],
        description: "Professional corporate headshots and business portraits for executives and professionals.",
        year: "2024",
        client: "Various Corporate Clients"
      },
      {
        id: 2,
        title: "Wedding Collection",
        category: "wedding",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
        images: [
          {
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
            title: "Wedding Ceremony",
            description: "Intimate garden wedding ceremony",
            camera: "Canon EOS R5",
            lens: "RF 24-70mm f/2.8",
            settings: "f/2.8, 1/250s, ISO 400"
          },
          {
            url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
            title: "Reception Moments",
            description: "First dance under string lights",
            camera: "Sony A7R IV",
            lens: "FE 35mm f/1.4",
            settings: "f/1.8, 1/100s, ISO 1600"
          }
        ],
        description: "Capturing love stories with artistic vision and emotional depth.",
        year: "2024",
        client: "Private Clients"
      }
    ],
    skills: [
      { name: "Portrait Photography", level: 95, category: "specialty" },
      { name: "Commercial Photography", level: 90, category: "specialty" },
      { name: "Photo Editing", level: 92, category: "technical" },
      { name: "Lighting Design", level: 88, category: "technical" },
      { name: "Color Grading", level: 87, category: "post-production" },
      { name: "Retouching", level: 85, category: "post-production" }
    ],
    services: [
      {
        icon: "Camera",
        title: "Portrait Photography",
        description: "Professional headshots, family portraits, and personal branding photography.",
        price: "Starting at $350"
      },
      {
        icon: "Award",
        title: "Wedding Photography",
        description: "Full-day wedding coverage with engagement session and premium album.",
        price: "Starting at $2,500"
      },
      {
        icon: "Aperture",
        title: "Commercial Photography",
        description: "Product photography, corporate events, and brand campaigns.",
        price: "Starting at $500"
      },
      {
        icon: "Film",
        title: "Event Coverage",
        description: "Corporate events, conferences, and special occasions documentation.",
        price: "Starting at $400"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "CEO, Tech Startup",
        content: "Alex's attention to detail and ability to capture authentic moments is exceptional. Our corporate headshots exceeded all expectations.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Michael & Emma",
        role: "Wedding Clients",
        content: "We couldn't be happier with our wedding photos! Alex captured every special moment beautifully. Highly recommend!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      }
    ],
    footer: {
      companyName: "Alex Martinez Photography",
      tagline: "Capturing moments that last forever",
      quickStats: {
        projects: "500+",
        experience: "8+ years",
        clients: "300+",
        awards: "12+"
      },
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com/alexmartinezphoto", icon: "Instagram" },
        { platform: "Portfolio", url: "https://500px.com/alexmartinez", icon: "Camera" },
        { platform: "Website", url: "https://alexmartinez.photo", icon: "Globe" }
      ],
      copyright: "© 2024 Alex Martinez Photography. All rights reserved."
    },
    hiddenSections: []
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [selectedGallery, setSelectedGallery] = useState(null)

  // Load existing portfolio data if editing
  useEffect(() => {
    const existingPortfolio = location.state?.existingPortfolio
    
    if (existingPortfolio) {
      console.log('📝 Loading existing portfolio for edit');
      loadPortfolioData(existingPortfolio)
    }
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    if (portfolio.templateData && Object.keys(portfolio.templateData).length > 0) {
      setPortfolioData(portfolio.templateData)
    }
    if (portfolio.subdomain) {
      const subdomain = portfolio.subdomain.replace('.portiqqo.me', '');
      setCustomSubdomain(subdomain)
    }
    setPortfolioId(portfolio._id)
    localStorage.setItem('savedPortfolioId', portfolio._id)
    if (portfolio.subdomain) {
      localStorage.setItem('savedPortfolioSubdomain', portfolio.subdomain)
    }
  }

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'fashion', name: 'Fashion' }
  ]

  const specialtyOptions = [
    { value: 'portrait', label: 'Portrait Photography', icon: <Camera className="w-5 h-5" /> },
    { value: 'wedding', label: 'Wedding Photography', icon: <Award className="w-5 h-5" /> },
    { value: 'commercial', label: 'Commercial Photography', icon: <Aperture className="w-5 h-5" /> },
    { value: 'landscape', label: 'Landscape Photography', icon: <ImageIcon className="w-5 h-5" /> },
    { value: 'fashion', label: 'Fashion Photography', icon: <Film className="w-5 h-5" /> },
    { value: 'wildlife', label: 'Wildlife Photography', icon: <Camera className="w-5 h-5" /> }
  ]

  const equipmentCategories = [
    { key: 'cameras', name: 'Cameras', icon: <Camera className="w-5 h-5" /> },
    { key: 'lenses', name: 'Lenses', icon: <Aperture className="w-5 h-5" /> },
    { key: 'lighting', name: 'Lighting', icon: <Award className="w-5 h-5" /> },
    { key: 'accessories', name: 'Accessories', icon: <Film className="w-5 h-5" /> }
  ]

  const filteredGalleries = selectedCategory === 'all' 
    ? portfolioData.galleries 
    : portfolioData.galleries.filter(gallery => gallery.category === selectedCategory)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleImageUpload = (field, section = null, galleryId = null) => {
    setUploadType(field)
    setEditingSection(section)
    setSelectedGallery(galleryId)
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
    setSelectedGallery(null)
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

  const updateEquipment = (category, equipment) => {
    setPortfolioData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [category]: equipment
      }
    }))
  }

  const addGallery = () => {
    const newGallery = {
      id: Date.now(),
      title: "New Gallery",
      category: "portrait",
      coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop",
      images: [],
      description: "Gallery description...",
      year: "2024",
      client: "Client Name"
    }
    setPortfolioData(prev => ({
      ...prev,
      galleries: [...prev.galleries, newGallery]
    }))
  }

  const updateGallery = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      galleries: prev.galleries.map(gallery => 
        gallery.id === id ? { ...gallery, [field]: value } : gallery
      )
    }))
  }

  const removeGallery = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      galleries: prev.galleries.filter(gallery => gallery.id !== id)
    }))
  }

  const addImageToGallery = (galleryId) => {
    const newImage = {
      url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
      title: "New Image",
      description: "Image description",
      camera: "Camera Model",
      lens: "Lens Model",
      settings: "Settings"
    }
    
    setPortfolioData(prev => ({
      ...prev,
      galleries: prev.galleries.map(gallery => 
        gallery.id === galleryId 
          ? { ...gallery, images: [...gallery.images, newImage] }
          : gallery
      )
    }))
  }

  const removeImageFromGallery = (galleryId, imageIndex) => {
    setPortfolioData(prev => ({
      ...prev,
      galleries: prev.galleries.map(gallery => 
        gallery.id === galleryId 
          ? { ...gallery, images: gallery.images.filter((_, i) => i !== imageIndex) }
          : gallery
      )
    }))
  }

  const updateGalleryImage = (galleryId, imageIndex, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      galleries: prev.galleries.map(gallery => 
        gallery.id === galleryId 
          ? {
              ...gallery,
              images: gallery.images.map((img, i) => 
                i === imageIndex ? { ...img, [field]: value } : img
              )
            }
          : gallery
      )
    }))
  }

  const addSkill = () => {
    const newSkill = { name: "New Skill", level: 70, category: "specialty" }
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
      icon: "Camera",
      title: "New Service",
      description: "Service description...",
      price: "Starting at $0"
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

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "Client Name",
      role: "Client Role",
      content: "Testimonial content...",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    }
    setPortfolioData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }))
  }

  const updateTestimonial = (id, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(testimonial => 
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      )
    }))
  }

  const removeTestimonial = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(testimonial => testimonial.id !== id)
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
      case 'Camera': return <Camera className="w-8 h-8" />
      case 'Award': return <Award className="w-8 h-8" />
      case 'Aperture': return <Aperture className="w-8 h-8" />
      case 'Film': return <Film className="w-8 h-8" />
      case 'Instagram': return <Instagram className="w-8 h-8" />
      case 'Globe': return <Globe className="w-8 h-8" />
      default: return <Camera className="w-8 h-8" />
    }
  }

  const toggleSection = (sectionName) => {
    setPortfolioData(prev => {
      const hidden = prev.hiddenSections || []
      const isHidden = hidden.includes(sectionName)
      return {
        ...prev,
        hiddenSections: isHidden
          ? hidden.filter(s => s !== sectionName)
          : [...hidden, sectionName]
      }
    })
  }

  const isSectionHidden = (sectionName) => (portfolioData.hiddenSections || []).includes(sectionName)

  const savePortfolio = async () => {
    const savedPortfolio = await savePortfolioToBackend(portfolioData, 'photographer', customSubdomain, null, portfolioId)
    if (savedPortfolio && savedPortfolio.id) {
      setPortfolioId(savedPortfolio.id)
    }
  }

  const publishPortfolio = async () => {
    try {
      const savedPortfolio = await savePortfolioToBackend(portfolioData, 'photographer', customSubdomain, null, portfolioId)
      if (savedPortfolio && savedPortfolio.id) {
        setPortfolioId(savedPortfolio.id)
        localStorage.setItem('savedPortfolioId', savedPortfolio.id)
      }
      const result = await publishPortfolioToBackend('photographer')
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

        {/* Full Preview Content */}
        <div className="max-w-7xl mx-auto">
          {/* Banner Section */}
          <div className="relative h-96 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600">
            <img
              src={portfolioData.profile.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <img
                  src={portfolioData.profile.profileImage}
                  alt={portfolioData.profile.name}
                  className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-white shadow-2xl object-cover"
                />
                <h1 className="text-5xl font-bold mb-2">{portfolioData.profile.name}</h1>
                <p className="text-2xl mb-4">{portfolioData.profile.title}</p>
                <p className="text-xl">{portfolioData.profile.specialty}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-12 shadow-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">{portfolioData.profile.description}</p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  {portfolioData.profile.location}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  {portfolioData.profile.email}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  {portfolioData.profile.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Galleries Preview */}
          <div className="bg-gray-50 p-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Photo Galleries</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portfolioData.galleries.slice(0, 6).map((gallery) => (
                  <div key={gallery.id} className="relative overflow-hidden rounded-lg shadow-lg group">
                    <img
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{gallery.title}</h3>
                      <p className="text-sm text-gray-200">{gallery.photoCount || '0'} photos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{portfolioData.footer.companyName}</h3>
                  <p className="text-gray-400 mb-4">{portfolioData.footer.tagline}</p>
                  {portfolioData.footer.email && (
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <a href={`mailto:${portfolioData.footer.email}`} className="hover:text-white transition-colors">
                        {portfolioData.footer.email}
                      </a>
                    </div>
                  )}
                  {portfolioData.footer.phone && (
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <a href={`tel:${portfolioData.footer.phone}`} className="hover:text-white transition-colors">
                        {portfolioData.footer.phone}
                      </a>
                    </div>
                  )}
                  {portfolioData.footer.location && (
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span>{portfolioData.footer.location}</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(portfolioData.footer.quickStats).map(([key, value]) => (
                      <div key={key} className="text-center bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Connect With Me</h4>
                  <div className="space-y-3">
                    {portfolioData.footer.socialLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-600 transition-colors">
                          <span className="text-lg">→</span>
                        </div>
                        <span>{link.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-700 pt-8 text-center">
                <p className="text-gray-400">{portfolioData.footer.copyright}</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Photographer Portfolio Editor</h1>
          <p className="text-gray-600">Create your stunning photography portfolio with galleries, equipment showcase, and client testimonials.</p>
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
              Photographer Profile
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={portfolioData.profile.title}
                  onChange={(e) => updateProfileField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photography Specialty</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specialtyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateProfileField('specialty', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        portfolioData.profile.specialty === option.value
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
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
                  placeholder="8+"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={portfolioData.profile.instagram}
                  onChange={(e) => updateProfileField('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Equipment Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-purple-600" />
                Photography Equipment
              </h2>
              <button
                onClick={() => toggleSection('equipment')}
                title={isSectionHidden('equipment') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('equipment') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {isSectionHidden('equipment') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isSectionHidden('equipment') ? 'Hidden' : 'Visible'}</span>
              </button>
            </div>
            {isSectionHidden('equipment') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`space-y-6 ${isSectionHidden('equipment') ? 'hidden' : ''}`}>
              {equipmentCategories.map((category) => (
                <div key={category.key} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-purple-600 mr-2">{category.icon}</span>
                    {category.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.equipment[category.key].map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        {item}
                        <button
                          onClick={() => {
                            const newItems = portfolioData.equipment[category.key].filter((_, i) => i !== index)
                            updateEquipment(category.key, newItems)
                          }}
                          className="ml-2 w-4 h-4 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <button
                      onClick={() => {
                        const newItem = prompt(`Add new ${category.name.toLowerCase()}:`)
                        if (newItem) {
                          updateEquipment(category.key, [...portfolioData.equipment[category.key], newItem])
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

          {/* Photo Galleries Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2 text-purple-600" />
                Photo Galleries & Collections
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSection('galleries')}
                  title={isSectionHidden('galleries') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('galleries') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {isSectionHidden('galleries') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isSectionHidden('galleries') ? 'Hidden' : 'Visible'}</span>
                </button>
                <button
                  onClick={addGallery}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gallery</span>
                </button>
              </div>
            </div>
            {isSectionHidden('galleries') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}

            <div className={`space-y-8 ${isSectionHidden('galleries') ? 'hidden' : ''}`}>
              {portfolioData.galleries.map((gallery) => (
                <div key={gallery.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="relative group mb-4">
                    <img
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageUpload('coverImage', 'galleries', gallery.id)}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => removeGallery(gallery.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Title</label>
                      <input
                        type="text"
                        value={gallery.title}
                        onChange={(e) => updateGallery(gallery.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={gallery.category}
                          onChange={(e) => updateGallery(gallery.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="wedding">Wedding</option>
                          <option value="commercial">Commercial</option>
                          <option value="landscape">Landscape</option>
                          <option value="fashion">Fashion</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={gallery.year}
                          onChange={(e) => updateGallery(gallery.id, 'year', e.target.value)}
                          placeholder="2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={gallery.description}
                        onChange={(e) => updateGallery(gallery.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <input
                        type="text"
                        value={gallery.client}
                        onChange={(e) => updateGallery(gallery.id, 'client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Gallery Images ({gallery.images.length})</h4>
                      <button
                        onClick={() => addImageToGallery(gallery.id)}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        Add Image
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {gallery.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            onClick={() => removeImageFromGallery(gallery.id, imgIndex)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services & Pricing */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-600" />
                Services & Pricing
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSection('services')}
                  title={isSectionHidden('services') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('services') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {isSectionHidden('services') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isSectionHidden('services') ? 'Hidden' : 'Visible'}</span>
                </button>
                <button
                  onClick={addService}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>
            {isSectionHidden('services') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isSectionHidden('services') ? 'hidden' : ''}`}>
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
                      <option value="Camera">Camera</option>
                      <option value="Award">Award</option>
                      <option value="Aperture">Aperture</option>
                      <option value="Film">Film</option>
                      <option value="Instagram">Instagram</option>
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
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={service.price}
                      onChange={(e) => updateService(index, 'price', e.target.value)}
                      placeholder="Starting at $500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-600" />
                Client Testimonials
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSection('testimonials')}
                  title={isSectionHidden('testimonials') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('testimonials') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {isSectionHidden('testimonials') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isSectionHidden('testimonials') ? 'Hidden' : 'Visible'}</span>
                </button>
                <button
                  onClick={addTestimonial}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>
            </div>
            {isSectionHidden('testimonials') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isSectionHidden('testimonials') ? 'hidden' : ''}`}>
              {portfolioData.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <button
                      onClick={() => removeTestimonial(testimonial.id)}
                      className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                      placeholder="Client Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      placeholder="Client Role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                      placeholder="Testimonial content..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(testimonial.id, 'rating', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">{testimonial.rating} stars</div>
                    </div>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-purple-600" />
                Footer Settings
              </h2>
              <button
                onClick={() => toggleSection('footer')}
                title={isSectionHidden('footer') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('footer') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {isSectionHidden('footer') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isSectionHidden('footer') ? 'Hidden' : 'Visible'}</span>
              </button>
            </div>
            {isSectionHidden('footer') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`space-y-8 ${isSectionHidden('footer') ? 'hidden' : ''}`}>
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
                      placeholder="500+"
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
                      placeholder="300+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Awards</label>
                    <input
                      type="text"
                      value={portfolioData.footer.quickStats.awards}
                      onChange={(e) => updateFooterStats('awards', e.target.value)}
                      placeholder="12+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
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
                          <option value="Camera">Camera</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Globe">Globe</option>
                          <option value="Mail">Mail</option>
                          <option value="Phone">Phone</option>
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

export default PhotographerTemplateEditor
