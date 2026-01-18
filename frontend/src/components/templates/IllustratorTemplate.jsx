import { useState } from 'react'
import { motion } from 'framer-motion'
import { Paintbrush, ExternalLink, Star, Calendar, MapPin, Mail, Phone, Download, ArrowRight, Heart, Eye, Palette, Award } from 'lucide-react'

function IllustratorTemplate() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)
  const navigate = useNavigate()

  const illustratorData = {
    name: "Luna Martinez",
    title: "Digital Illustrator & Visual Artist",
    specialties: ["Digital Art", "Character Design", "Book Illustrations", "Concept Art"],
    location: "Portland, OR",
    email: "luna.martinez@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300",
    bio: "Creative illustrator passionate about bringing stories to life through visual art. Specializing in digital illustrations, character design, and concept art for books, games, and brands.",
    website: "https://lunamartinez.art",
    social: {
      instagram: "https://instagram.com/lunamartinez.art",
      artstation: "https://artstation.com/lunamartinez",
      behance: "https://behance.net/lunamartinez"
    },
    tools: {
      software: ["Adobe Photoshop", "Procreate", "Adobe Illustrator", "Clip Studio Paint", "Blender", "After Effects"],
      hardware: ["iPad Pro", "Apple Pencil", "Wacom Cintiq Pro", "MacBook Pro", "Pantone Color Guide"]
    },
    artwork: [
      {
        id: 1,
        title: "Fantasy Character Series",
        category: "character",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        description: "Original fantasy character designs for an upcoming indie game",
        year: "2024",
        medium: "Digital Art",
        software: "Photoshop, Procreate",
        likes: 2456,
        featured: true
      },
      {
        id: 2,
        title: "Children's Book Illustrations",
        category: "book",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
        description: "Whimsical illustrations for 'The Magic Garden' children's book",
        year: "2024",
        medium: "Digital Art",
        software: "Procreate, Photoshop",
        likes: 1834,
        featured: true
      },
      {
        id: 3,
        title: "Brand Mascot Design",
        category: "commercial",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
        description: "Friendly mascot character for TechStart Inc.",
        year: "2024",
        medium: "Digital Art",
        software: "Illustrator, After Effects",
        likes: 1245,
        featured: false
      },
      {
        id: 4,
        title: "Concept Art Portfolio",
        category: "concept",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        description: "Environmental concept art for sci-fi film project",
        year: "2023",
        medium: "Digital Painting",
        software: "Photoshop, Blender",
        likes: 3421,
        featured: false
      },
      {
        id: 5,
        title: "Portrait Commission",
        category: "portrait",
        image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800",
        description: "Custom digital portrait commission",
        year: "2024",
        medium: "Digital Art",
        software: "Procreate",
        likes: 892,
        featured: false
      },
      {
        id: 6,
        title: "Nature Study Series",
        category: "nature",
        image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800",
        description: "Botanical illustration series",
        year: "2023",
        medium: "Digital Art",
        software: "Photoshop, Illustrator",
        likes: 1567,
        featured: false
      }
    ],
    services: [
      {
        name: "Character Design",
        price: "Starting at $400",
        description: "Original character designs for games, books, and brands",
        turnaround: "1-2 weeks"
      },
      {
        name: "Book Illustrations",
        price: "Starting at $200/page",
        description: "Custom illustrations for children's books and novels",
        turnaround: "2-3 weeks"
      },
      {
        name: "Concept Art",
        price: "Starting at $600",
        description: "Environmental and character concept art for media projects",
        turnaround: "1-3 weeks"
      },
      {
        name: "Commercial Illustration",
        price: "Starting at $500",
        description: "Brand illustrations, mascots, and marketing artwork",
        turnaround: "1-2 weeks"
      }
    ],
    testimonials: [
      {
        name: "Sarah Chen",
        company: "Moonbeam Publishing",
        text: "Luna's illustrations brought our children's book to life in the most magical way. Kids and parents absolutely love the artwork!",
        rating: 5,
        project: "Children's Book Illustrations"
      },
      {
        name: "Alex Thompson",
        company: "Indie Game Studio",
        text: "The character designs Luna created exceeded all our expectations. Her attention to detail and creativity is outstanding.",
        rating: 5,
        project: "Fantasy Character Series"
      }
    ],
    process: [
      { step: 1, title: "Consultation", description: "Discuss your vision, style preferences, and project requirements" },
      { step: 2, title: "Sketching", description: "Create initial concept sketches and gather your feedback" },
      { step: 3, title: "Development", description: "Develop chosen concepts with detailed digital artwork" },
      { step: 4, title: "Refinement", description: "Polish and refine the artwork based on your input" },
      { step: 5, title: "Delivery", description: "Provide final high-resolution files in required formats" }
    ]
  }

  const categories = [
    { id: 'all', name: 'All Work', count: illustratorData.artwork.length },
    { id: 'character', name: 'Characters', count: illustratorData.artwork.filter(a => a.category === 'character').length },
    { id: 'book', name: 'Book Art', count: illustratorData.artwork.filter(a => a.category === 'book').length },
    { id: 'concept', name: 'Concept Art', count: illustratorData.artwork.filter(a => a.category === 'concept').length },
    { id: 'commercial', name: 'Commercial', count: illustratorData.artwork.filter(a => a.category === 'commercial').length }
  ]

  const filteredArtwork = selectedCategory === 'all' 
    ? illustratorData.artwork 
    : illustratorData.artwork.filter(art => art.category === selectedCategory)

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <motion.header 
        className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/editor/illustrator')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <span>Use This Template</span>
              </button>
              <img
                src={illustratorData.avatar}
                alt={illustratorData.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{illustratorData.name}</h1>
                <p className="text-purple-600">{illustratorData.title}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#portfolio" className="text-gray-600 hover:text-purple-600 transition-colors">Portfolio</a>
              <a href="#process" className="text-gray-600 hover:text-purple-600 transition-colors">Process</a>
              <a href="#services" className="text-gray-600 hover:text-purple-600 transition-colors">Services</a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                src={illustratorData.avatar}
                alt={illustratorData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-purple-200"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-gray-900"
              variants={fadeInUp}
            >
              {illustratorData.name}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl text-purple-600 mb-6"
              variants={fadeInUp}
            >
              {illustratorData.title}
            </motion.h2>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-8"
              variants={fadeInUp}
            >
              {illustratorData.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {illustratorData.bio}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <a
                href="#portfolio"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 flex items-center group"
              >
                <Paintbrush className="w-5 h-5 mr-2" />
                View Portfolio
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="#contact"
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200"
              >
                Commission Artwork
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artwork */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Artwork
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Original illustrations that tell stories and capture imagination
              </p>
            </motion.div>

            {/* Featured Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {illustratorData.artwork.filter(art => art.featured).map((artwork) => (
                <motion.div
                  key={artwork.id}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <div 
                    className="aspect-square cursor-pointer"
                    onClick={() => setLightboxImage(artwork)}
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/90 text-purple-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full capitalize">
                        {artwork.category}
                      </span>
                      <span className="text-sm text-gray-500">{artwork.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{artwork.title}</h3>
                    <p className="text-gray-600 mb-4">{artwork.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="font-semibold text-gray-700 w-20">Medium:</span>
                        <span className="text-gray-600">{artwork.medium}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-semibold text-gray-700 w-20">Tools:</span>
                        <span className="text-gray-600">{artwork.software}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-pink-500">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">{artwork.likes}</span>
                        </div>
                        <button className="text-gray-400 hover:text-purple-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              variants={fadeInUp}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </motion.div>

            {/* All Artwork Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerChildren}
            >
              {filteredArtwork.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                  variants={fadeInUp}
                  onClick={() => setLightboxImage(artwork)}
                >
                  <div className="aspect-square cursor-pointer">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{artwork.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{artwork.medium}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{artwork.year}</span>
                      <div className="flex items-center text-pink-500">
                        <Heart className="w-3 h-3 mr-1" />
                        <span className="text-xs">{artwork.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
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
                My Creative Process
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                How I bring your vision to life through collaborative artwork
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {illustratorData.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="text-center"
                  variants={fadeInUp}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  
                  {index < illustratorData.process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-purple-200 transform translate-x-4"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Illustration Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Custom artwork tailored to your project needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {illustratorData.services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-purple-100"
                  variants={fadeInUp}
                >
                  <div className="mb-4">
                    <Palette className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-purple-600 mb-2">{service.price}</p>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-sm text-gray-500">
                    Turnaround: {service.turnaround}
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
              Let's Create Something Beautiful
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Ready to bring your story to life through custom illustrations?
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${illustratorData.email}`}
                className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{illustratorData.email}</span>
              </a>
              
              <a
                href={`tel:${illustratorData.phone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{illustratorData.phone}</span>
              </a>
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-6"
              variants={fadeInUp}
            >
              <a
                href={illustratorData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Paintbrush className="w-8 h-8" />
              </a>
              <a
                href={illustratorData.social.artstation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-8 h-8" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightboxImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-white">{lightboxImage.title}</h3>
              <p className="text-gray-300">{lightboxImage.medium} • {lightboxImage.software}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Illustrator Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Maya Chen</h3>
              <p className="text-gray-400 mb-4">
                © 2025 Maya Chen. Bringing imagination to life through illustration.
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
              <h3 className="text-lg font-semibold mb-4">Artwork</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
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
                <a href="mailto:portfolio.builder659@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Made with Portfolio Builder • <a href="mailto:portfolio.builder659@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">Get Help</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default IllustratorTemplate