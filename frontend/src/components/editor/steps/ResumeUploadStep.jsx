import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, X, Check, AlertCircle, Download, Eye } from 'lucide-react'

function ResumeUploadStep({ portfolioData, setPortfolioData, onStepComplete, onNext }) {
  const [uploadedFile, setUploadedFile] = useState(portfolioData.resume || null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(file => file.type === 'application/pdf')
    
    if (pdfFile) {
      handleFileUpload(pdfFile)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          // Create file object with metadata
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file), // In real app, this would be a server URL
            uploadDate: new Date().toISOString()
          }
          
          setUploadedFile(fileData)
          setPortfolioData(prev => ({
            ...prev,
            resume: fileData
          }))
          
          onStepComplete(3)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setPortfolioData(prev => ({
      ...prev,
      resume: null
    }))
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openPreview = () => {
    if (uploadedFile && uploadedFile.url) {
      window.open(uploadedFile.url, '_blank')
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Upload</h2>
            <p className="text-gray-600">Upload your resume to enhance your portfolio</p>
          </div>
        </div>
        
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-600"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Resume uploaded successfully!</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        {!uploadedFile ? (
          <div className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragging ? 'Drop your PDF here' : 'Upload your resume'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose PDF File</span>
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading resume...</span>
                  <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Uploaded File Display */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatFileSize(uploadedFile.size)} • Uploaded {new Date(uploadedFile.uploadDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={openPreview}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                
                <button
                  onClick={removeFile}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resume Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Resume Best Practices</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Keep it to 1-2 pages maximum</li>
                  <li>• Use a clean, professional format</li>
                  <li>• Include relevant keywords from job descriptions</li>
                  <li>• Quantify your achievements with numbers</li>
                  <li>• Tailor content to your target role</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">What to Include</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Contact information</li>
                  <li>• Professional summary</li>
                  <li>• Work experience with achievements</li>
                  <li>• Education and certifications</li>
                  <li>• Relevant skills and technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Integration Info */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-50 rounded-lg"
          >
            <h3 className="font-semibold text-gray-900 mb-3">How Your Resume Will Be Used</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Your resume will be available as a downloadable link in your portfolio</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Visitors can view and download your resume directly from your portfolio</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>It will be prominently featured in your contact section</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Optional Message */}
        <div className="p-6 bg-yellow-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Resume Upload is Optional</h3>
              <p className="text-sm text-yellow-800">
                While uploading a resume enhances your portfolio, you can skip this step and continue. 
                You can always add or update your resume later from your portfolio dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onNext}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Skip this step
        </button>
        
        <button
          onClick={onNext}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>{uploadedFile ? 'Continue to Preview' : 'Skip and Preview'}</span>
        </button>
      </div>
    </div>
  )
}

export default ResumeUploadStep