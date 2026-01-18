import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Code, Palette, Camera, Film, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const professionTemplates = [
  {
    id: 'developer',
    name: 'Web Developer',
    icon: <Code className="w-8 h-8" />,
    description: 'Showcase your coding projects, GitHub repos, and technical skills',
    color: 'bg-blue-500',
    features: ['Project Gallery', 'GitHub Integration', 'Code Snippets', 'Tech Stack Display']
  },
  {
    id: 'designer',
    name: 'UI/UX Designer',
    icon: <Palette className="w-8 h-8" />,
    description: 'Display your design portfolio, case studies, and creative process',
    color: 'bg-purple-500',
    features: ['Case Studies', 'Wireframe Gallery', 'Design Process', 'Client Testimonials']
  },
  {
    id: 'photographer',
    name: 'Photographer',
    icon: <Camera className="w-8 h-8" />,
    description: 'Beautiful galleries to showcase your photography work',
    color: 'bg-green-500',
    features: ['Photo Galleries', 'Lightbox View', 'EXIF Data', 'Print Shop Integration']
  },
  {
    id: 'videographer',
    name: 'Video Editor',
    icon: <Film className="w-8 h-8" />,
    description: 'Showcase your video work, reels, and motion graphics',
    color: 'bg-red-500',
    features: ['Video Player', 'Showreel', 'Behind Scenes', 'Client Work']
  },
  {
    id: 'general',
    name: 'General Portfolio',
    icon: <Briefcase className="w-8 h-8" />,
    description: 'Versatile templates for any profession or creative field',
    color: 'bg-gray-500',
    features: ['Flexible Layout', 'Custom Sections', 'Multi-format Support', 'Professional Design']
  }
]

function TemplateSelectionModal({ isOpen, onClose, onSelectProfession }) {
  const [selectedProfession, setSelectedProfession] = useState(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleProfessionSelect = (profession) => {
    setSelectedProfession(profession)
    // Navigate to preview page
    const previewRoutes = {
      'developer': '/preview/web-developer',
      'designer': '/preview/ui-ux-designer',
      'photographer': '/preview/photographer',
      'videographer': '/preview/video-editor',
      'general': '/preview/general-portfolio'
    }
    
    const route = previewRoutes[profession.id] || '/preview/general-portfolio'
    navigate(route)
    onClose()
  }

  const handleUseTemplate = (profession) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the intended destination
      const editorRoutes = {
        'developer': '/editor/web-developer',
        'designer': '/editor/ui-ux-designer',
        'photographer': '/editor/photographer',
        'videographer': '/editor/video-editor',
        'general': '/editor/general-portfolio'
      }
      
      const intendedRoute = editorRoutes[profession.id] || '/editor/general-portfolio'
      localStorage.setItem('redirectAfterAuth', intendedRoute)
      
      // Redirect to auth page
      navigate('/auth')
      onClose()
      return
    }

    // User is authenticated, proceed to editor
    const editorRoutes = {
      'developer': '/editor/web-developer',
      'designer': '/editor/ui-ux-designer',
      'photographer': '/editor/photographer',
      'videographer': '/editor/video-editor',
      'general': '/editor/general-portfolio'
    }
    
    const route = editorRoutes[profession.id] || '/editor/general-portfolio'
    navigate(route)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  Choose Your Profession
                </h2>
                <p className="text-gray-600 mt-1">
                  Select your field to see specialized portfolio templates
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {professionTemplates.map((profession) => (
                  <motion.div
                    key={profession.id}
                    className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedProfession?.id === profession.id
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-6">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl text-white mb-4 ${profession.color}`}>
                        {profession.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {profession.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {profession.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProfessionSelect(profession)
                          }}
                          className="flex-1 text-primary-600 font-medium bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm"
                        >
                          Preview Template
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUseTemplate(profession)
                          }}
                          className="flex-1 bg-primary-600 text-white font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          {profession.id === 'general' ? 'Create Portfolio' : 'Use Template'}
                        </button>
                      </div>

                      {/* Features */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-1">
                          {profession.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-500">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedProfession?.id === profession.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Can't find your profession? Choose "General Portfolio" for versatile templates.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TemplateSelectionModal