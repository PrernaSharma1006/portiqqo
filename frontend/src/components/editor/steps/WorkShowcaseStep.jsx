import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Image, 
  Star, 
  Award, 
  Users,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

function WorkShowcaseStep({ portfolioData, setPortfolioData, onStepComplete, onNext }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({})
  const [dragOver, setDragOver] = useState(false)

  const workTypes = {
    projects: {
      name: 'Projects',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Showcase your best work and projects',
      fields: [
        { name: 'title', label: 'Project Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'image', label: 'Project Image', type: 'file', required: false },
        { name: 'technologies', label: 'Technologies Used', type: 'tags', required: false, placeholder: 'React, Node.js, MongoDB' },
        { name: 'url', label: 'Live URL', type: 'url', required: false },
        { name: 'github', label: 'GitHub URL', type: 'url', required: false },
        { name: 'category', label: 'Category', type: 'select', options: ['Web App', 'Mobile App', 'Website', 'Design', 'Other'] }
      ]
    },
    skills: {
      name: 'Skills',
      icon: <Star className="w-5 h-5" />,
      description: 'Add your technical and professional skills',
      fields: [
        { name: 'name', label: 'Skill Name', type: 'text', required: true },
        { name: 'level', label: 'Proficiency Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        { name: 'category', label: 'Category', type: 'select', options: ['Frontend', 'Backend', 'Design', 'Tools', 'Soft Skills', 'Other'] },
        { name: 'yearsExperience', label: 'Years of Experience', type: 'number', required: false }
      ]
    },
    experience: {
      name: 'Experience',
      icon: <Award className="w-5 h-5" />,
      description: 'Add your work experience and career history',
      fields: [
        { name: 'company', label: 'Company Name', type: 'text', required: true },
        { name: 'position', label: 'Job Title', type: 'text', required: true },
        { name: 'duration', label: 'Duration', type: 'text', required: true, placeholder: '2020 - Present' },
        { name: 'description', label: 'Job Description', type: 'textarea', required: true },
        { name: 'achievements', label: 'Key Achievements', type: 'tags', placeholder: 'Increased sales by 30%, Led team of 5' },
        { name: 'companyUrl', label: 'Company Website', type: 'url', required: false }
      ]
    },
    testimonials: {
      name: 'Testimonials',
      icon: <Users className="w-5 h-5" />,
      description: 'Add client testimonials and reviews',
      fields: [
        { name: 'name', label: 'Client Name', type: 'text', required: true },
        { name: 'position', label: 'Their Position', type: 'text', required: true },
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'testimonial', label: 'Testimonial', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating', type: 'select', options: ['5', '4', '3', '2', '1'] },
        { name: 'avatar', label: 'Profile Picture', type: 'file', required: false },
        { name: 'projectName', label: 'Project Name', type: 'text', required: false }
      ]
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'technologies' || field === 'achievements') {
      // Handle comma-separated values
      setNewItem(prev => ({
        ...prev,
        [field]: value.split(',').map(item => item.trim()).filter(item => item)
      }))
    } else {
      setNewItem(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleFileUpload = (field, file) => {
    // In a real app, this would upload to cloud storage
    const fileUrl = URL.createObjectURL(file)
    setNewItem(prev => ({
      ...prev,
      [field]: fileUrl
    }))
  }

  const handleAddItem = () => {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString()
    }

    setPortfolioData(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), itemWithId]
    }))

    setNewItem({})
    setShowAddForm(false)
    
    // Mark step as complete if we have at least one project
    if (activeTab === 'projects' || portfolioData.projects?.length > 0) {
      onStepComplete(1)
    }
  }

  const handleRemoveItem = (itemId) => {
    setPortfolioData(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(item => item.id !== itemId)
    }))
  }

  const renderField = (field) => {
    const value = newItem[field.name] || ''
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          />
        )
        
      case 'select':
        return (
          <select
            key={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {field.label.toLowerCase()}...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
        
      case 'file':
        return (
          <div key={field.name} className="space-y-3">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const file = e.dataTransfer.files[0]
                if (file) handleFileUpload(field.name, file)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drop files here or click to browse
              </p>
              <input
                type="file"
                accept={field.name === 'avatar' ? 'image/*' : 'image/*,video/*'}
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) handleFileUpload(field.name, file)
                }}
                className="hidden"
                id={`${field.name}-upload`}
              />
              <label
                htmlFor={`${field.name}-upload`}
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Choose File
              </label>
            </div>
            {value && (
              <div className="mt-2">
                <img src={value} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
              </div>
            )}
          </div>
        )
        
      case 'number':
        return (
          <input
            key={field.name}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          />
        )
        
      default:
        return (
          <input
            key={field.name}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          />
        )
    }
  }

  const isFormValid = () => {
    const currentWorkType = workTypes[activeTab]
    const requiredFields = currentWorkType.fields.filter(field => field.required)
    return requiredFields.every(field => newItem[field.name])
  }

  const hasProjects = portfolioData.projects?.length > 0
  const totalItems = Object.keys(workTypes).reduce((sum, key) => sum + (portfolioData[key]?.length || 0), 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Work Showcase</h2>
            <p className="text-gray-600">Add your projects, skills, and experience</p>
          </div>
        </div>
        
        {hasProjects && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-600"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Great! You have {totalItems} items added.</span>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {Object.entries(workTypes).map(([key, type]) => {
            const count = portfolioData[key]?.length || 0
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key)
                  setShowAddForm(false)
                }}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {type.icon}
                  <span>{type.name}</span>
                  {count > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1">
                      {count}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{workTypes[activeTab].name}</h3>
            <p className="text-gray-600">{workTypes[activeTab].description}</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {workTypes[activeTab].name.slice(0, -1)}</span>
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h4 className="font-semibold text-gray-900 mb-4">
                Add New {workTypes[activeTab].name.slice(0, -1)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workTypes[activeTab].fields.map(field => (
                  <div key={field.name} className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItem({})
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!isFormValid()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {workTypes[activeTab].name.slice(0, -1)}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items List */}
        <div className="space-y-4">
          {portfolioData[activeTab]?.length > 0 ? (
            portfolioData[activeTab].map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {item.title || item.name || item.company}
                    </h4>
                    {item.description && (
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    )}
                    {item.position && (
                      <p className="text-blue-600 font-medium">{item.position}</p>
                    )}
                    {item.technologies && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.url && (
                      <div className="mt-3">
                        <a 
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Project</span>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {workTypes[activeTab].icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {workTypes[activeTab].name.toLowerCase()} added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first {workTypes[activeTab].name.slice(0, -1).toLowerCase()}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add {workTypes[activeTab].name.slice(0, -1)}
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        {activeTab === 'projects' && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Project Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Add 3-5 of your best projects to showcase your range</li>
                  <li>• Include high-quality images or screenshots</li>
                  <li>• Describe the problem you solved and your approach</li>
                  <li>• Link to live demos when possible</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!hasProjects}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>Continue to Contact Info</span>
        </button>
      </div>
    </div>
  )
}

export default WorkShowcaseStep