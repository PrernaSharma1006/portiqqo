import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit3, Download, ExternalLink, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, FileText, Briefcase, GraduationCap, Award, Star } from 'lucide-react'

function PortfolioPreview({ portfolioData, templateType, onNext, onEdit }) {
  const [previewMode, setPreviewMode] = useState('desktop')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const { personalInfo, workShowcase, resume } = portfolioData

  // Template color schemes
  const colorSchemes = {
    'web-developer': {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      primaryText: 'text-blue-600',
      primaryBg: 'bg-blue-50',
      accent: 'bg-blue-100',
      gradient: 'from-blue-600 to-purple-600'
    },
    'ui-ux-designer': {
      primary: 'bg-purple-600',
      primaryHover: 'hover:bg-purple-700',
      primaryText: 'text-purple-600',
      primaryBg: 'bg-purple-50',
      accent: 'bg-purple-100',
      gradient: 'from-purple-600 to-pink-600'
    },
    'data-scientist': {
      primary: 'bg-green-600',
      primaryHover: 'hover:bg-green-700',
      primaryText: 'text-green-600',
      primaryBg: 'bg-green-50',
      accent: 'bg-green-100',
      gradient: 'from-green-600 to-teal-600'
    },
    'mobile-developer': {
      primary: 'bg-indigo-600',
      primaryHover: 'hover:bg-indigo-700',
      primaryText: 'text-indigo-600',
      primaryBg: 'bg-indigo-50',
      accent: 'bg-indigo-100',
      gradient: 'from-indigo-600 to-blue-600'
    },
    'devops-engineer': {
      primary: 'bg-orange-600',
      primaryHover: 'hover:bg-orange-700',
      primaryText: 'text-orange-600',
      primaryBg: 'bg-orange-50',
      accent: 'bg-orange-100',
      gradient: 'from-orange-600 to-red-600'
    },
    'product-manager': {
      primary: 'bg-teal-600',
      primaryHover: 'hover:bg-teal-700',
      primaryText: 'text-teal-600',
      primaryBg: 'bg-teal-50',
      accent: 'bg-teal-100',
      gradient: 'from-teal-600 to-green-600'
    },
    'marketing-specialist': {
      primary: 'bg-pink-600',
      primaryHover: 'hover:bg-pink-700',
      primaryText: 'text-pink-600',
      primaryBg: 'bg-pink-50',
      accent: 'bg-pink-100',
      gradient: 'from-pink-600 to-rose-600'
    },
    'business-analyst': {
      primary: 'bg-gray-600',
      primaryHover: 'hover:bg-gray-700',
      primaryText: 'text-gray-600',
      primaryBg: 'bg-gray-50',
      accent: 'bg-gray-100',
      gradient: 'from-gray-600 to-slate-600'
    }
  }

  const theme = colorSchemes[templateType] || colorSchemes['web-developer']

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-5 h-5" />
      case 'github': return <Github className="w-5 h-5" />
      case 'twitter': return <Twitter className="w-5 h-5" />
      case 'website': return <Globe className="w-5 h-5" />
      default: return <Globe className="w-5 h-5" />
    }
  }

  const PortfolioContent = () => (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className={`bg-gradient-to-r ${theme.gradient} text-white`}>
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center space-x-8">
            {personalInfo?.profilePicture && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                <img 
                  src={personalInfo.profilePicture} 
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {personalInfo?.fullName || 'Your Name'}
              </h1>
              <p className="text-xl text-white/90 mb-4">
                {personalInfo?.jobTitle || `Professional ${templateType?.replace('-', ' ')}`}
              </p>
              <p className="text-white/80 text-lg max-w-2xl">
                {personalInfo?.bio || 'Your professional bio will appear here...'}
              </p>
              
              <div className="flex items-center space-x-6 mt-6">
                {personalInfo?.email && (
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-2 text-white/90 hover:text-white">
                    <Mail className="w-5 h-5" />
                    <span>{personalInfo.email}</span>
                  </a>
                )}
                
                {personalInfo?.location && (
                  <div className="flex items-center space-x-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      {workShowcase?.projects?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workShowcase.projects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {project.image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 ${theme.accent} ${theme.primaryText} text-xs rounded-full`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      {project.liveUrl && (
                        <a href={project.liveUrl} className={`flex items-center space-x-1 text-sm ${theme.primaryText} hover:underline`}>
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className={`flex items-center space-x-1 text-sm ${theme.primaryText} hover:underline`}>
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {workShowcase?.skills?.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {workShowcase.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className={`p-4 ${theme.primaryBg} rounded-lg text-center`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h3 className={`font-semibold ${theme.primaryText} mb-2`}>{skill.name}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${theme.primary} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 mt-1">{skill.level}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {workShowcase?.experience?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Work Experience</h2>
            <div className="max-w-4xl mx-auto">
              {workShowcase.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className={`${theme.primaryText} font-medium mb-2`}>{exp.company}</p>
                      <p className="text-gray-600 mb-4">{exp.description}</p>
                      {exp.achievements?.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className={`py-16 bg-gradient-to-r ${theme.gradient} text-white`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {personalInfo?.availability === 'open' ? "I'm currently open to new opportunities and exciting projects." :
             personalInfo?.availability === 'selective' ? "I'm considering select opportunities that align with my expertise." :
             personalInfo?.availability === 'busy' ? "I'm currently busy but open to discussing interesting projects." :
             "Feel free to reach out to discuss potential collaborations."}
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            {personalInfo?.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
            )}
            
            {resume && (
              <a 
                href={resume.url}
                download={resume.name}
                className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            {['linkedin', 'github', 'twitter', 'website'].map(platform => {
              if (personalInfo?.[platform]) {
                return (
                  <a
                    key={platform}
                    href={personalInfo[platform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {getSocialIcon(platform)}
                  </a>
                )
              }
              return null
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p>&copy; 2024 {personalInfo?.fullName || 'Your Name'}. All rights reserved.</p>
        <p className="text-gray-400 text-sm mt-2">Built with Portiqqo</p>
      </footer>
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Preview</h2>
              <p className="text-gray-600">Review your portfolio before publishing</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  previewMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  previewMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile
              </button>
            </div>
            
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className={`mx-auto bg-white rounded-lg overflow-hidden shadow-lg ${
          previewMode === 'mobile' ? 'max-w-sm' : 'max-w-7xl'
        }`}>
          <div className={`${previewMode === 'mobile' ? 'text-sm' : ''} max-h-96 overflow-y-auto`}>
            <PortfolioContent />
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      <div className="mt-8 space-y-6">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {workShowcase?.projects?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {workShowcase?.skills?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Skills</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {workShowcase?.experience?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Experience</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {resume ? '1' : '0'}
            </div>
            <div className="text-sm text-gray-600">Resume</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
            <span>Make Changes</span>
          </button>
          
          <button
            onClick={onNext}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span>Publish Portfolio</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPreview