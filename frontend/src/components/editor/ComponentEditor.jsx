import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, User, MapPin, Mail, Phone, Globe, Camera } from 'lucide-react'

function ComponentEditor({ componentId, portfolioData, setPortfolioData, onClose }) {
  const [formData, setFormData] = useState(() => {
    if (componentId === 'personalInfo') {
      return portfolioData.personalInfo || {}
    }
    return portfolioData[componentId] || []
  })

  const handleSave = () => {
    if (componentId === 'personalInfo') {
      setPortfolioData(prev => ({
        ...prev,
        personalInfo: formData
      }))
    } else {
      setPortfolioData(prev => ({
        ...prev,
        [componentId]: formData
      }))
    }
    onClose()
  }

  const updatePersonalInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderPersonalInfoEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Web Developer, UI/UX Designer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
          </label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => updatePersonalInfo('bio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Tell your professional story..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City, State/Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.avatar || ''}
            onChange={(e) => updatePersonalInfo('avatar', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/your-photo.jpg"
          />
          {formData.avatar && (
            <div className="mt-3">
              <img
                src={formData.avatar}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderComponentList = () => {
    const componentItems = portfolioData[componentId] || []
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {componentId.charAt(0).toUpperCase() + componentId.slice(1)} Items
          </h3>
          <span className="text-sm text-gray-600">
            {componentItems.length} items
          </span>
        </div>

        {componentItems.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {componentItems.map((item, index) => (
              <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.title || item.name || item.company || 'Untitled'}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description.length > 150 
                          ? `${item.description.substring(0, 150)}...`
                          : item.description
                        }
                      </p>
                    )}
                    {item.technologies && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                          {item.technologies.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {item.targetComponent && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        → {item.targetComponent.charAt(0).toUpperCase() + item.targetComponent.slice(1)} Section
                      </span>
                    )}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || 'Item'}
                      className="w-16 h-16 rounded-lg object-cover ml-4"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items added yet</h3>
            <p className="text-gray-600 mb-4">
              Use the "Upload Work" feature to add items to this component.
            </p>
          </div>
        )}
      </div>
    )
  }

  const getComponentTitle = () => {
    if (componentId === 'personalInfo') {
      return 'Personal Information'
    }
    return `${componentId.charAt(0).toUpperCase() + componentId.slice(1)} Component`
  }

  const getComponentDescription = () => {
    const descriptions = {
      personalInfo: 'Update your personal information and contact details',
      projects: 'Manage your project portfolio and work samples',
      skills: 'Edit your technical skills and expertise levels',
      experience: 'Update your work history and professional experience',
      testimonials: 'Manage client testimonials and reviews',
      services: 'Edit services you offer to clients'
    }
    return descriptions[componentId] || 'Edit component content'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{getComponentTitle()}</h2>
          <p className="text-gray-600 mt-1">{getComponentDescription()}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {componentId === 'personalInfo' ? renderPersonalInfoEditor() : renderComponentList()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          {componentId === 'personalInfo' 
            ? 'This information will appear across your portfolio'
            : 'Items are organized by the component they\'ll appear in'
          }
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ComponentEditor