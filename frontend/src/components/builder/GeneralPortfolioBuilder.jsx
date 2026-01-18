import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  User, 
  FileText, 
  Image, 
  Video, 
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  Save,
  Globe
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const professionTypes = [
  { id: 'ui-ux', name: 'UI/UX Designer', icon: '🎨', description: 'Digital interface and user experience design' },
  { id: 'photographer', name: 'Photographer', icon: '📸', description: 'Photography and visual storytelling' },
  { id: 'video-editor', name: 'Video Editor', icon: '🎬', description: 'Video editing and motion graphics' },
  { id: 'graphic-designer', name: 'Graphic Designer', icon: '🖼️', description: 'Visual communication and brand design' },
  { id: 'web-developer', name: 'Web Developer', icon: '💻', description: 'Website and web application development' },
  { id: 'writer', name: 'Writer/Content Creator', icon: '✍️', description: 'Writing, blogging, and content creation' },
  { id: 'marketing', name: 'Digital Marketer', icon: '📊', description: 'Digital marketing and social media' },
  { id: 'consultant', name: 'Consultant', icon: '💼', description: 'Business consulting and strategy' },
  { id: 'artist', name: 'Artist/Illustrator', icon: '🎭', description: 'Fine arts and illustration' },
  { id: 'other', name: 'Other', icon: '🌟', description: 'Tell us about your unique profession' }
]

function GeneralPortfolioBuilder() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [portfolioData, setPortfolioData] = useState({
    professionType: '',
    customProfession: '',
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      twitter: '',
      instagram: ''
    },
    projects: [],
    skills: [],
    services: []
  })

  const steps = [
    { id: 1, title: 'Choose Profession', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Personal Information', icon: <FileText className="w-5 h-5" /> },
    { id: 3, title: 'Upload Work', icon: <Upload className="w-5 h-5" /> },
    { id: 4, title: 'Contact Information', icon: <User className="w-5 h-5" /> },
    { id: 5, title: 'Preview & Publish', icon: <Eye className="w-5 h-5" /> }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updatePortfolioData = (section, data) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
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

  // Step 1: Choose Profession Type
  const renderProfessionSelector = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What type of portfolio do you want to create?</h2>
        <p className="text-lg text-gray-600">Choose the profession that best describes your work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionTypes.map((profession) => (
          <motion.button
            key={profession.id}
            onClick={() => {
              updatePortfolioData('professionType', profession.id)
              if (profession.id !== 'other') {
                updatePortfolioData('personalInfo', {
                  ...portfolioData.personalInfo,
                  title: profession.name
                })
              }
            }}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg ${
              portfolioData.professionType === profession.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-4xl mb-3">{profession.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{profession.name}</h3>
            <p className="text-gray-600">{profession.description}</p>
          </motion.button>
        ))}
      </div>

      {portfolioData.professionType === 'other' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 max-w-md mx-auto"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your profession?
          </label>
          <input
            type="text"
            value={portfolioData.customProfession}
            onChange={(e) => {
              updatePortfolioData('customProfession', e.target.value)
              updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                title: e.target.value
              })
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Interior Designer, Chef, Musician..."
          />
        </motion.div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={handleNext}
          disabled={!portfolioData.professionType || (portfolioData.professionType === 'other' && !portfolioData.customProfession)}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Step 2: Personal Information
  const renderPersonalInfo = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about yourself</h2>
        <p className="text-lg text-gray-600">This information will appear in your portfolio header</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={portfolioData.personalInfo.name}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                name: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title *
            </label>
            <input
              type="text"
              value={portfolioData.personalInfo.title}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                title: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior UI/UX Designer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
          </label>
          <textarea
            value={portfolioData.personalInfo.bio}
            onChange={(e) => updatePortfolioData('personalInfo', {
              ...portfolioData.personalInfo,
              bio: e.target.value
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your professional background, expertise, and what makes you unique..."
          />
          <p className="text-sm text-gray-500 mt-1">This will appear in your about section</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture URL
          </label>
          <input
            type="url"
            value={portfolioData.personalInfo.avatar}
            onChange={(e) => updatePortfolioData('personalInfo', {
              ...portfolioData.personalInfo,
              avatar: e.target.value
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/your-photo.jpg"
          />
          {portfolioData.personalInfo.avatar && (
            <div className="mt-3">
              <img
                src={portfolioData.personalInfo.avatar}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!portfolioData.personalInfo.name || !portfolioData.personalInfo.title}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Step 3: Upload Work
  const renderWorkUpload = () => {
    const [newProject, setNewProject] = useState({
      title: '',
      description: '',
      image: '',
      url: '',
      category: '',
      tags: ''
    })

    const handleAddProject = () => {
      if (newProject.title && newProject.description) {
        addProject({
          ...newProject,
          tags: newProject.tags ? newProject.tags.split(',').map(tag => tag.trim()) : []
        })
        setNewProject({
          title: '',
          description: '',
          image: '',
          url: '',
          category: '',
          tags: ''
        })
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Showcase Your Work</h2>
          <p className="text-lg text-gray-600">Add your best projects and portfolio pieces</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Project Form */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image URL
                </label>
                <input
                  type="url"
                  value={newProject.image}
                  onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={newProject.url}
                  onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourproject.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Web Design, Mobile App, Branding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills/Technologies Used
                </label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Figma, Photoshop (comma separated)"
                />
              </div>

              <button
                onClick={handleAddProject}
                disabled={!newProject.title || !newProject.description}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {/* Current Projects */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Projects ({portfolioData.projects.length})</h3>
            {portfolioData.projects.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {portfolioData.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...`
                            : project.description
                          }
                        </p>
                        {project.category && (
                          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {project.category}
                          </span>
                        )}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="text-sm">View Project</span>
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-12 h-12 rounded object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <button
                          onClick={() => removeProject(project.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No projects added yet</p>
                <p className="text-sm text-gray-500">Add your first project using the form</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Step 4: Contact Information
  const renderContactInfo = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-lg text-gray-600">How should potential clients reach you?</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={portfolioData.personalInfo.email}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                email: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={portfolioData.personalInfo.phone}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                phone: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={portfolioData.personalInfo.location}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                location: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={portfolioData.personalInfo.website}
              onChange={(e) => updatePortfolioData('personalInfo', {
                ...portfolioData.personalInfo,
                website: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={portfolioData.personalInfo.linkedin}
                onChange={(e) => updatePortfolioData('personalInfo', {
                  ...portfolioData.personalInfo,
                  linkedin: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={portfolioData.personalInfo.instagram}
                onChange={(e) => updatePortfolioData('personalInfo', {
                  ...portfolioData.personalInfo,
                  instagram: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!portfolioData.personalInfo.email}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Preview Portfolio</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Step 5: Preview & Publish
  const renderPreviewAndPublish = () => {
    const [subdomain, setSubdomain] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)

    const generateSubdomain = () => {
      const name = portfolioData.personalInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      return `${name}-portfolio`
    }

    const handlePublish = async () => {
      setIsPublishing(true)
      // Simulate publishing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const finalSubdomain = subdomain || generateSubdomain()
      const portfolioUrl = `https://${finalSubdomain}.portfolio-builder.com`
      
      alert(`🎉 Your portfolio is now live at: ${portfolioUrl}`)
      setIsPublishing(false)
      navigate('/')
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview Your Portfolio</h2>
          <p className="text-lg text-gray-600">Review your portfolio before publishing</p>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
          {/* Header */}
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            {portfolioData.personalInfo.avatar && (
              <img
                src={portfolioData.personalInfo.avatar}
                alt={portfolioData.personalInfo.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{portfolioData.personalInfo.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{portfolioData.personalInfo.title}</p>
            {portfolioData.personalInfo.bio && (
              <p className="text-gray-700 max-w-2xl mx-auto">{portfolioData.personalInfo.bio}</p>
            )}
          </div>

          {/* Projects */}
          {portfolioData.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData.projects.slice(0, 6).map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description.substring(0, 80)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get In Touch</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {portfolioData.personalInfo.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">✉️</span>
                  <span>{portfolioData.personalInfo.email}</span>
                </div>
              )}
              {portfolioData.personalInfo.phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">📱</span>
                  <span>{portfolioData.personalInfo.phone}</span>
                </div>
              )}
              {portfolioData.personalInfo.location && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">📍</span>
                  <span>{portfolioData.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publish Options */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Portfolio URL</h3>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">https://</span>
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder={generateSubdomain()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-600">.portfolio-builder.com</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Leave empty to use: {generateSubdomain()}.portfolio-builder.com
          </p>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                <span>Publish Portfolio</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProfessionSelector()
      case 2:
        return renderPersonalInfo()
      case 3:
        return renderWorkUpload()
      case 4:
        return renderContactInfo()
      case 5:
        return renderPreviewAndPublish()
      default:
        return renderProfessionSelector()
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
                <h1 className="text-xl font-bold text-gray-900">Create Portfolio</h1>
                <p className="text-sm text-gray-600">Build your professional portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.id
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : currentStep > step.id
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
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
                  <div className={`hidden sm:block w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default GeneralPortfolioBuilder