import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Check, AlertCircle } from 'lucide-react'

function ContactInfoStep({ portfolioData, setPortfolioData, onStepComplete, onNext }) {
  const [formData, setFormData] = useState(portfolioData.personalInfo || {})
  const [isValid, setIsValid] = useState(false)

  const contactFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      icon: <Mail className="w-5 h-5" />,
      placeholder: 'your@email.com',
      required: true,
      description: 'Primary contact email for clients and collaborators'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      icon: <Phone className="w-5 h-5" />,
      placeholder: '+1 (555) 123-4567',
      required: false,
      description: 'Optional phone number for direct contact'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      icon: <MapPin className="w-5 h-5" />,
      placeholder: 'City, State/Country',
      required: false,
      description: 'Your current location or preferred work location'
    }
  ]

  const socialFields = [
    {
      name: 'linkedin',
      label: 'LinkedIn Profile',
      type: 'url',
      icon: <Linkedin className="w-5 h-5" />,
      placeholder: 'https://linkedin.com/in/yourprofile',
      required: false,
      description: 'Professional networking profile'
    },
    {
      name: 'github',
      label: 'GitHub Profile',
      type: 'url',
      icon: <Github className="w-5 h-5" />,
      placeholder: 'https://github.com/yourusername',
      required: false,
      description: 'Code repository and projects (for developers)'
    },
    {
      name: 'twitter',
      label: 'Twitter Profile',
      type: 'url',
      icon: <Twitter className="w-5 h-5" />,
      placeholder: 'https://twitter.com/yourusername',
      required: false,
      description: 'Professional Twitter presence'
    },
    {
      name: 'website',
      label: 'Personal Website',
      type: 'url',
      icon: <Globe className="w-5 h-5" />,
      placeholder: 'https://yourwebsite.com',
      required: false,
      description: 'Your personal website or blog'
    }
  ]

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Update portfolio data
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))

    // Check if form is valid (email is required)
    const valid = newFormData.email && newFormData.email.includes('@')
    setIsValid(valid)
    
    if (valid) {
      onStepComplete(2)
    }
  }

  const validateUrl = (url, platform) => {
    if (!url) return true // Optional fields
    
    const patterns = {
      linkedin: /linkedin\.com\/in\//,
      github: /github\.com\//,
      twitter: /twitter\.com\//,
      website: /^https?:\/\/.+/
    }
    
    return patterns[platform] ? patterns[platform].test(url) : patterns.website.test(url)
  }

  const getFieldError = (field) => {
    const value = formData[field.name] || ''
    
    if (field.required && !value) {
      return `${field.label} is required`
    }
    
    if (field.type === 'email' && value && !value.includes('@')) {
      return 'Please enter a valid email address'
    }
    
    if (field.type === 'url' && value && !validateUrl(value, field.name)) {
      return `Please enter a valid ${field.label.toLowerCase()}`
    }
    
    return null
  }

  const completedFields = [...contactFields, ...socialFields].filter(field => formData[field.name]).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">How can clients and collaborators reach you?</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-green-600"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Contact info completed!</span>
            </motion.div>
          )}
          
          <div className="text-sm text-gray-600">
            {completedFields} of {contactFields.length + socialFields.length} fields completed
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactFields.map(field => {
              const error = getFieldError(field)
              const value = formData[field.name] || ''
              
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      {field.icon}
                      <span>{field.label}</span>
                      {field.required && <span className="text-red-500">*</span>}
                    </div>
                  </label>
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder={field.placeholder}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">{field.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social Media & Professional Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Social Media & Professional Links</h3>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialFields.map(field => {
              const error = getFieldError(field)
              const value = formData[field.name] || ''
              
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      {field.icon}
                      <span>{field.label}</span>
                    </div>
                  </label>
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder={field.placeholder}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">{field.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                value={formData.preferredContact || 'email'}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={formData.availability || 'open'}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="open">Open to new opportunities</option>
                <option value="selective">Considering select opportunities</option>
                <option value="busy">Currently busy, but open to discussion</option>
                <option value="unavailable">Not available at the moment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Contact Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a professional email address that includes your name</li>
                <li>• Keep your LinkedIn profile updated and professional</li>
                <li>• Only include social media accounts that enhance your professional image</li>
                <li>• Make sure all links are working and up to date</li>
                <li>• Consider time zones when providing phone contact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>Continue to Resume Upload</span>
        </button>
      </div>
    </div>
  )
}

export default ContactInfoStep