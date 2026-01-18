import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Briefcase, 
  Upload, 
  Eye,
  Globe,
  FileText,
  Image,
  Video,
  Award,
  Users,
  Settings
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

// Step Components
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkShowcaseStep from './steps/WorkShowcaseStep'
import ContactInfoStep from './steps/ContactInfoStep'
import ResumeUploadStep from './steps/ResumeUploadStep'
import PortfolioPreview from './steps/PortfolioPreview'
import SubdomainStep from './steps/SubdomainStep'

function EasyTemplateEditor() {
  const navigate = useNavigate()
  const { templateType } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [portfolioData, setPortfolioData] = useState({
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
      github: '',
      twitter: ''
    },
    projects: [],
    skills: [],
    experience: [],
    testimonials: [],
    services: [],
    resumeFile: null,
    subdomain: ''
  })

  const steps = [
    {
      id: 0,
      title: 'Personal Info',
      subtitle: 'Tell us about yourself',
      icon: <User className="w-6 h-6" />,
      component: PersonalInfoStep,
      description: 'Add your basic information, photo, and professional details'
    },
    {
      id: 1,
      title: 'Work Showcase',
      subtitle: 'Add your best work',
      icon: <Briefcase className="w-6 h-6" />,
      component: WorkShowcaseStep,
      description: 'Upload projects, add skills, experience, and testimonials'
    },
    {
      id: 2,
      title: 'Contact Details',
      subtitle: 'How clients can reach you',
      icon: <Users className="w-6 h-6" />,
      component: ContactInfoStep,
      description: 'Add contact information and social media links'
    },
    {
      id: 3,
      title: 'Resume Upload',
      subtitle: 'Upload your resume',
      icon: <FileText className="w-6 h-6" />,
      component: ResumeUploadStep,
      description: 'Add your resume PDF for download'
    },
    {
      id: 4,
      title: 'Preview',
      subtitle: 'See your portfolio',
      icon: <Eye className="w-6 h-6" />,
      component: PortfolioPreview,
      description: 'Review how your portfolio will look to visitors'
    },
    {
      id: 5,
      title: 'Publish',
      subtitle: 'Get your subdomain',
      icon: <Globe className="w-6 h-6" />,
      component: SubdomainStep,
      description: 'Choose your portfolio URL and publish'
    }
  ]

  const getCurrentStepComponent = () => {
    const StepComponent = steps[currentStep].component
    
    // Special handling for Preview step
    if (currentStep === 4) {
      return (
        <StepComponent 
          portfolioData={portfolioData}
          templateType={templateType}
          onNext={handleNext}
          onEdit={() => setCurrentStep(0)} // Go back to first step for editing
        />
      )
    }
    
    // Special handling for Subdomain/Publish step
    if (currentStep === 5) {
      return (
        <StepComponent 
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          onComplete={() => navigate('/')} // Return to home after completion
        />
      )
    }
    
    // Default step handling
    return (
      <StepComponent 
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
        templateType={templateType}
        onStepComplete={handleStepComplete}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    )
  }

  const handleStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const getTemplateInfo = () => {
    const templateConfigs = {
      'web-developer': {
        name: 'Web Developer Portfolio',
        theme: 'blue',
        primaryColor: 'blue-600'
      },
      'ui-ux-designer': {
        name: 'UI/UX Designer Portfolio',
        theme: 'purple',
        primaryColor: 'purple-600'
      },
      'photographer': {
        name: 'Photographer Portfolio',
        theme: 'dark',
        primaryColor: 'gray-900'
      },
      'video-editor': {
        name: 'Video Editor Portfolio',
        theme: 'red',
        primaryColor: 'red-600'
      },
      'illustrator': {
        name: 'Illustrator Portfolio',
        theme: 'purple',
        primaryColor: 'purple-600'
      },
      'digital-marketer': {
        name: 'Digital Marketer Portfolio',
        theme: 'blue',
        primaryColor: 'blue-600'
      },
      'architect': {
        name: 'Architect Portfolio',
        theme: 'blue',
        primaryColor: 'blue-600'
      },
      'general': {
        name: 'General Portfolio',
        theme: 'indigo',
        primaryColor: 'indigo-600'
      }
    }
    
    return templateConfigs[templateType] || templateConfigs['general']
  }

  const templateInfo = getTemplateInfo()
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
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
                <h1 className="text-xl font-bold text-gray-900">Create Your {templateInfo.name}</h1>
                <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600">Progress</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`bg-${templateInfo.primaryColor} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-6">Setup Steps</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id)
                  const isCurrent = currentStep === index
                  const isAccessible = index <= currentStep

                  return (
                    <motion.button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      disabled={!isAccessible}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        isCurrent
                          ? `border-${templateInfo.primaryColor} bg-blue-50`
                          : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : isAccessible
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                      whileHover={isAccessible ? { scale: 1.02 } : {}}
                      whileTap={isAccessible ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? `bg-${templateInfo.primaryColor} text-white`
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold ${
                            isCurrent ? `text-${templateInfo.primaryColor}` : 'text-gray-900'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  {steps[currentStep].description}
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View Tutorial →
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow"
              >
                {getCurrentStepComponent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? `bg-${templateInfo.primaryColor}`
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className={`flex items-center space-x-2 px-6 py-3 text-white bg-${templateInfo.primaryColor} rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EasyTemplateEditor