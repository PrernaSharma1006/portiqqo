import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  Award, 
  Users, 
  Clock, 
  Star,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Download,
  Video,
  Edit3,
  Camera,
  Music,
  Film,
  Monitor
} from 'lucide-react'

function VideoEditorTemplate({ isPublic = false }) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample data for the template
  const profileData = {
    name: "Alex Chen",
    title: "Professional Video Editor",
    description: "Creating cinematic stories through the art of video editing. Specializing in commercials, music videos, and documentary filmmaking with 8+ years of experience.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=400&fit=crop",
    location: "Los Angeles, CA",
    email: "alex@videoeditor.com",
    phone: "+1 (555) 123-4567",
    website: "www.alexchen.video"
  }

  const workData = [
    {
      id: 1,
      title: "Nike Commercial Campaign",
      category: "commercial",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      duration: "2:30",
      description: "High-energy commercial showcasing Nike's new athletic wear line with dynamic cuts and motion graphics.",
      client: "Nike",
      year: "2024"
    },
    {
      id: 2,
      title: "Indie Music Video",
      category: "music",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      duration: "3:45",
      description: "Artistic music video with color grading and creative transitions for emerging indie artist.",
      client: "Luna Records",
      year: "2024"
    },
    {
      id: 3,
      title: "Corporate Documentary",
      category: "documentary",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop",
      duration: "15:20",
      description: "Professional documentary showcasing company culture and innovation in the tech industry.",
      client: "TechCorp",
      year: "2023"
    },
    {
      id: 4,
      title: "Wedding Highlight Reel",
      category: "personal",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      duration: "4:12",
      description: "Emotional wedding highlight reel with cinematic color grading and storytelling.",
      client: "Private Client",
      year: "2024"
    },
    {
      id: 5,
      title: "Travel Vlog Series",
      category: "content",
      thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      duration: "8:30",
      description: "Engaging travel content with dynamic pacing and immersive storytelling.",
      client: "YouTube Creator",
      year: "2024"
    },
    {
      id: 6,
      title: "Product Launch Video",
      category: "commercial",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      duration: "1:45",
      description: "Sleek product reveal with motion graphics and professional color correction.",
      client: "StartupXYZ",
      year: "2023"
    }
  ]

  const skillsData = [
    { name: "Adobe Premiere Pro", level: 95 },
    { name: "After Effects", level: 90 },
    { name: "DaVinci Resolve", level: 85 },
    { name: "Final Cut Pro", level: 88 },
    { name: "Motion Graphics", level: 80 },
    { name: "Color Grading", level: 92 },
    { name: "Audio Editing", level: 75 },
    { name: "Storytelling", level: 95 }
  ]

  const servicesData = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Commercial Video Editing",
      description: "Professional editing for commercials, advertisements, and promotional content with high-impact results."
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Music Video Production",
      description: "Creative music video editing with artistic flair, color grading, and rhythm-based cuts."
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: "Documentary Editing",
      description: "Narrative-driven documentary editing that tells compelling stories and engages audiences."
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Content Creation",
      description: "Social media content, YouTube videos, and digital marketing materials optimized for engagement."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Event Videography",
      description: "Wedding videos, corporate events, and special occasions with cinematic quality editing."
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Post-Production",
      description: "Complete post-production services including color correction, audio mixing, and visual effects."
    }
  ]

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'music', name: 'Music Videos' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'personal', name: 'Personal' },
    { id: 'content', name: 'Content' }
  ]

  const filteredWork = selectedCategory === 'all' 
    ? workData 
    : workData.filter(work => work.category === selectedCategory)

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
      {/* Header - Only show navigation when not in public view */}
      {!isPublic && (
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Templates</span>
              </button>
              
              <button
                onClick={() => navigate('/editor/video-editor')}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Banner Section */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${profileData.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        
        {/* Profile Section Overlay */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <motion.div 
              className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {/* Profile Image */}
              <motion.div variants={fadeInUp}>
                <img
                  src={profileData.profileImage}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </motion.div>
              
              {/* Profile Info */}
              <motion.div className="flex-1 text-white" variants={fadeInUp}>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {profileData.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-3">
                  {profileData.title}
                </p>
                <p className="text-lg text-gray-300 max-w-2xl">
                  {profileData.description}
                </p>
              </motion.div>
              
              {/* Contact Info */}
              <motion.div className="text-white space-y-2" variants={fadeInUp}>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Showcase Section */}
      <section id="work" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              My Work
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Explore my portfolio of video editing projects across different genres and styles
            </motion.p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={fadeInUp}
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Work Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {filteredWork.map((work) => (
              <motion.div
                key={work.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-sm rounded">
                    {work.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {work.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{work.client}</span>
                    <span>{work.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                My Skills
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional expertise in industry-standard video editing software and techniques
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {skillsData.map((skill, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-4"
                  variants={fadeInUp}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Services I Provide
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive video editing and post-production services tailored to your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-lg mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
              <div className="space-y-3">
                <a 
                  href={`mailto:${profileData.email}`}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
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
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span>{profileData.location}</span>
                </div>
                <a 
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>{profileData.website}</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#work" className="block text-gray-300 hover:text-white transition-colors">
                  My Work
                </a>
                <a href="#skills" className="block text-gray-300 hover:text-white transition-colors">
                  Skills
                </a>
                <a href="#services" className="block text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-gray-300 mb-4">
                Professional video editor passionate about bringing stories to life through compelling visual narratives.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">8+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">500+</div>
                  <div className="text-sm text-gray-400">Projects Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 {profileData.name}. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Built with</span>
                <a 
                  href="mailto:portfolio.builder659@gmail.com"
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  Portfolio Builder
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VideoEditorTemplate