import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, ExternalLink, Award, Calendar, MapPin, Mail, Phone, Download, ArrowRight, Ruler, Home, Lightbulb, Users, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ArchitectTemplate({ isPublic = false, portfolioData = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  const architectData = {
    name: "Michael Chen",
    title: "Licensed Architect & Design Director",
    specialties: ["Residential Design", "Commercial Projects", "Sustainable Architecture", "Urban Planning"],
    location: "Seattle, WA",
    email: "michael.chen@architecture.com",
    phone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    bio: "Award-winning architect with 12+ years of experience creating innovative, sustainable buildings that enhance communities. Passionate about designing spaces that inspire and improve quality of life.",
    firm: "Chen Architecture Studio",
    licenses: ["AIA", "LEED AP", "NCARB Certified"],
    social: {
      website: "https://chenarchitecture.com",
      linkedin: "https://linkedin.com/in/michaelchen",
      instagram: "https://instagram.com/chenarchitecture"
    },
    projects: [
      {
        id: 1,
        title: "Eco-Residential Complex",
        category: "residential",
        client: "GreenLiving Development",
        year: "2024",
        location: "Portland, OR",
        size: "150,000 sq ft",
        budget: "$25M",
        status: "Completed",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        description: "Sustainable 100-unit residential complex featuring passive house design, green roofs, and renewable energy systems.",
        features: ["LEED Platinum", "Net Zero Energy", "Rainwater Harvesting", "Community Gardens"],
        awards: ["AIA Housing Award 2024", "Green Building Excellence Award"],
        featured: true
      },
      {
        id: 2,
        title: "Modern Corporate Headquarters",
        category: "commercial",
        client: "TechCorp Industries",
        year: "2023",
        location: "San Francisco, CA",
        size: "300,000 sq ft",
        budget: "$45M",
        status: "Completed",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        description: "Innovative office building designed for collaboration and wellbeing, featuring flexible workspaces and biophilic design.",
        features: ["LEED Gold", "Flexible Workspace", "Biophilic Design", "Smart Building Systems"],
        awards: ["Commercial Architecture Award 2023"],
        featured: true
      },
      {
        id: 3,
        title: "Cultural Arts Center",
        category: "cultural",
        client: "City of Portland",
        year: "2023",
        location: "Portland, OR",
        size: "80,000 sq ft",
        budget: "$18M",
        status: "Completed",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
        description: "Community arts center providing performance spaces, galleries, and educational facilities for local artists.",
        features: ["Acoustic Excellence", "Natural Light", "Community Spaces", "Local Materials"],
        awards: ["Public Architecture Award 2023"],
        featured: false
      },
      {
        id: 4,
        title: "Luxury Private Residence",
        category: "residential",
        client: "Private Client",
        year: "2022",
        location: "Malibu, CA",
        size: "8,500 sq ft",
        budget: "$4.5M",
        status: "Completed",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        description: "Contemporary hillside residence with panoramic ocean views, seamlessly integrating indoor and outdoor living.",
        features: ["Ocean Views", "Infinity Pool", "Smart Home", "Sustainable Materials"],
        awards: ["Residential Design Excellence 2022"],
        featured: false
      },
      {
        id: 5,
        title: "Urban Mixed-Use Development",
        category: "mixed-use",
        client: "Downtown Developers LLC",
        year: "2024",
        location: "Seattle, WA",
        size: "400,000 sq ft",
        budget: "$65M",
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        description: "Mixed-use development combining residential, retail, and office spaces in the heart of downtown Seattle.",
        features: ["Transit-Oriented", "Mixed Income Housing", "Retail Spaces", "Public Plaza"],
        awards: [],
        featured: false
      }
    ],
    services: [
      {
        name: "Architectural Design",
        description: "Complete architectural design services from concept to construction documents",
        scope: ["Schematic Design", "Design Development", "Construction Documents", "Construction Administration"]
      },
      {
        name: "Master Planning",
        description: "Large-scale planning and urban design for communities and developments",
        scope: ["Site Analysis", "Programming", "Zoning Compliance", "Infrastructure Planning"]
      },
      {
        name: "Sustainable Design",
        description: "Green building design and LEED certification consulting",
        scope: ["Energy Modeling", "LEED Certification", "Sustainable Systems", "Performance Analysis"]
      },
      {
        name: "Interior Architecture",
        description: "Integrated interior design for commercial and residential projects",
        scope: ["Space Planning", "Material Selection", "Custom Millwork", "Lighting Design"]
      }
    ],
    process: [
      { phase: "Discovery", description: "Understanding client needs, site analysis, and programming", duration: "2-4 weeks" },
      { phase: "Concept Design", description: "Initial design concepts and schematic development", duration: "4-6 weeks" },
      { phase: "Design Development", description: "Refining design, systems coordination, and documentation", duration: "6-8 weeks" },
      { phase: "Construction Documents", description: "Detailed drawings and specifications for construction", duration: "8-12 weeks" },
      { phase: "Construction Administration", description: "Project oversight and quality assurance during construction", duration: "Variable" }
    ]
  }

  const categories = [
    { id: 'all', name: 'All Projects', count: architectData.projects.length },
    { id: 'residential', name: 'Residential', count: architectData.projects.filter(p => p.category === 'residential').length },
    { id: 'commercial', name: 'Commercial', count: architectData.projects.filter(p => p.category === 'commercial').length },
    { id: 'cultural', name: 'Cultural', count: architectData.projects.filter(p => p.category === 'cultural').length },
    { id: 'mixed-use', name: 'Mixed Use', count: architectData.projects.filter(p => p.category === 'mixed-use').length }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? architectData.projects 
    : architectData.projects.filter(project => project.category === selectedCategory)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {!isPublic && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            )}
            <div className="flex items-center space-x-4">
              {!isPublic && (
                <button
                  onClick={() => navigate('/editor/architect')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <span>Use This Template</span>
                </button>
              )}
              <img
                src={architectData.avatar}
                alt={architectData.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{architectData.name}</h1>
                <p className="text-blue-600">{architectData.title}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
              <a href="#process" className="text-gray-600 hover:text-blue-600 transition-colors">Process</a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <img
                src={architectData.avatar}
                alt={architectData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white/20"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              variants={fadeInUp}
            >
              {architectData.name}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl text-blue-200 mb-2"
              variants={fadeInUp}
            >
              {architectData.title}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-blue-100 mb-6"
              variants={fadeInUp}
            >
              {architectData.firm}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-8"
              variants={fadeInUp}
            >
              {architectData.licenses.map((license, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {license}
                </span>
              ))}
            </motion.div>
            
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {architectData.bio}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <a
                href="#projects"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center group"
              >
                <Building2 className="w-5 h-5 mr-2" />
                View Projects
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="#contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Discuss Your Project
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Award-winning architectural projects that shape communities and inspire living
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {architectData.projects.filter(p => p.featured).map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize">
                        {project.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.year}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{project.client}</p>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Location:</span>
                        <p className="text-gray-600">{project.location}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Size:</span>
                        <p className="text-gray-600">{project.size}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Budget:</span>
                        <p className="text-gray-600">{project.budget}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <p className="text-gray-600">{project.status}</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Awards */}
                    {project.awards.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-600 font-medium">
                          {project.awards.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={fadeInUp}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </motion.div>

            {/* All Projects Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={staggerChildren}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                  variants={fadeInUp}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h4>
                    <p className="text-sm text-blue-600 mb-2">{project.client}</p>
                    <p className="text-sm text-gray-600 mb-3">{project.location}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.size}</span>
                      <span className={project.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Design Process
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A collaborative approach from concept to construction
              </p>
            </motion.div>

            <div className="relative">
              {/* Process Timeline */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
              
              {architectData.process.map((phase, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  variants={fadeInUp}
                >
                  <div className="flex-1 lg:w-1/2">
                    <div className={`bg-white p-6 rounded-lg shadow-md ${
                      index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                    }`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.phase}</h3>
                      <p className="text-gray-600 mb-3">{phase.description}</p>
                      <div className="text-sm text-blue-600 font-semibold">
                        Duration: {phase.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block relative">
                    <div className="w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow"></div>
                  </div>
                  
                  <div className="flex-1 lg:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Architectural Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive design services from concept to completion
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {architectData.services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-200"
                  variants={fadeInUp}
                >
                  <div className="mb-6">
                    {index === 0 && <Ruler className="w-10 h-10 text-blue-600" />}
                    {index === 1 && <Home className="w-10 h-10 text-blue-600" />}
                    {index === 2 && <Lightbulb className="w-10 h-10 text-blue-600" />}
                    {index === 3 && <Building2 className="w-10 h-10 text-blue-600" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.name}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.scope.map((item, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              Let's Build Something Extraordinary
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Ready to discuss your next architectural project? Let's create spaces that inspire and endure.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${architectData.email}`}
                className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{architectData.email}</span>
              </a>
              
              <a
                href={`tel:${architectData.phone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{architectData.phone}</span>
              </a>
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-6"
              variants={fadeInUp}
            >
              <a
                href={architectData.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-8 h-8" />
              </a>
              <a
                href={architectData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Users className="w-8 h-8" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Architect Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Michael Chen</h3>
              <p className="text-gray-400 mb-4">
                © 2025 Michael Chen. Designing spaces that inspire and endure.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <a href="mailto:portfolio.builder659@gmail.com" className="hover:text-white transition-colors">
                  portfolio.builder659@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Projects</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Portfolio Builder Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Portfolio Builder</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Create your professional portfolio with our easy-to-use platform.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Questions?</span>
                <a href="mailto:portfolio.builder659@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Made with Portfolio Builder • <a href="mailto:portfolio.builder659@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">Get Help</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ArchitectTemplate