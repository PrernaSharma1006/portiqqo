import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Palette, Globe, Upload, Zap, Users, Star, Check, ExternalLink, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import TemplateSelectionModal, { professionTemplates } from '../components/modals/TemplateSelectionModal'
import FeedbackModal from '../components/modals/FeedbackModal'
import { markFeedbackGiven } from '../utils/feedbackHelper'

// Animation variants
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

function HomePage() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [savedPortfolios, setSavedPortfolios] = useState({})
  const [testimonials, setTestimonials] = useState([
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150",
      content: "Portiqqo made it incredibly easy to showcase my design work. The templates are beautiful and professional!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Full Stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      content: "As a developer, I appreciate the clean code and fast loading times. My clients are impressed with my portfolio.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Photographer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      content: "The image quality is fantastic and the gallery layouts are perfect for showcasing my photography work.",
      rating: 5
    }
  ])
  const navigate = useNavigate()

  useEffect(() => {
    // Load saved portfolios from localStorage
    const portfolios = JSON.parse(localStorage.getItem('portfolios') || '{}')
    setSavedPortfolios(portfolios)

    // Load testimonials from localStorage
    const savedTestimonials = JSON.parse(localStorage.getItem('testimonials') || '[]')
    if (savedTestimonials.length > 0) {
      setTestimonials([...testimonials, ...savedTestimonials])
    }

    // Handle hash navigation (e.g., /#templates)
    if (window.location.hash === '#templates') {
      setTimeout(() => {
        document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }

    // Check if user just created a portfolio and should see feedback form
    const showFeedback = localStorage.getItem('showFeedbackModal')
    if (showFeedback === 'true') {
      setTimeout(() => {
        setIsFeedbackModalOpen(true)
        localStorage.removeItem('showFeedbackModal')
      }, 1000)
    }
  }, [])

  const handleProfessionSelect = (profession) => {
    console.log('Selected profession:', profession)
    
    // Navigate directly to template editors for profession-specific templates
    const routeMap = {
      'developer': '/editor/web-developer',
      'designer': '/editor/ui-ux-designer',
      'photographer': '/editor/photographer',
      'videographer': '/editor/video-editor',
      'general': '/editor/general-portfolio'
    }
    
    if (routeMap[profession.id] && !routeMap[profession.id].includes('coming-soon')) {
      navigate(routeMap[profession.id])
    } else {
      // For templates not yet created, show coming soon message
      alert(`Template for ${profession.name} coming soon! We're working on it.`)
    }
  }

  const handleFeedbackSubmit = async (feedbackData) => {
    // Generate a random avatar for the new testimonial
    const avatars = [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
    ]
    
    const newTestimonial = {
      name: feedbackData.name,
      role: feedbackData.profession,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      content: feedbackData.comment,
      rating: feedbackData.rating,
      timestamp: new Date().toISOString()
    }

    // Add to state
    const updatedTestimonials = [...testimonials, newTestimonial]
    setTestimonials(updatedTestimonials)

    // Save to localStorage
    const savedTestimonials = JSON.parse(localStorage.getItem('testimonials') || '[]')
    savedTestimonials.push(newTestimonial)
    localStorage.setItem('testimonials', JSON.stringify(savedTestimonials))

    // Mark that user has given feedback
    markFeedbackGiven()

    // In the future, this would call an API endpoint:
    // await api.post('/testimonials', feedbackData)
  }

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Professional Templates",
      description: "Choose from profession-specific templates designed by experts for developers, designers, photographers, and more."
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Easy Upload System",
      description: "Upload your work with drag-and-drop simplicity. Support for images, videos, PDFs, and external links."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Unique Subdomain",
      description: "Get your own professional subdomain instantly. Share your portfolio with a memorable, branded URL."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed and performance. Your portfolio loads instantly on any device, anywhere."
    }
  ]

  const professions = [
    "UI/UX Designer",
    "Web Developer",
    "Graphic Designer",
    "Photographer",
    "Video Editor",
    "Content Writer",
    "Digital Marketer",
    "Architect",
    "Illustrator",
    "Musician"
  ]

  const pricingFeatures = [
    "7 Days Free Trial",
    "1 Portfolio Website",
    "Professional Templates",
    "Custom Subdomain",
    "Mobile Responsive",
    "Basic Analytics",
    "Email Support"
  ]

  return (
    <>
      <Helmet>
        <title>Portiqqo - Create Stunning Professional Portfolios</title>
        <meta name="description" content="Build beautiful professional portfolios with ease. Choose from templates, upload your work, and get your unique subdomain. Perfect for designers, developers, photographers, and creators." />
        <meta name="keywords" content="portfolio builder, professional portfolio, website builder, designer portfolio, developer portfolio, photography portfolio" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-12 md:py-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative container-width section-padding">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Main Hero Content */}
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              {/* Left Content */}
              <div className="space-y-4">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm backdrop-blur-sm">
                  <Zap className="w-4 h-4" />
                  <span>No Coding Required • Launch in Minutes</span>
                </motion.div>

                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight"
                  variants={fadeInUp}
                >
                  <span className="text-white">Build Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Dream Portfolio
                  </span>
                  <br />
                  <span className="text-white">Today</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl"
                  variants={fadeInUp}
                >
                  Stunning templates, powerful customization, and your own domain. 
                  Join thousands of creators showcasing their work professionally.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeInUp}
                >
                  <Link 
                    to="/auth" 
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                  >
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button 
                    onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border-2 border-white/20 hover:border-white/40 rounded-xl font-bold text-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                  >
                    Explore Templates
                  </button>
                </motion.div>
              </div>

              {/* Right Content - Visual Element */}
              <motion.div 
                className="relative hidden lg:block"
                variants={fadeInUp}
              >
                <div className="relative w-full h-[450px]">
                  {/* Circular Text Effect - Larger radius, outside cards */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[480px] h-[480px]">
                      {/* Rotating Circle */}
                      <div className="absolute inset-0 animate-spin-slow">
                        <svg viewBox="0 0 480 480" className="w-full h-full">
                          <defs>
                            <path
                              id="circlePath"
                              d="M 240, 240 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0"
                            />
                          </defs>
                          <text className="text-[24px] font-bold fill-white/20 tracking-[0.3em]">
                            <textPath href="#circlePath">
                              PORTIQQO • SHOWCASE YOUR WORK • PORTIQQO • SHOWCASE YOUR WORK •
                            </textPath>
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Center Content - Cards and Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Decorative Cards */}
                      <motion.div 
                        className="absolute -top-20 -left-20 w-48 h-32 bg-gradient-to-br from-blue-500/90 to-violet-600/90 rounded-2xl shadow-2xl backdrop-blur-sm p-4 rotate-[-12deg]"
                        animate={{ y: [0, -10, 0], rotate: [-12, -8, -12] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <div className="text-white/90 text-sm font-semibold mb-2">Web Developer</div>
                        <div className="w-full h-2 bg-white/30 rounded-full mb-1"></div>
                        <div className="w-3/4 h-2 bg-white/30 rounded-full"></div>
                      </motion.div>

                      <motion.div 
                        className="absolute -bottom-16 -right-16 w-44 h-28 bg-gradient-to-br from-purple-500/90 to-pink-600/90 rounded-2xl shadow-2xl backdrop-blur-sm p-4 rotate-[8deg]"
                        animate={{ y: [0, 10, 0], rotate: [8, 12, 8] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      >
                        <div className="text-white/90 text-sm font-semibold mb-2">Photographer</div>
                        <div className="w-full h-2 bg-white/30 rounded-full mb-1"></div>
                        <div className="w-2/3 h-2 bg-white/30 rounded-full"></div>
                      </motion.div>

                      {/* Center Icon */}
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Globe className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* My Portfolios Section - Only show if user has created portfolios */}
      {Object.keys(savedPortfolios).length > 0 && (
        <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container-width section-padding">
            <motion.div 
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
                variants={fadeInUp}
              >
                Your Portfolios
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                View and manage your created portfolios
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {Object.entries(savedPortfolios).map(([portfolioId, portfolioData]) => (
                <motion.div 
                  key={portfolioId}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  variants={fadeInUp}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {portfolioData.personalInfo.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {portfolioData.personalInfo.title}
                        </p>
                      </div>
                      {portfolioData.personalInfo.avatar && (
                        <img
                          src={portfolioData.personalInfo.avatar}
                          alt={portfolioData.personalInfo.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">
                        Portfolio Type: <span className="font-medium text-gray-700">{portfolioData.portfolioType}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Projects: <span className="font-medium text-gray-700">{portfolioData.projects?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(`/portfolio/${portfolioId}`)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolioId}`)
                          alert('Portfolio URL copied to clipboard!')
                        }}
                        className="flex items-center justify-center px-3 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-purple-50">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-700 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Our platform provides all the tools and features you need to create a portfolio that stands out
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-violet-50">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Choose Your Perfect Template
            </motion.h2>
            <motion.p 
              className="text-xl text-violet-700 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Specialized templates designed for different professions - pick yours and start building
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {professionTemplates.map((template) => (
              <motion.div 
                key={template.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleProfessionSelect(template)}
              >
                <div className={`${template.color} p-8 text-white`}>
                  <div className="mb-4">{template.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-white/90">{template.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/preview/${template.id}`)
                      }}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium group/preview flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    <button
                      className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium group/use flex items-center justify-center"
                    >
                      Use Template
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/use:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Professions Section */}
      {/* Testimonials Section - Auto-scrolling Carousel */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4"
              variants={fadeInUp}
            >
              Loved by Creators Worldwide
            </motion.h2>
            <motion.p 
              className="text-xl text-secondary-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              See what our users have to say about their Portiqqo experience
            </motion.p>
          </motion.div>

          {/* Auto-scrolling testimonials */}
          <div className="relative mb-12">
            <div className="flex gap-6 animate-scroll-left">
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-80 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Feedback Button - Below carousel */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="relative flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                Share Your Feedback
                <Star className="w-5 h-5 fill-current" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Help us improve • Your feedback matters
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4"
              variants={fadeInUp}
            >
              Try Free for 7 Days, Then Just ₹81/Month
            </motion.h2>
            <motion.p 
              className="text-xl text-secondary-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Build your professional portfolio risk-free with our 7-day trial. Continue for less than the cost of a coffee!
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-lg mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="card p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  7 DAYS FREE TRIAL
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">Professional Portfolio</h3>
                <div className="text-4xl font-bold text-secondary-900 mb-2">
                  ₹81<span className="text-lg font-normal text-secondary-600">/month</span>
                </div>
                <p className="text-secondary-600">After 7-day free trial • Cancel anytime</p>
              </div>

              <ul className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Link 
                  to="/auth"
                  className="btn-primary w-full py-3 text-lg"
                >
                  Get Started Free
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-secondary-600">
                  No credit card required for trial • Full access to all features • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              variants={fadeInUp}
            >
              Ready to Show the World Your Work?
            </motion.h2>
            <motion.p 
              className="text-xl text-peach-100 mb-8"
              variants={fadeInUp}
            >
              Join thousands of creators who trust Portiqqo to showcase their talent
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/auth"
                className="btn-primary bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Create Your Portfolio Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectProfession={handleProfessionSelect}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  )
}

export default HomePage