import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Download, 
  ExternalLink,
  ArrowLeft,
  Edit
} from 'lucide-react'

function PortfolioDisplay() {
  const { portfolioId } = useParams()
  const navigate = useNavigate()
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load portfolio data from localStorage
    const storedPortfolios = JSON.parse(localStorage.getItem('portfolios') || '{}')
    const portfolio = storedPortfolios[portfolioId]
    
    if (portfolio) {
      setPortfolioData(portfolio)
    }
    setLoading(false)
  }, [portfolioId])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">The portfolio you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const { personalInfo, projects, portfolioType } = portfolioData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Portfolio by</span>
              <div className="font-medium text-gray-900">{personalInfo.name}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              {personalInfo.avatar && (
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
                />
              )}
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {personalInfo.name}
              </h1>
              <p className="text-2xl text-purple-100 mb-6">
                {personalInfo.title}
              </p>
              {personalInfo.bio && (
                <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                  {personalInfo.bio}
                </p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              {personalInfo.resume && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    // In a real app, this would download the actual resume file
                    alert('Resume download would start here')
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Resume</span>
                </a>
              )}
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Get In Touch</span>
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div className="text-center mb-16" variants={fadeInUp}>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">My Work</h2>
                <p className="text-xl text-gray-600">
                  Here are some of my recent projects and achievements
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    {project.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          <span>View Project</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center"
          >
            <motion.h2 
              className="text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              Let's Work Together
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Ready to bring your next project to life? Get in touch and let's discuss how we can collaborate.
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              variants={fadeInUp}
            >
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-400">{personalInfo.email}</div>
                  </div>
                </a>
              )}

              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Phone className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-gray-400">{personalInfo.phone}</div>
                  </div>
                </a>
              )}

              {personalInfo.location && (
                <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-400" />
                  <div className="text-left">
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-400">{personalInfo.location}</div>
                  </div>
                </div>
              )}

              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-6 h-6 text-violet-400" />
                  <div className="text-left">
                    <div className="font-medium">Website</div>
                    <div className="text-sm text-gray-400">Visit Site</div>
                  </div>
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © 2025 {personalInfo.name}. Built with Portiqqo.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Made with</span>
              <a 
                href="mailto:portfolio.builder659@gmail.com"
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                Portiqqo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PortfolioDisplay