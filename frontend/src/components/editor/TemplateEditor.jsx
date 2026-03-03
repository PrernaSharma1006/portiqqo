import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Eye, 
  Upload, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Move, 
  Image, 
  FileText, 
  Video,
  ArrowLeft,
  Download
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentSelector from './ComponentSelector'
import WorkUploader from './WorkUploader'
import ComponentEditor from './ComponentEditor'

function TemplateEditor() {
  const navigate = useNavigate()
  const { templateType } = useParams()
  const [template, setTemplate] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showComponentSelector, setShowComponentSelector] = useState(false)
  const [showWorkUploader, setShowWorkUploader] = useState(false)
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      email: '',
      phone: '',
      location: ''
    },
    projects: [],
    skills: [],
    experience: [],
    testimonials: [],
    services: []
  })

  // Template component configurations
  const availableComponents = {
    hero: {
      name: 'Hero Section',
      description: 'Main introduction section with name and title',
      required: true,
      icon: <FileText className="w-5 h-5" />
    },
    about: {
      name: 'About Section',
      description: 'Personal introduction and biography',
      required: false,
      icon: <FileText className="w-5 h-5" />
    },
    projects: {
      name: 'Projects/Portfolio',
      description: 'Showcase your work and projects',
      required: false,
      icon: <Image className="w-5 h-5" />
    },
    skills: {
      name: 'Skills Section',
      description: 'Display your technical skills and expertise',
      required: false,
      icon: <Settings className="w-5 h-5" />
    },
    experience: {
      name: 'Experience Section',
      description: 'Work history and professional experience',
      required: false,
      icon: <FileText className="w-5 h-5" />
    },
    services: {
      name: 'Services Section',
      description: 'Services you offer to clients',
      required: false,
      icon: <Settings className="w-5 h-5" />
    },
    testimonials: {
      name: 'Testimonials',
      description: 'Client reviews and recommendations',
      required: false,
      icon: <FileText className="w-5 h-5" />
    },
    contact: {
      name: 'Contact Section',
      description: 'Contact information and form',
      required: true,
      icon: <FileText className="w-5 h-5" />
    }
  }

  const [activeComponents, setActiveComponents] = useState([
    'hero',
    'about',
    'projects',
    'skills',
    'contact'
  ])

  useEffect(() => {
    // Initialize template based on type
    if (templateType) {
      loadTemplate(templateType)
    }
  }, [templateType])

  const loadTemplate = (type) => {
    // Load template configuration based on type
    const templateConfigs = {
      'web-developer': {
        name: 'Web Developer Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'skills', 'experience', 'contact'],
        theme: 'blue'
      },
      'ui-ux-designer': {
        name: 'UI/UX Designer Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'skills', 'testimonials', 'contact'],
        theme: 'purple'
      },
      'photographer': {
        name: 'Photographer Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'services', 'contact'],
        theme: 'dark'
      },
      'video-editor': {
        name: 'Video Editor Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'services', 'contact'],
        theme: 'red'
      },
      'illustrator': {
        name: 'Illustrator Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'skills', 'services', 'contact'],
        theme: 'purple'
      },
      'digital-marketer': {
        name: 'Digital Marketer Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'skills', 'experience', 'contact'],
        theme: 'blue'
      },
      'architect': {
        name: 'Architect Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'services', 'contact'],
        theme: 'blue'
      },
      'general': {
        name: 'General Portfolio',
        defaultComponents: ['hero', 'about', 'projects', 'skills', 'experience', 'contact'],
        theme: 'indigo'
      }
    }

    const config = templateConfigs[type] || templateConfigs['general']
    setTemplate(config)
    setActiveComponents(config.defaultComponents)
  }

  const handleAddComponent = (componentId) => {
    if (!activeComponents.includes(componentId)) {
      setActiveComponents([...activeComponents, componentId])
    }
    setShowComponentSelector(false)
  }

  const handleRemoveComponent = (componentId) => {
    if (!availableComponents[componentId]?.required) {
      setActiveComponents(activeComponents.filter(id => id !== componentId))
    }
  }

  const handleMoveComponent = (componentId, direction) => {
    const currentIndex = activeComponents.indexOf(componentId)
    if (direction === 'up' && currentIndex > 0) {
      const newComponents = [...activeComponents]
      newComponents[currentIndex] = newComponents[currentIndex - 1]
      newComponents[currentIndex - 1] = componentId
      setActiveComponents(newComponents)
    } else if (direction === 'down' && currentIndex < activeComponents.length - 1) {
      const newComponents = [...activeComponents]
      newComponents[currentIndex] = newComponents[currentIndex + 1]
      newComponents[currentIndex + 1] = componentId
      setActiveComponents(newComponents)
    }
  }

  const handleSavePortfolio = async () => {
    try {
      // Save portfolio data to backend
      const portfolioConfig = {
        templateType,
        activeComponents,
        portfolioData,
        theme: template?.theme
      }
      
      // API call to save portfolio
      console.log('Saving portfolio:', portfolioConfig)
      
      // Show success message
      alert('Portfolio saved successfully!')
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Error saving portfolio. Please try again.')
    }
  }

  const handlePublishPortfolio = async () => {
    try {
      // Publish portfolio
      await handleSavePortfolio()
      
      // Generate unique URL or subdomain
      const portfolioUrl = `https://${portfolioData.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}.portfolio-builder.com`
      
      alert(`Portfolio published successfully! Your portfolio is now live at: ${portfolioUrl}`)
    } catch (error) {
      console.error('Error publishing portfolio:', error)
      alert('Error publishing portfolio. Please try again.')
    }
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Templates</span>
              </button>
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                <p className="text-sm text-gray-600">Customize your portfolio</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPreviewMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>

              <button
                onClick={handlePublishPortfolio}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreviewMode ? (
          // Preview Mode
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Preview</h2>
              <p className="text-gray-600">This is how your portfolio will look to visitors</p>
            </div>
            {/* Preview content would be rendered here */}
            <div className="space-y-8">
              {activeComponents.map((componentId) => (
                <div key={componentId} className="border-2 border-dashed border-gray-200 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{availableComponents[componentId]?.name}</h3>
                  <p className="text-gray-600">{availableComponents[componentId]?.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Component Management */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Components</h3>
                  <button
                    onClick={() => setShowComponentSelector(true)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {activeComponents.map((componentId, index) => (
                    <div key={componentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {availableComponents[componentId]?.icon}
                        <span className="font-medium">{availableComponents[componentId]?.name}</span>
                        {availableComponents[componentId]?.required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedComponent(componentId)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveComponent(componentId, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Move className="w-4 h-4 rotate-180" />
                        </button>

                        <button
                          onClick={() => handleMoveComponent(componentId, 'down')}
                          disabled={index === activeComponents.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Move className="w-4 h-4" />
                        </button>

                        {!availableComponents[componentId]?.required && (
                          <button
                            onClick={() => handleRemoveComponent(componentId)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowWorkUploader(true)}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Work</span>
                  </button>

                  <button
                    onClick={() => setSelectedComponent('personalInfo')}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Personal Info</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedComponent ? (
                <ComponentEditor
                  componentId={selectedComponent}
                  portfolioData={portfolioData}
                  setPortfolioData={setPortfolioData}
                  onClose={() => setSelectedComponent(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Component</h3>
                    <p className="text-gray-600 mb-6">
                      Choose a component from the sidebar to start customizing your portfolio.
                    </p>
                    <button
                      onClick={() => setShowWorkUploader(true)}
                      className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Your Work</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showComponentSelector && (
        <ComponentSelector
          availableComponents={availableComponents}
          activeComponents={activeComponents}
          onAddComponent={handleAddComponent}
          onClose={() => setShowComponentSelector(false)}
        />
      )}

      {showWorkUploader && (
        <WorkUploader
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          onClose={() => setShowWorkUploader(false)}
        />
      )}
    </div>
  )
}

export default TemplateEditor