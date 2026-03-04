import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { savePortfolioToBackend, publishPortfolioToBackend } from '../../utils/portfolioHelper'
import { triggerFeedbackModal, hasGivenFeedback } from '../../utils/feedbackHelper'
import { portfolioAPI } from '../../services/api'
import toast from 'react-hot-toast'
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
  Code, 
  Globe,
  Github,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Monitor,
  Database,
  Server,
  Smartphone,
  Image as ImageIcon,
  Download
} from 'lucide-react'

function WebDeveloperTemplateEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const previewRef = useRef(null)
  const [isPreview, setIsPreview] = useState(false)
  const [wantsPDF, setWantsPDF] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedPortfolio, setPublishedPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [portfolioId, setPortfolioId] = useState(null)

  // PDF download: fires after preview has mounted
  useEffect(() => {
    if (!isPreview || !wantsPDF) return
    const el = previewRef.current
    if (!el) return

    const run = async () => {
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      const name = portfolioData.profile?.name || 'portfolio'
      const fileName = `${name.replace(/\s+/g, '-').toLowerCase()}-portfolio.pdf`
      window.html2pdf().set({
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait', hotfixes: ['px_scaling'] },
      }).from(el).save()
      setWantsPDF(false)
    }
    run()
  }, [isPreview, wantsPDF])

  // Load existing portfolio data if editing
  useEffect(() => {
    const existingPortfolio = location.state?.existingPortfolio
    const portfolioIdParam = location.state?.portfolioId
    
    if (existingPortfolio) {
      console.log('📝 Loading existing portfolio for edit');
      loadPortfolioData(existingPortfolio)
    } else if (portfolioIdParam) {
      console.log('📝 Fetching portfolio by ID:', portfolioIdParam);
      fetchPortfolioById(portfolioIdParam)
    }
  }, [location.state])

  const loadPortfolioData = (portfolio) => {
    console.log('=== LOADING PORTFOLIO DATA ===');
    console.log('Full portfolio object:', portfolio);
    console.log('templateData:', portfolio.templateData);
    console.log('subdomain:', portfolio.subdomain);
    console.log('_id:', portfolio._id);
    
    if (portfolio.templateData && Object.keys(portfolio.templateData).length > 0) {
      console.log('✅ Using templateData from portfolio');
      setPortfolioData(portfolio.templateData)
    } else {
      console.warn('⚠️ No templateData found, reconstructing from portfolio fields');
      // Reconstruct portfolioData from portfolio fields for backwards compatibility
      const reconstructedProjects = Array.isArray(portfolio.projects) 
        ? portfolio.projects.map(project => ({
            ...project,
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            features: Array.isArray(project.features) ? project.features : [],
            category: project.category || 'fullstack',
            image: project.images?.[0]?.url || project.image || '',
            liveUrl: project.links?.live || project.liveUrl || '',
            githubUrl: project.links?.github || project.githubUrl || ''
          }))
        : [];
      
      const reconstructedData = {
        profile: {
          name: `${portfolio.personalInfo?.firstName || ''} ${portfolio.personalInfo?.lastName || ''}`.trim() || 'John Smith',
          title: portfolio.personalInfo?.tagline || 'Full Stack Developer',
          specialization: 'fullstack',
          description: portfolio.personalInfo?.bio || '',
          profileImage: portfolio.personalInfo?.profileImage?.url || '',
          bannerImage: '',
          location: portfolio.personalInfo?.location || '',
          email: portfolio.personalInfo?.email || '',
          phone: portfolio.personalInfo?.phone || '',
          website: portfolio.personalInfo?.website || '',
          github: portfolio.socialLinks?.github || '',
          linkedin: portfolio.socialLinks?.linkedin || '',
          twitter: portfolio.socialLinks?.twitter || ''
        },
        techStack: {
          frontend: [],
          backend: [],
          tools: [],
          other: []
        },
        skills: Array.isArray(portfolio.skills) 
          ? portfolio.skills.map(skill => typeof skill === 'string' ? skill : skill?.name || skill)
          : [],
        projects: reconstructedProjects,
        services: [],
        experience: [],
        education: [],
        testimonials: [],
        footer: {
          tagline: 'Let\'s work together',
          email: portfolio.personalInfo?.email || '',
          socialLinks: []
        },
        hiddenSections: portfolio.templateData?.hiddenSections || []
      };
      console.log('Reconstructed data:', reconstructedData);
      setPortfolioData(reconstructedData);
    }
    
    if (portfolio.subdomain) {
      const subdomain = portfolio.subdomain.replace('.portiqqo.me', '');
      console.log('Setting customSubdomain to:', subdomain);
      setCustomSubdomain(subdomain)
    }
    console.log('Setting portfolioId to:', portfolio._id);
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
      name: "John Smith",
      title: "Full Stack Developer",
      specialization: "fullstack", // frontend, backend, fullstack
      description: "Passionate full stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=400&fit=crop",
      location: "San Francisco, CA",
      email: "john@developer.com",
      phone: "+1 (555) 123-4567",
      website: "www.johnsmith.dev",
      github: "https://github.com/johnsmith",
      linkedin: "https://linkedin.com/in/johnsmith"
    },
    techStack: {
      frontend: ["React", "Vue.js", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Python", "PostgreSQL", "MongoDB"],
      tools: ["Git", "Docker", "AWS", "Vercel"],
      other: ["REST APIs", "GraphQL", "CI/CD", "Agile"]
    },
    projects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        category: "fullstack",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        description: "Full-featured e-commerce platform with React frontend, Node.js backend, and Stripe integration.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        liveUrl: "https://ecommerce-demo.com",
        githubUrl: "https://github.com/johnsmith/ecommerce",
        features: ["User Authentication", "Payment Processing", "Admin Dashboard", "Responsive Design"],
        year: "2024"
      },
      {
        id: 2,
        title: "Task Management App",
        category: "frontend",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
        description: "Modern task management application with real-time collaboration features.",
        technologies: ["Vue.js", "TypeScript", "Firebase", "Vuetify"],
        liveUrl: "https://taskmanager-demo.com",
        githubUrl: "https://github.com/johnsmith/taskmanager",
        features: ["Real-time Sync", "Team Collaboration", "Drag & Drop", "Mobile Responsive"],
        year: "2024"
      }
    ],
    skills: [
      { name: "JavaScript", level: 95, category: "frontend" },
      { name: "React", level: 90, category: "frontend" },
      { name: "Node.js", level: 88, category: "backend" },
      { name: "Python", level: 85, category: "backend" },
      { name: "PostgreSQL", level: 82, category: "backend" },
      { name: "AWS", level: 78, category: "tools" }
    ],
    services: [
      {
        icon: "Monitor",
        title: "Frontend Development",
        description: "Modern, responsive web applications using React, Vue.js, and the latest frontend technologies."
      },
      {
        icon: "Server",
        title: "Backend Development", 
        description: "Scalable server-side applications with Node.js, Python, and robust database solutions."
      },
      {
        icon: "Database",
        title: "Database Design",
        description: "Efficient database architecture and optimization for SQL and NoSQL databases."
      },
      {
        icon: "Globe",
        title: "Full Stack Solutions",
        description: "Complete web application development from concept to deployment and maintenance."
      }
    ],
    footer: {
      companyName: "John Smith Development",
      tagline: "Building tomorrow's web solutions today",
      quickStats: {
        projects: "25+",
        experience: "5+ years",
        clients: "40+",
        technologies: "15+"
      },
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/johnsmith", icon: "Github" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/johnsmith", icon: "Globe" },
        { platform: "Portfolio", url: "https://johnsmith.dev", icon: "Monitor" }
      ],
      copyright: "© 2024 John Smith. All rights reserved."
    },
    hiddenSections: []
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [customSubdomain, setCustomSubdomain] = useState('')
  const [hiddenProfileFields, setHiddenProfileFields] = useState([])
  const [hiddenProjectFields, setHiddenProjectFields] = useState({})
  const [hiddenFooterStats, setHiddenFooterStats] = useState([])

  const removeFooterStat = (key) => {
    updateFooterStats(key, '')
    setHiddenFooterStats(prev => [...prev, key])
  }

  const restoreFooterStat = (key) => {
    setHiddenFooterStats(prev => prev.filter(k => k !== key))
  }

  const isFooterStatHidden = (key) => hiddenFooterStats.includes(key)

  const removeProfileField = (field) => {
    updateProfileField(field, '')
    setHiddenProfileFields(prev => [...prev, field])
  }

  const restoreProfileField = (field) => {
    setHiddenProfileFields(prev => prev.filter(f => f !== field))
  }

  const isFieldHidden = (field) => hiddenProfileFields.includes(field)

  const removeProjectField = (projectId, field, emptyValue = '') => {
    updateProject(projectId, field, emptyValue)
    setHiddenProjectFields(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), field]
    }))
  }

  const restoreProjectField = (projectId, field) => {
    setHiddenProjectFields(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(f => f !== field)
    }))
  }

  const isProjectFieldHidden = (projectId, field) =>
    (hiddenProjectFields[projectId] || []).includes(field)

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'api', name: 'APIs' }
  ]

  const specializationOptions = [
    { value: 'frontend', label: 'Frontend Developer', icon: <Monitor className="w-5 h-5" /> },
    { value: 'backend', label: 'Backend Developer', icon: <Server className="w-5 h-5" /> },
    { value: 'fullstack', label: 'Full Stack Developer', icon: <Code className="w-5 h-5" /> }
  ]

  const techStackCategories = [
    { key: 'frontend', name: 'Frontend Technologies', icon: <Monitor className="w-5 h-5" /> },
    { key: 'backend', name: 'Backend Technologies', icon: <Server className="w-5 h-5" /> },
    { key: 'tools', name: 'Tools & Platforms', icon: <Database className="w-5 h-5" /> },
    { key: 'other', name: 'Other Skills', icon: <Code className="w-5 h-5" /> }
  ]

  const filteredProjects = portfolioData && portfolioData.projects
    ? (selectedCategory === 'all' 
        ? portfolioData.projects 
        : portfolioData.projects.filter(project => project.category === selectedCategory))
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
        } else if (editingSection === 'projects') {
          // Handle project image uploads
          console.log('Project image upload:', uploadType, imageUrl)
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

  const updateTechStack = (category, technologies) => {
    setPortfolioData(prev => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: technologies
      }
    }))
  }

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "frontend",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      description: "Project description...",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      features: [],
      year: "2024"
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
    const newSkill = { name: "New Technology", level: 70, category: "frontend" }
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
      icon: "Code",
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

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return <Code className="w-8 h-8" />
      case 'Monitor': return <Monitor className="w-8 h-8" />
      case 'Server': return <Server className="w-8 h-8" />
      case 'Database': return <Database className="w-8 h-8" />
      case 'Globe': return <Globe className="w-8 h-8" />
      case 'Github': return <Github className="w-8 h-8" />
      default: return <Code className="w-8 h-8" />
    }
  }

  const savePortfolio = async () => {
    const savedPortfolio = await savePortfolioToBackend(portfolioData, 'developer', customSubdomain, () => {
      // Trigger feedback modal if user hasn't given feedback yet
      if (!hasGivenFeedback()) {
        triggerFeedbackModal()
      }
    }, portfolioId)
    
    // Update portfolioId with the saved portfolio's ID
    if (savedPortfolio && savedPortfolio.id) {
      console.log('✅ Portfolio saved, updating portfolioId:', savedPortfolio.id);
      setPortfolioId(savedPortfolio.id)
    }
  }

  const publishPortfolio = async () => {
    try {
      console.log('Starting publish process...')
      console.log('Portfolio ID:', portfolioId)
      console.log('Custom subdomain:', customSubdomain)
      
      // First save with subdomain, then publish
      const savedPortfolio = await savePortfolioToBackend(portfolioData, 'developer', customSubdomain, null, portfolioId)
      console.log('Portfolio saved:', savedPortfolio)
      
      // Update portfolioId if we just saved
      if (savedPortfolio && savedPortfolio.id) {
        setPortfolioId(savedPortfolio.id)
        // Also ensure localStorage has the latest ID
        localStorage.setItem('savedPortfolioId', savedPortfolio.id)
      }
      
      const portfolio = await publishPortfolioToBackend('developer')
      console.log('Portfolio published:', portfolio)
      
      if (!portfolio || !portfolio.publicUrl) {
        throw new Error('Failed to get portfolio URL')
      }
      
      // Show success modal with the published link
      setPublishedPortfolio(portfolio)
      setShowPublishModal(true)
    } catch (error) {
      // Error already handled in helper
      console.error('Publish failed:', error)
      toast.error('Failed to publish portfolio. Please try again.')
    }
  }

  if (isPreview) {
    return (
      <div ref={previewRef} className="min-h-screen bg-gray-50">
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
                  onClick={() => { setWantsPDF(true) }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
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

        {/* Full Preview Content */}
        <div className="max-w-7xl mx-auto">
          {/* Banner Section */}
          <div className="relative h-80 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600">
            <img
              src={portfolioData.profile.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <img
                  src={portfolioData.profile.profileImage}
                  alt={portfolioData.profile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <h1 className="text-4xl font-bold mb-2">{portfolioData.profile.name}</h1>
                <p className="text-2xl mb-4">{portfolioData.profile.title}</p>
                <div className="flex items-center justify-center space-x-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  <span>{portfolioData.profile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-8 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">{portfolioData.profile.description}</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <a href={`mailto:${portfolioData.profile.email}`} className="flex items-center text-purple-600 hover:text-purple-700">
                  <Mail className="w-5 h-5 mr-2" />
                  {portfolioData.profile.email}
                </a>
                {portfolioData.profile.phone && (
                  <a href={`tel:${portfolioData.profile.phone}`} className="flex items-center text-purple-600 hover:text-purple-700">
                    <Phone className="w-5 h-5 mr-2" />
                    {portfolioData.profile.phone}
                  </a>
                )}
                {portfolioData.profile.github && (
                  <a href={portfolioData.profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:text-purple-700">
                    <Globe className="w-5 h-5 mr-2" />
                    GitHub
                  </a>
                )}
                {portfolioData.profile.linkedin && (
                  <a href={portfolioData.profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:text-purple-700">
                    <Globe className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                )}
                {portfolioData.profile.website && (
                  <a href={`https://${portfolioData.profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:text-purple-700">
                    <Globe className="w-5 h-5 mr-2" />
                    {portfolioData.profile.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(portfolioData.techStack).map(([category, techs]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech, idx) => (
                        <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-4">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
                            GitHub →
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
                            Live Demo →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills</h2>
              <div className="space-y-4">
                {portfolioData.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {portfolioData.services.map((service, idx) => (
                  <div key={idx} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="text-purple-600 mb-4 flex justify-center">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">{portfolioData.footer.companyName}</h3>
                  <p className="text-gray-400">{portfolioData.footer.tagline}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Stats</h4>
                  <div className="space-y-2 text-gray-400">
                    <div>Projects: {portfolioData.footer.quickStats.projects}</div>
                    <div>Experience: {portfolioData.footer.quickStats.experience}</div>
                    <div>Clients: {portfolioData.footer.quickStats.clients}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Connect</h4>
                  <div className="flex space-x-4">
                    {portfolioData.footer.socialLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                {portfolioData.footer.copyright}
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
                onClick={() => { setIsPreview(true); setWantsPDF(true) }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Developer Portfolio Editor</h1>
          <p className="text-gray-600">Customize your developer portfolio with your projects, tech stack, and professional information.</p>
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
              Developer Profile
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

              {/* Developer Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="grid grid-cols-3 gap-2">
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
                        <span className="text-xs font-medium">{option.label.split(' ')[0]}</span>
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
              {!isFieldHidden('phone') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={portfolioData.profile.phone}
                    onChange={(e) => updateProfileField('phone', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button onClick={() => removeProfileField('phone')} className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              )}
              {!isFieldHidden('website') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={portfolioData.profile.website}
                    onChange={(e) => updateProfileField('website', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button onClick={() => removeProfileField('website')} className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              )}
              {!isFieldHidden('github') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={portfolioData.profile.github}
                    onChange={(e) => updateProfileField('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button onClick={() => removeProfileField('github')} className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              )}
              {!isFieldHidden('linkedin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={portfolioData.profile.linkedin}
                    onChange={(e) => updateProfileField('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button onClick={() => removeProfileField('linkedin')} className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              )}
            </div>

            {/* Restore hidden optional fields */}
            {hiddenProfileFields.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-3">Removed fields — click to add back:</p>
                <div className="flex flex-wrap gap-2">
                  {hiddenProfileFields.map(field => (
                    <button
                      key={field}
                      onClick={() => restoreProfileField(field)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium rounded-lg border border-purple-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add {field.charAt(0).toUpperCase() + field.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Code className="w-6 h-6 mr-2 text-purple-600" />
                Technology Stack
              </h2>
              <button
                onClick={() => toggleSection('techStack')}
                title={isSectionHidden('techStack') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('techStack') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {isSectionHidden('techStack') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isSectionHidden('techStack') ? 'Hidden' : 'Visible'}</span>
              </button>
            </div>
            {isSectionHidden('techStack') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`space-y-6 ${isSectionHidden('techStack') ? 'hidden' : ''}`}>
              {techStackCategories.map((category) => (
                <div key={category.key} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-purple-600 mr-2">{category.icon}</span>
                    {category.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.techStack[category.key].map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        {tech}
                        <button
                          onClick={() => {
                            const newTechs = portfolioData.techStack[category.key].filter((_, i) => i !== index)
                            updateTechStack(category.key, newTechs)
                          }}
                          className="ml-2 w-4 h-4 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <button
                      onClick={() => {
                        const newTech = prompt(`Add new ${category.name.toLowerCase()}:`)
                        if (newTech) {
                          updateTechStack(category.key, [...portfolioData.techStack[category.key], newTech])
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

          {/* Projects Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-purple-600" />
                Projects Portfolio
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSection('projects')}
                  title={isSectionHidden('projects') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('projects') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {isSectionHidden('projects') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isSectionHidden('projects') ? 'Hidden' : 'Visible'}</span>
                </button>
                <button
                  onClick={addProject}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>
            {isSectionHidden('projects') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}

            {/* Project Guide */}
            <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 ${isSectionHidden('projects') ? 'hidden' : ''}`}>
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                How to Add Your Projects
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="text-blue-800 font-medium">Deploy your project to a live URL</p>
                    <p className="text-blue-600 text-sm">Use Vercel, Netlify, Heroku, or any hosting platform</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="text-blue-800 font-medium">Upload code to GitHub</p>
                    <p className="text-blue-600 text-sm">Make sure your repository is public for easy viewing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="text-blue-800 font-medium">Add project details below</p>
                    <p className="text-blue-600 text-sm">Include live URL, GitHub link, and description</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isSectionHidden('projects') ? 'hidden' : ''}`}>
              {portfolioData.projects.map((project, index) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="relative group mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageUpload('image', 'projects')}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-md"
                      title="Delete project"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Title */}
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />

                    {/* Category + Year */}
                    <div className="grid grid-cols-2 gap-2">
                      {!isProjectFieldHidden(project.id, 'category') ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <div className="flex items-center gap-2">
                            <select
                              value={project.category}
                              onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="">— None —</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                              <option value="fullstack">Full Stack</option>
                              <option value="mobile">Mobile</option>
                              <option value="api">API</option>
                            </select>
                            <button
                              onClick={() => removeProjectField(project.id, 'category', '')}
                              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : <div />}
                      {!isProjectFieldHidden(project.id, 'year') ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={project.year}
                              onChange={(e) => updateProject(project.id, 'year', e.target.value)}
                              placeholder="e.g. 2024"
                              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => removeProjectField(project.id, 'year', '')}
                              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Description */}
                    {!isProjectFieldHidden(project.id, 'description') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="flex items-start gap-2">
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Project description..."
                            rows={2}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeProjectField(project.id, 'description', '')}
                            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors mt-1"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Live URL */}
                    {!isProjectFieldHidden(project.id, 'liveUrl') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={project.liveUrl}
                            onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                            placeholder="https://project-demo.com"
                            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeProjectField(project.id, 'liveUrl', '')}
                            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* GitHub URL */}
                    {!isProjectFieldHidden(project.id, 'githubUrl') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository URL</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={project.githubUrl}
                            onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeProjectField(project.id, 'githubUrl', '')}
                            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Technologies Used */}
                    {!isProjectFieldHidden(project.id, 'technologies') && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                          <button
                            onClick={() => removeProjectField(project.id, 'technologies', [])}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', ').filter(t => t))}
                          placeholder="React, Node.js, MongoDB, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Key Features */}
                    {!isProjectFieldHidden(project.id, 'features') && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">Key Features</label>
                          <button
                            onClick={() => removeProjectField(project.id, 'features', [])}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={project.features.join(', ')}
                          onChange={(e) => updateProject(project.id, 'features', e.target.value.split(', ').filter(f => f))}
                          placeholder="Authentication, Real-time chat, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Restore strip */}
                    {(hiddenProjectFields[project.id] || []).length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-2">Removed fields — click to add back:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(hiddenProjectFields[project.id] || []).map(field => (
                            <button
                              key={field}
                              onClick={() => restoreProjectField(project.id, field)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium rounded-lg border border-purple-200 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              Add {field === 'liveUrl' ? 'Live URL' : field === 'githubUrl' ? 'GitHub URL' : field.charAt(0).toUpperCase() + field.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                <Database className="w-6 h-6 mr-2 text-purple-600" />
                Skills & Proficiency
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSection('skills')}
                  title={isSectionHidden('skills') ? 'Click to show on portfolio' : 'Click to hide from portfolio'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSectionHidden('skills') ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {isSectionHidden('skills') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isSectionHidden('skills') ? 'Hidden' : 'Visible'}</span>
                </button>
                <button
                  onClick={addSkill}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>
            {isSectionHidden('skills') && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">⚠ This section is hidden — it won't appear on your published portfolio.</p>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isSectionHidden('skills') ? 'hidden' : ''}`}>
              {portfolioData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Technology name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="tools">Tools</option>
                    <option value="other">Other</option>
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
                <Monitor className="w-6 h-6 mr-2 text-purple-600" />
                Services
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
                      <option value="Code">Code</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Server">Server</option>
                      <option value="Database">Database</option>
                      <option value="Globe">Globe</option>
                      <option value="Github">Github</option>
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

          {/* Footer Section - Same as video editor */}
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
                      placeholder="Your Development Company"
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
                  {[
                    { key: 'projects', label: 'Projects', placeholder: '25+' },
                    { key: 'experience', label: 'Experience', placeholder: '5+ years' },
                    { key: 'clients', label: 'Clients', placeholder: '40+' },
                    { key: 'technologies', label: 'Technologies', placeholder: '15+' },
                  ].filter(({ key }) => !isFooterStatHidden(key)).map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={portfolioData.footer.quickStats[key]}
                          onChange={(e) => updateFooterStats(key, e.target.value)}
                          placeholder={placeholder}
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeFooterStat(key)}
                          className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {hiddenFooterStats.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">Removed stats — click to add back:</p>
                    <div className="flex flex-wrap gap-2">
                      {hiddenFooterStats.map(key => (
                        <button
                          key={key}
                          onClick={() => restoreFooterStat(key)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium rounded-lg border border-purple-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                          placeholder="GitHub"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="https://github.com/username"
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
                          <option value="Github">Github</option>
                          <option value="Globe">Globe</option>
                          <option value="Monitor">Monitor</option>
                          <option value="Mail">Mail</option>
                          <option value="Phone">Phone</option>
                          <option value="Code">Code</option>
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

      {/* Upload Modal - Same as video editor */}
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
        onClose={() => {
          setShowPublishModal(false)
          // Don't auto-navigate, let user stay on editor or manually go to dashboard
        }}
        portfolioUrl={publishedPortfolio?.publicUrl || ''}
        subdomain={publishedPortfolio?.subdomain || ''}
      />
    </div>
  )
}

export default WebDeveloperTemplateEditor