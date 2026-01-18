import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Instagram, 
  ExternalLink, 
  MapPin, 
  Mail, 
  Phone, 
  Download, 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  Eye, 
  Award, 
  ArrowLeft,
  Globe,
  Users,
  Star,
  Clock,
  Image,
  Settings,
  Film
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function PhotographerTemplate() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)
  const navigate = useNavigate()

  // Sample data for the template
  const profileData = {
    name: "Marcus Rivera",
    title: "Professional Photographer",
    description: "Capturing life's most precious moments through the lens. Specializing in weddings, portraits, and commercial photography with over 8 years of experience and an eye for storytelling.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=400&fit=crop",
    location: "Los Angeles, CA",
    email: "marcus.rivera@email.com",
    phone: "+1 (555) 234-5678",
    website: "www.marcusrivera.photo",
    social: {
      instagram: "https://instagram.com/marcusrivera",
      facebook: "https://facebook.com/marcusriveraphoto",
      twitter: "https://twitter.com/marcusphoto"
    },
    gallery: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        category: "wedding",
        title: "Romantic Wedding Ceremony",
        location: "Malibu, CA",
        camera: "Canon EOS R5",
        lens: "85mm f/1.4",
        likes: 234,
        featured: true
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=800",
        category: "portrait",
        title: "Professional Headshot",
        location: "Studio, LA",
        camera: "Sony A7R IV",
        lens: "50mm f/1.2",
        likes: 189,
        featured: true
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        category: "landscape",
        title: "Mountain Sunrise",
        location: "Yosemite National Park",
        camera: "Canon EOS 5D IV",
        lens: "24-70mm f/2.8",
        likes: 567,
        featured: true
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        category: "commercial",
        title: "Product Photography",
        location: "Studio, LA",
        camera: "Canon EOS R5",
        lens: "100mm f/2.8 Macro",
        likes: 145,
        featured: false
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
        category: "wedding",
        title: "Wedding Reception",
        location: "Beverly Hills, CA",
        camera: "Sony A7 III",
        lens: "24-105mm f/4",
        likes: 298,
        featured: false
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800",
        category: "portrait",
        title: "Fashion Portrait",
        location: "Downtown LA",
        camera: "Canon EOS R6",
        lens: "85mm f/1.2",
        likes: 412,
        featured: false
      },
      {
        id: 7,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        category: "landscape",
        title: "Coastal Sunset",
        location: "Big Sur, CA",
        camera: "Sony A7R V",
        lens: "16-35mm f/2.8",
        likes: 789,
        featured: false
      },
      {
        id: 8,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
        category: "commercial",
        title: "Restaurant Interior",
        location: "Santa Monica, CA",
        camera: "Canon EOS R5",
        lens: "14mm f/2.8",
        likes: 167,
        featured: false
      }
    ],
    testimonials: [
      {
        name: "Sarah & John Thompson",
        event: "Wedding Photography",
        text: "Marcus captured our special day perfectly! Every emotion, every detail was beautifully preserved. We couldn't be happier!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150"
      },
      {
        name: "Jennifer Martinez",
        event: "Corporate Headshots",
        text: "Professional, creative, and efficient. Marcus made the whole team feel comfortable and the results were stunning.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      }
    ],
    awards: [
      "Wedding Photography Award 2024",
      "Portrait Photographer of the Year 2023",
      "Best Commercial Photography 2023"
    ]
  }

  const skillsData = [
    { name: "Wedding Photography", level: 95 },
    { name: "Portrait Photography", level: 92 },
    { name: "Commercial Photography", level: 88 },
    { name: "Photo Editing", level: 90 },
    { name: "Event Photography", level: 85 },
    { name: "Landscape Photography", level: 82 },
    { name: "Product Photography", level: 80 },
    { name: "Studio Lighting", level: 87 }
  ]

  const servicesData = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Wedding Photography",
      description: "Complete wedding day coverage with artistic storytelling and timeless memories."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Portrait Sessions",
      description: "Professional headshots, family portraits, and personal branding photography."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Commercial Photography",
      description: "Product, brand, and business photography for marketing and advertising needs."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Event Photography",
      description: "Corporate events, parties, and special occasions captured with professional quality."
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Photo Editing",
      description: "Professional post-processing and retouching to enhance your photos."
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: "Video Services",
      description: "Wedding videography and promotional video content for businesses."
    }
  ]

  const workData = profileData.gallery

  const categories = [
    { id: 'all', name: 'All Work', count: workData.length },
    { id: 'wedding', name: 'Weddings', count: workData.filter(p => p.category === 'wedding').length },
    { id: 'portrait', name: 'Portraits', count: workData.filter(p => p.category === 'portrait').length },
    { id: 'landscape', name: 'Landscapes', count: workData.filter(p => p.category === 'landscape').length },
    { id: 'commercial', name: 'Commercial', count: workData.filter(p => p.category === 'commercial').length }
  ]

  const filteredWork = selectedCategory === 'all' 
    ? workData 
    : workData.filter(photo => photo.category === selectedCategory)

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header 
        className="bg-black/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/editor/photographer')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <span>Use This Template</span>
              </button>
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
              />
              <div>
                <h1 className="text-xl font-bold text-white">{profileData.name}</h1>
                <p className="text-gray-400">{profileData.title}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a>
              <a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920"
            alt="Photography"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <motion.div 
          className="relative text-center max-w-4xl mx-auto px-4"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-4xl md:text-7xl font-bold mb-6"
            variants={fadeInUp}
          >
            {profileData.name}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {profileData.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <a
              href="#portfolio"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center group"
            >
              <Camera className="w-5 h-5 mr-2" />
              View Portfolio
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200"
            >
              Book a Session
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Portfolio
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Capturing moments that tell stories and evoke emotions
              </p>
            </motion.div>

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
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </motion.div>

            {/* Gallery Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              variants={staggerChildren}
            >
              {filteredWork.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setLightboxImage(photo)}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold">{photo.title}</h3>
                      <p className="text-sm text-gray-300">{photo.location}</p>
                      <div className="flex items-center space-x-3 mt-2 text-sm">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {photo.likes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Photography Services
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Professional photography services tailored to your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-black border border-gray-800 rounded-lg p-6 hover:border-white transition-colors duration-200"
                  variants={fadeInUp}
                >
                  <div className="text-white mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                  <button className="mt-4 text-white hover:text-gray-300 transition-colors">
                    Learn More →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Clients Say
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profileData.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-800"
                  variants={fadeInUp}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.event}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={fadeInUp}
            >
              Let's Capture Your Story
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              variants={fadeInUp}
            >
              Ready to book your photography session? Let's discuss your vision and create something beautiful together.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${profileData.email}`}
                className="flex items-center space-x-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{profileData.email}</span>
              </a>
              
              <a
                href={`tel:${profileData.phone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{profileData.phone}</span>
              </a>
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-6"
              variants={fadeInUp}
            >
              <a
                href={profileData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a
                href={profileData.website}
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
              <p className="text-gray-300">{lightboxImage.camera} • {lightboxImage.lens}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Photographer Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Emma Rodriguez</h3>
              <p className="text-gray-400 mb-4">
                © 2025 Emma Rodriguez. Capturing moments, creating memories.
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
              <h3 className="text-lg font-semibold mb-4">Gallery</h3>
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

export default PhotographerTemplate