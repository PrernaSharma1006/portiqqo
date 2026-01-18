import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  User, 
  Briefcase,
  Image,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye,
  Download,
  Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function GeneralPortfolioBuilder() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [portfolioData, setPortfolioData] = useState({
    portfolioType: '',
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      avatar: '',
      resume: null
    },
    projects: [],
    isComplete: false
  })

  const steps = [
    { id: 1, title: 'Portfolio Type', icon: <Briefcase className="w-5 h-5" /> },
    { id: 2, title: 'Upload Work', icon: <Upload className="w-5 h-5" /> },
    { id: 3, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 4, title: 'Preview', icon: <Eye className="w-5 h-5" /> },
    { id: 5, title: 'Publish', icon: <Download className="w-5 h-5" /> }
  ]

  const portfolioTypes = [
    { id: 'ui-ux-designer', name: 'UI/UX Designer', icon: '🎨', description: 'Design interfaces and user experiences' },
    { id: 'photographer', name: 'Photographer', icon: '📸', description: 'Capture and showcase visual stories' },
    { id: 'video-editor', name: 'Video Editor', icon: '🎬', description: 'Create and edit video content' },
    { id: 'web-developer', name: 'Web Developer', icon: '💻', description: 'Build websites and web applications' },
    { id: 'illustrator', name: 'Illustrator', icon: '🎭', description: 'Create digital and traditional artwork' },
    { id: 'digital-marketer', name: 'Digital Marketer', icon: '📈', description: 'Promote brands through digital channels' },
    { id: 'architect', name: 'Architect', icon: '🏗️', description: 'Design buildings and spaces' },
    { id: 'writer', name: 'Writer', icon: '✍️', description: 'Create written content and stories' },
    { id: 'musician', name: 'Musician', icon: '🎵', description: 'Compose and perform music' },
    { id: 'other', name: 'Other', icon: '🌟', description: 'Something else creative' }
  ]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updatePortfolioData = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updatePersonalInfo = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const addProject = (project) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: Date.now() }]
    }))
  }

  const removeProject = (projectId) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return portfolioData.portfolioType !== ''
      case 2:
        return portfolioData.projects.length > 0
      case 3:
        return portfolioData.personalInfo.name && portfolioData.personalInfo.email
      case 4:
        return true
      default:
        return false
    }
  }

  const handlePublish = () => {
    // Generate unique portfolio ID
    const portfolioId = portfolioData.personalInfo.name.toLowerCase().replace(/\s+/g, '-')
    
    // Save portfolio data to localStorage
    const storedPortfolios = JSON.parse(localStorage.getItem('portfolios') || '{}')
    storedPortfolios[portfolioId] = portfolioData
    localStorage.setItem('portfolios', JSON.stringify(storedPortfolios))
    
    // Redirect to the actual portfolio page
    const portfolioUrl = `/portfolio/${portfolioId}`
    alert(`🎉 Portfolio published successfully!\\n\\nYour portfolio is now live!`)
    navigate(portfolioUrl)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PortfolioTypeStep portfolioData={portfolioData} updatePortfolioData={updatePortfolioData} />
      case 2:
        return <WorkUploadStep portfolioData={portfolioData} addProject={addProject} removeProject={removeProject} />
      case 3:
        return <PersonalInfoStep portfolioData={portfolioData} updatePersonalInfo={updatePersonalInfo} />
      case 4:
        return <PreviewStep portfolioData={portfolioData} />
      case 5:
        return <PublishStep portfolioData={portfolioData} onPublish={handlePublish} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-xl font-bold text-gray-900">Portiqqo</h1>
                <p className="text-sm text-gray-600">Create your professional portfolio in minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              <span>Step {currentStep} of {steps.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-4 transition-all duration-200 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === 4 ? 'Publish' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Step Components
function PortfolioTypeStep({ portfolioData, updatePortfolioData }) {
  const portfolioTypes = [
    { id: 'ui-ux-designer', name: 'UI/UX Designer', icon: '🎨', description: 'Design interfaces and user experiences' },
    { id: 'photographer', name: 'Photographer', icon: '📸', description: 'Capture and showcase visual stories' },
    { id: 'video-editor', name: 'Video Editor', icon: '🎬', description: 'Create and edit video content' },
    { id: 'web-developer', name: 'Web Developer', icon: '💻', description: 'Build websites and web applications' },
    { id: 'illustrator', name: 'Illustrator', icon: '🎭', description: 'Create digital and traditional artwork' },
    { id: 'digital-marketer', name: 'Digital Marketer', icon: '📈', description: 'Promote brands through digital channels' },
    { id: 'architect', name: 'Architect', icon: '🏗️', description: 'Design buildings and spaces' },
    { id: 'writer', name: 'Writer', icon: '✍️', description: 'Create written content and stories' },
    { id: 'musician', name: 'Musician', icon: '🎵', description: 'Compose and perform music' },
    { id: 'other', name: 'Other', icon: '🌟', description: 'Something else creative' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What type of portfolio do you want to create?</h2>
        <p className="text-gray-600">Choose the category that best describes your work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => updatePortfolioData('portfolioType', type.id)}
            className={`p-6 text-left border-2 rounded-lg transition-all duration-200 ${
              portfolioData.portfolioType === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-3">{type.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function WorkUploadStep({ portfolioData, addProject, removeProject }) {
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    technologies: ''
  })

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      addProject({
        ...newProject,
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t)
      })
      setNewProject({ title: '', description: '', image: '', url: '', technologies: '' })
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // In a real app, you'd upload to a cloud service
      const fileUrl = URL.createObjectURL(file)
      setNewProject(prev => ({ ...prev, image: fileUrl }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Work</h2>
        <p className="text-gray-600">Add projects to showcase your skills and experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Project */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Project</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {newProject.image && (
              <img src={newProject.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
            <input
              type="url"
              value={newProject.url}
              onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
            <input
              type="text"
              value={newProject.technologies}
              onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="React, JavaScript, CSS (comma-separated)"
            />
          </div>

          <button
            onClick={handleAddProject}
            disabled={!newProject.title || !newProject.description}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Current Projects */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Projects ({portfolioData.projects.length})</h3>
          
          {portfolioData.projects.length > 0 ? (
            <div className="space-y-4">
              {portfolioData.projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      {project.image && (
                        <img src={project.image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                      )}
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No projects added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PersonalInfoStep({ portfolioData, updatePersonalInfo }) {
  const handleResumeUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      updatePersonalInfo('resume', file)
    } else {
      alert('Please upload a PDF file for your resume.')
    }
  }

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file)
      updatePersonalInfo('avatar', fileUrl)
    } else {
      alert('Please upload an image file for your profile picture.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Personal Information</h2>
        <p className="text-gray-600">This information will be used for your portfolio footer and contact section</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={portfolioData.personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
          <input
            type="text"
            value={portfolioData.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., UI/UX Designer, Photographer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={portfolioData.personalInfo.bio}
            onChange={(e) => updatePersonalInfo('bio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Tell visitors about yourself and your work..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={portfolioData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={portfolioData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={portfolioData.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City, State/Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={portfolioData.personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {portfolioData.personalInfo.avatar && (
            <img src={portfolioData.personalInfo.avatar} alt="Profile" className="mt-2 w-20 h-20 rounded-full object-cover" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {portfolioData.personalInfo.resume && (
            <p className="mt-2 text-sm text-green-600">✓ Resume uploaded: {portfolioData.personalInfo.resume.name}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewStep({ portfolioData }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Preview</h2>
        <p className="text-gray-600">Here's how your portfolio will look to visitors</p>
      </div>

      {/* Hero Section Preview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="text-center">
          {portfolioData.personalInfo.avatar && (
            <img 
              src={portfolioData.personalInfo.avatar} 
              alt={portfolioData.personalInfo.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{portfolioData.personalInfo.name}</h1>
          <p className="text-xl text-blue-100 mb-4">{portfolioData.personalInfo.title}</p>
          {portfolioData.personalInfo.bio && (
            <p className="text-blue-100 max-w-2xl mx-auto">{portfolioData.personalInfo.bio}</p>
          )}
        </div>
      </div>

      {/* Projects Section Preview */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">My Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section Preview */}
      <div className="bg-gray-900 text-white rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {portfolioData.personalInfo.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>{portfolioData.personalInfo.email}</span>
              </div>
            )}
            {portfolioData.personalInfo.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>{portfolioData.personalInfo.phone}</span>
              </div>
            )}
            {portfolioData.personalInfo.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>{portfolioData.personalInfo.location}</span>
              </div>
            )}
            {portfolioData.personalInfo.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>{portfolioData.personalInfo.website}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            {portfolioData.personalInfo.resume && (
              <a href="#" className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PublishStep({ portfolioData, onPublish }) {
  const generateSubdomain = () => {
    return portfolioData.personalInfo.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  const portfolioUrl = `https://${generateSubdomain()}.portfolio-builder.com`

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Publish!</h2>
        <p className="text-gray-600 mb-6">Your portfolio is ready to go live. Here's your unique URL:</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-lg font-mono text-blue-600">{portfolioUrl}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Your portfolio will be published to the web</li>
            <li>✓ You'll get a unique subdomain URL to share</li>
            <li>✓ Your portfolio will be mobile-friendly and fast</li>
            <li>✓ You can update your portfolio anytime</li>
          </ul>
        </div>

        <button
          onClick={onPublish}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          🚀 Publish My Portfolio
        </button>
      </div>
    </div>
  )
}

export default GeneralPortfolioBuilder