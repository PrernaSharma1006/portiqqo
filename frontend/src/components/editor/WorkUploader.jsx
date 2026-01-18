import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Upload, 
  Image, 
  Video, 
  FileText, 
  File, 
  Plus, 
  Trash2, 
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react'

function WorkUploader({ portfolioData, setPortfolioData, onClose }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [selectedComponent, setSelectedComponent] = useState('')
  const fileInputRef = useRef(null)

  const workTypes = {
    projects: {
      name: 'Projects',
      icon: <Image className="w-5 h-5" />,
      description: 'Upload project images, videos, and descriptions',
      fields: ['title', 'description', 'technologies', 'image', 'url', 'category']
    },
    skills: {
      name: 'Skills',
      icon: <FileText className="w-5 h-5" />,
      description: 'Add your technical and professional skills',
      fields: ['name', 'level', 'category', 'icon']
    },
    experience: {
      name: 'Experience',
      icon: <FileText className="w-5 h-5" />,
      description: 'Add work experience and career history',
      fields: ['company', 'position', 'duration', 'description', 'achievements']
    },
    testimonials: {
      name: 'Testimonials',
      icon: <FileText className="w-5 h-5" />,
      description: 'Add client testimonials and reviews',
      fields: ['name', 'position', 'company', 'testimonial', 'avatar', 'rating']
    },
    services: {
      name: 'Services',
      icon: <FileText className="w-5 h-5" />,
      description: 'Add services you offer to clients',
      fields: ['name', 'description', 'price', 'features', 'category']
    }
  }

  const [newItem, setNewItem] = useState({})

  const handleFileUpload = async (files) => {
    const uploadedFiles = []

    for (const file of files) {
      const fileId = Math.random().toString(36).substr(2, 9)
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      // Create file URL (in real app, this would upload to cloud storage)
      const fileUrl = URL.createObjectURL(file)
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
      }
      
      uploadedFiles.push({
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl
      })
      
      // Remove progress after upload
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      }, 1000)
    }
    
    return uploadedFiles
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const uploadedFiles = await handleFileUpload(files)
    
    // Auto-fill form if uploading to projects
    if (activeTab === 'projects' && uploadedFiles.length > 0) {
      setNewItem(prev => ({
        ...prev,
        image: uploadedFiles[0].url,
        title: uploadedFiles[0].name.split('.')[0]
      }))
    }
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    const uploadedFiles = await handleFileUpload(files)
    
    if (activeTab === 'projects' && uploadedFiles.length > 0) {
      setNewItem(prev => ({
        ...prev,
        image: uploadedFiles[0].url,
        title: uploadedFiles[0].name.split('.')[0]
      }))
    }
  }

  const handleAddItem = () => {
    if (!selectedComponent) {
      alert('Please select which component to add this to')
      return
    }

    const itemWithId = {
      ...newItem,
      id: Date.now().toString(),
      targetComponent: selectedComponent
    }

    setPortfolioData(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), itemWithId]
    }))

    setNewItem({})
    setSelectedComponent('')
  }

  const handleRemoveItem = (itemId) => {
    setPortfolioData(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(item => item.id !== itemId)
    }))
  }

  const componentOptions = {
    projects: ['projects', 'portfolio'],
    skills: ['skills', 'about'],
    experience: ['experience', 'about'],
    testimonials: ['testimonials', 'about'],
    services: ['services', 'about']
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Your Work</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Add your projects, skills, experience, and other portfolio content.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {Object.entries(workTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {type.icon}
                    <span>{type.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Add New {workTypes[activeTab].name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {workTypes[activeTab].description}
                  </p>
                </div>

                {/* Component Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which component should this appear in?
                  </label>
                  <select
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a component...</option>
                    {componentOptions[activeTab]?.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)} Section
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Area */}
                {(activeTab === 'projects' || activeTab === 'testimonials') && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-gray-600 mb-4">
                      Support for images, videos, and documents
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose Files
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {Object.entries(uploadProgress).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Uploading...</span>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  {workTypes[activeTab].fields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {field === 'title' && <span className="text-red-500">*</span>}
                      </label>
                      {field === 'description' || field === 'testimonial' ? (
                        <textarea
                          value={newItem[field] || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder={`Enter ${field}...`}
                        />
                      ) : field === 'technologies' || field === 'features' ? (
                        <input
                          type="text"
                          value={newItem[field] || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, [field]: e.target.value.split(',').map(s => s.trim()) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter comma-separated values"
                        />
                      ) : field === 'level' ? (
                        <select
                          value={newItem[field] || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select level...</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      ) : (
                        <input
                          type={field === 'url' ? 'url' : field === 'rating' ? 'number' : 'text'}
                          value={newItem[field] || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Enter ${field}...`}
                          {...(field === 'rating' && { min: 1, max: 5 })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddItem}
                  disabled={!newItem.title || !selectedComponent}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add {workTypes[activeTab].name.slice(0, -1)}</span>
                </button>
              </div>

              {/* Current Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current {workTypes[activeTab].name}
                </h3>
                
                {portfolioData[activeTab]?.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioData[activeTab].map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title || item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description.length > 100
                                  ? `${item.description.substring(0, 100)}...`
                                  : item.description
                                }
                              </p>
                            )}
                            {item.targetComponent && (
                              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {item.targetComponent.charAt(0).toUpperCase() + item.targetComponent.slice(1)} Section
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No {workTypes[activeTab].name.toLowerCase()} added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Choose which component each item should appear in
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorkUploader