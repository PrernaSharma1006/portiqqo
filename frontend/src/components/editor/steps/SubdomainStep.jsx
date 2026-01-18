import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Copy, Check, ExternalLink, Mail, Share2, Download, QrCode, Sparkles } from 'lucide-react'

function SubdomainStep({ portfolioData, setPortfolioData, onComplete }) {
  const [subdomain, setSubdomain] = useState('')
  const [isAvailable, setIsAvailable] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')

  const checkAvailability = async () => {
    if (!subdomain) return
    
    setIsChecking(true)
    // Simulate API call to check subdomain availability
    setTimeout(() => {
      const available = !['admin', 'www', 'api', 'app', 'test', 'demo'].includes(subdomain.toLowerCase())
      setIsAvailable(available)
      setIsChecking(false)
    }, 1000)
  }

  const generateSuggestions = () => {
    const firstName = portfolioData.personalInfo?.fullName?.split(' ')[0]?.toLowerCase() || 'portfolio'
    const lastName = portfolioData.personalInfo?.fullName?.split(' ')[1]?.toLowerCase() || ''
    const jobTitle = portfolioData.personalInfo?.jobTitle?.toLowerCase().replace(/[^a-z]/g, '') || 'pro'
    
    return [
      `${firstName}${lastName}`,
      `${firstName}-${jobTitle}`,
      `${firstName}-portfolio`,
      `${firstName}${Math.floor(Math.random() * 999)}`,
      `${jobTitle}-${firstName}`
    ].filter(s => s.length > 0)
  }

  const handleSubdomainChange = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(cleaned)
    setIsAvailable(null)
  }

  const publishPortfolio = async () => {
    setIsPublishing(true)
    
    // Simulate publishing process
    setTimeout(() => {
      const url = `https://${subdomain}.portfoliobuilder.com`
      setGeneratedUrl(url)
      setPortfolioData(prev => ({
        ...prev,
        publishedUrl: url,
        subdomain: subdomain,
        publishedAt: new Date().toISOString()
      }))
      setIsPublishing(false)
      setIsPublished(true)
    }, 3000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const shareOptions = [
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      action: () => window.open(`mailto:?subject=Check out my portfolio&body=I'd love for you to check out my portfolio: ${generatedUrl}`)
    },
    {
      name: 'Copy Link',
      icon: copiedUrl ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
      action: () => copyToClipboard(generatedUrl)
    },
    {
      name: 'Open Portfolio',
      icon: <ExternalLink className="w-5 h-5" />,
      action: () => window.open(generatedUrl, '_blank')
    }
  ]

  if (isPublished) {
    return (
      <div className="p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Published Successfully!</h2>
          <p className="text-gray-600 text-lg">Your professional portfolio is now live and ready to share</p>
        </div>

        {/* Portfolio URL */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your portfolio is now available at:</p>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white px-4 py-2 rounded-lg border text-lg font-mono text-gray-900">
                {generatedUrl}
              </div>
              <button
                onClick={() => copyToClipboard(generatedUrl)}
                className={`p-2 rounded-lg transition-colors ${
                  copiedUrl ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {copiedUrl ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-center space-x-3">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  {option.icon}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Portfolio</h3>
                <p className="text-sm text-gray-600">Accessible worldwide</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">✓ Published</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Professional Design</h3>
                <p className="text-sm text-gray-600">Mobile responsive</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">✓ Optimized</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ready to Share</h3>
                <p className="text-sm text-gray-600">Social media ready</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">✓ Shareable</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Share your portfolio with your network</p>
                <p className="text-sm text-gray-600">Add the link to your email signature, LinkedIn profile, and resume</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Keep your content updated</p>
                <p className="text-sm text-gray-600">Regularly add new projects and update your information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Monitor your portfolio performance</p>
                <p className="text-sm text-gray-600">Check analytics to see how visitors interact with your portfolio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.open(generatedUrl, '_blank')}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Portfolio</span>
          </button>
          
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Create Another Portfolio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Portfolio URL</h2>
            <p className="text-gray-600">Select a unique subdomain for your portfolio</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Subdomain Selection */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio URL</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your subdomain
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-name"
                />
                <div className="px-4 py-3 bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg text-gray-600">
                  .portfoliobuilder.com
                </div>
              </div>
              
              {subdomain && (
                <div className="mt-2">
                  <button
                    onClick={checkAvailability}
                    disabled={isChecking}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    {isChecking ? 'Checking...' : 'Check availability'}
                  </button>
                  
                  {isAvailable !== null && (
                    <div className={`mt-2 text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {isAvailable ? (
                        <div className="flex items-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>"{subdomain}" is available!</span>
                        </div>
                      ) : (
                        <span>"{subdomain}" is already taken</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {generateSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSubdomain(suggestion)
                      setIsAvailable(null)
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {subdomain && isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Preview</h3>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
                <Globe className="w-4 h-4" />
                <span>https://{subdomain}.portfoliobuilder.com</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  {portfolioData.personalInfo?.fullName || 'Your Name'} - Portfolio
                </h4>
                <p className="text-sm text-gray-600">
                  {portfolioData.personalInfo?.bio?.substring(0, 100) || 'Professional portfolio showcasing work and expertise'}...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Publishing Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens when you publish?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Your portfolio goes live</p>
                <p className="text-sm text-gray-600">Accessible to anyone with the URL</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">SEO optimization</p>
                <p className="text-sm text-gray-600">Searchable on Google and other search engines</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Analytics tracking</p>
                <p className="text-sm text-gray-600">Monitor visitor engagement and portfolio performance</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Custom domain option</p>
                <p className="text-sm text-gray-600">Upgrade later to use your own domain name</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end">
        {isPublishing ? (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Publishing your portfolio...</span>
          </div>
        ) : (
          <button
            onClick={publishPortfolio}
            disabled={!subdomain || !isAvailable}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Globe className="w-5 h-5" />
            <span>Publish Portfolio</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default SubdomainStep