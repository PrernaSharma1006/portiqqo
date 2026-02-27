import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  ExternalLink, 
  Star, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Download, 
  ArrowRight, 
  Award, 
  Users, 
  Eye, 
  Heart, 
  Filter, 
  ArrowLeft,
  Globe,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Settings,
  PenTool
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function GeneralPortfolioTemplate({ isPublic = false, portfolioData = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSection, setSelectedSection] = useState('portfolio')
  const navigate = useNavigate()

  // Sample data for the template
  const profileData = {
    name: "Taylor Morgan",
    title: "Creative Professional",
    description: "Versatile creative professional with expertise spanning multiple disciplines. Passionate about innovative solutions, compelling storytelling, and delivering exceptional results across diverse projects and industries.",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop",
    location: "San Francisco, CA",
    email: "taylor.morgan@email.com",
    phone: "+1 (555) 789-0123",
    website: "www.taylormorgan.portfolio",
    social: {
      linkedin: "https://linkedin.com/in/taylormorgan",
      twitter: "https://twitter.com/taylormorgan",
      instagram: "https://instagram.com/taylormorgan",
      behance: "https://behance.net/taylormorgan"
    },
    portfolio: [
      {
        id: 1,
        title: "Brand Identity & Campaign",
        category: "branding",
        client: "EcoLife Wellness",
        year: "2024",
        type: "Commercial Project",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
        description: "Complete brand identity design and launch campaign for sustainable wellness brand, including logo, packaging, and digital marketing materials.",
        skills: ["Brand Strategy", "Visual Identity", "Package Design", "Campaign Development"],
        results: "300% increase in brand recognition, 150% boost in sales",
        link: "#",
        featured: true,
        testimonial: {
          text: "Taylor's creative vision transformed our brand completely. The results exceeded all expectations.",
          author: "Sarah Chen, CEO EcoLife Wellness"
        }
      },
      {
        id: 2,
        title: "Digital Experience Platform",
        category: "digital",
        client: "TechForward Inc.",
        year: "2024",
        type: "Web Development",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        description: "User-centered digital platform design and development, featuring responsive design, user research, and conversion optimization.",
        skills: ["UX Design", "Web Development", "User Research", "Conversion Optimization"],
        results: "40% increase in user engagement, 25% improvement in conversion rates",
        link: "#",
        featured: true,
        testimonial: {
          text: "The platform Taylor designed perfectly captured our vision and improved our user experience dramatically.",
          author: "Mike Rodriguez, CTO TechForward"
        }
      },
      {
        id: 3,
        title: "Editorial Design Series",
        category: "editorial",
        client: "Modern Living Magazine",
        year: "2023",
        type: "Print & Digital",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
        description: "Magazine layout design, typography, and visual storytelling for quarterly lifestyle publication with national distribution.",
        skills: ["Editorial Design", "Typography", "Photography Direction", "Print Production"],
        results: "25% increase in readership, Award for Best Magazine Design",
        link: "#",
        featured: false
      },
      {
        id: 4,
        title: "Event Experience Design",
        category: "event",
        client: "Innovation Summit 2023",
        year: "2023",
        type: "Event Design",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        description: "Complete event experience design including signage, digital displays, promotional materials, and attendee journey mapping.",
        skills: ["Event Design", "Environmental Graphics", "Attendee Experience", "Project Management"],
        results: "500+ attendees, 95% satisfaction rating, Featured in Event Design Magazine",
        link: "#",
        featured: false
      },
      {
        id: 5,
        title: "Social Impact Campaign",
        category: "nonprofit",
        client: "Clean Ocean Initiative",
        year: "2023",
        type: "Social Campaign",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
        description: "Awareness campaign design for ocean conservation nonprofit, including video content, social media strategy, and fundraising materials.",
        skills: ["Campaign Strategy", "Video Production", "Social Media", "Fundraising Design"],
        results: "$250K raised, 50K social media impressions, Documentary feature",
        link: "#",
        featured: false
      },
      {
        id: 6,
        title: "Product Launch Strategy",
        category: "marketing",
        client: "StartupXYZ",
        year: "2024",
        type: "Product Marketing",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
        description: "End-to-end product launch strategy including market research, competitive analysis, messaging, and multi-channel campaign execution.",
        skills: ["Market Research", "Product Marketing", "Campaign Management", "Analytics"],
        results: "10K pre-orders, 200% target achievement, Featured in TechCrunch",
        link: "#",
        featured: false
      },
      {
        id: 7,
        title: "Artistic Collaboration",
        category: "art",
        client: "Gallery Modern",
        year: "2023",
        type: "Art Direction",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        description: "Art direction and curation for contemporary art exhibition, including catalog design, promotional materials, and digital experience.",
        skills: ["Art Direction", "Curation", "Catalog Design", "Exhibition Marketing"],
        results: "15K visitors, Sold-out opening night, Arts Council recognition",
        link: "#",
        featured: false
      },
      {
        id: 8,
        title: "Corporate Training Platform",
        category: "education",
        client: "Global Corp University",
        year: "2024",
        type: "Educational Design",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        description: "Learning experience design for corporate training platform, including course design, interactive elements, and progress tracking.",
        skills: ["Learning Design", "Instructional Design", "Interactive Media", "Assessment Design"],
        results: "90% completion rate, 85% knowledge retention, Company-wide implementation",
        link: "#",
        featured: false
      }
    ],
    services: [
      {
        name: "Creative Direction",
        description: "Strategic creative leadership for brand and campaign development",
        deliverables: ["Creative Strategy", "Brand Guidelines", "Campaign Concepts", "Team Leadership"]
      },
      {
        name: "Brand & Identity Design",
        description: "Complete brand identity systems from concept to implementation",
        deliverables: ["Logo Design", "Brand Guidelines", "Marketing Materials", "Digital Assets"]
      },
      {
        name: "Digital Experience Design",
        description: "User-centered digital products and interactive experiences",
        deliverables: ["UX/UI Design", "Prototyping", "User Testing", "Implementation Support"]
      },
      {
        name: "Campaign Development",
        description: "Integrated marketing campaigns across multiple touchpoints",
        deliverables: ["Campaign Strategy", "Creative Assets", "Multi-channel Execution", "Performance Analysis"]
      },
      {
        name: "Project Management",
        description: "End-to-end project leadership and creative production management",
        deliverables: ["Project Planning", "Team Coordination", "Quality Assurance", "Timeline Management"]
      },
      {
        name: "Consulting & Strategy",
        description: "Creative and strategic consulting for businesses and organizations",
        deliverables: ["Strategic Planning", "Creative Audits", "Process Optimization", "Team Training"]
      }
    ],
    testimonials: [
      {
        name: "David Kim",
        company: "Innovation Labs",
        project: "Brand Transformation",
        text: "Taylor's strategic approach and creative excellence helped us completely reimagine our brand. The results speak for themselves.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      {
        name: "Lisa Wang",
        company: "Future Media Group",
        project: "Digital Campaign",
        text: "Working with Taylor was incredible. Their ability to blend strategy with creativity is exactly what our project needed.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150"
      },
      {
        name: "James Rodriguez",
        company: "Startup Accelerator",
        project: "Product Launch",
        text: "Taylor's comprehensive approach to our product launch exceeded all expectations. True creative partnership.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      }
    ],
    awards: [
      { name: "Creative Excellence Award", organization: "Design Council", year: "2024" },
      { name: "Campaign of the Year", organization: "Marketing Association", year: "2023" },
      { name: "Innovation in Design", organization: "Creative Industry Awards", year: "2023" },
      { name: "Best Digital Experience", organization: "UX Awards", year: "2023" }
    ],
    experience: [
      {
        company: "Freelance Creative Professional",
        position: "Creative Director & Consultant",
        duration: "2022 - Present",
        description: "Independent creative practice serving diverse clients across industries with strategic creative direction, brand development, and campaign management."
      },
      {
        company: "Creative Agency Pro",
        position: "Senior Creative Director",
        duration: "2020 - 2022",
        description: "Led creative teams on major brand campaigns, managed client relationships, and developed innovative creative solutions for Fortune 500 companies."
      },
      {
        company: "Digital Studios Inc.",
        position: "Creative Manager",
        duration: "2018 - 2020",
        description: "Managed creative projects from concept to delivery, collaborated with cross-functional teams, and mentored junior creative professionals."
      },
      {
        company: "Design Collective",
        position: "Creative Specialist",
        duration: "2016 - 2018",
        description: "Contributed to diverse creative projects, developed design skills across multiple disciplines, and built foundational creative expertise."
      }
    ]
  }

  const skillsData = [
    { name: "Creative Direction", level: 95 },
    { name: "Project Management", level: 90 },
    { name: "Brand Strategy", level: 88 },
    { name: "Visual Design", level: 85 },
    { name: "Content Creation", level: 87 },
    { name: "Team Leadership", level: 82 },
    { name: "Client Relations", level: 90 },
    { name: "Strategic Thinking", level: 92 }
  ]

  const servicesData = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Creative Direction",
      description: "Strategic creative leadership for brand and campaign development across all touchpoints."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Brand Strategy",
      description: "Comprehensive brand positioning and identity development for lasting market impact."
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Design Services",
      description: "Complete design solutions from concept through execution across digital and print media."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Campaign Development",
      description: "Integrated marketing campaigns that drive engagement and deliver measurable results."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Leadership",
      description: "Creative team management and mentorship to maximize project success and team growth."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Project Management",
      description: "End-to-end project coordination ensuring quality delivery within scope and timeline."
    }
  ]

  const workData = profileData.portfolio

  const categories = [
    { id: 'all', name: 'All Work', count: workData.length },
    { id: 'branding', name: 'Branding', count: workData.filter(p => p.category === 'branding').length },
    { id: 'digital', name: 'Digital', count: workData.filter(p => p.category === 'digital').length },
    { id: 'marketing', name: 'Marketing', count: workData.filter(p => p.category === 'marketing').length },
    { id: 'editorial', name: 'Editorial', count: workData.filter(p => p.category === 'editorial').length },
    { id: 'nonprofit', name: 'Social Impact', count: workData.filter(p => p.category === 'nonprofit').length }
  ]

  const filteredWork = selectedCategory === 'all' 
    ? workData 
    : workData.filter(item => item.category === selectedCategory)

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
              <>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
                <button
                  onClick={() => navigate('/builder/general')}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <span>Create Portfolio</span>
                </button>
              </>
            )}
            <div className="flex items-center space-x-4">
              {!isPublic && (
                <button
                  onClick={() => navigate('/editor/general')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  <span>Use This Template</span>
                </button>
              )}
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-indigo-600">{profileData.title}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#portfolio" className="text-gray-600 hover:text-indigo-600 transition-colors">Portfolio</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
              <a href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors">Services</a>
              <a href="#experience" className="text-gray-600 hover:text-indigo-600 transition-colors">Experience</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
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
                src={profileData.profileImage}
                alt={profileData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white/20"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              variants={fadeInUp}
            >
              {profileData.name}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl text-indigo-200 mb-2"
              variants={fadeInUp}
            >
              {profileData.title}
            </motion.h2>
            
            <motion.p 
              className="text-xl text-purple-200 mb-8"
              variants={fadeInUp}
            >
              {profileData.description}
            </motion.p>
            
            <motion.p 
              className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto"
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
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200 flex items-center group"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                View Portfolio
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="#contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Let's Collaborate
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Portfolio */}
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
                Featured Work
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A showcase of diverse creative projects across multiple industries and disciplines
              </p>
            </motion.div>

            {/* Featured Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {profileData.portfolio.filter(p => p.featured).map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full capitalize">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>
                    
                    <p className="text-indigo-600 font-semibold mb-1">{project.client}</p>
                    <p className="text-sm text-gray-500 mb-3">{project.type}</p>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    {/* Skills Used */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Results */}
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">Results:</h4>
                      <p className="text-sm text-green-700">{project.results}</p>
                    </div>
                    
                    {/* Testimonial */}
                    {project.testimonial && (
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-800 italic mb-2">"{project.testimonial.text}"</p>
                        <p className="text-xs text-indigo-600">— {project.testimonial.author}</p>
                      </div>
                    )}
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
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </motion.div>

            {/* All Portfolio Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerChildren}
            >
              {filteredWork.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group"
                  variants={fadeInUp}
                >
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white text-indigo-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded capitalize">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                    <p className="text-sm text-indigo-600 mb-1">{project.client}</p>
                    <p className="text-xs text-gray-500">{project.type}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Versatile skill set spanning creative, technical, and strategic disciplines
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Creative</h3>
                <div className="space-y-3">
                  {skillsData.slice(0, 3).map((skill, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Technical</h3>
                <div className="space-y-3">
                  {skillsData.slice(3, 6).map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Leadership</h3>
                <div className="space-y-3">
                  {skillsData.slice(6, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="bg-green-50 text-green-700 py-2 px-3 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Awards */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recognition & Awards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profileData.awards && profileData.awards.map((award, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center"
                  >
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">{award.name}</h4>
                    <p className="text-sm text-gray-600">{award.organization}</p>
                    <p className="text-xs text-gray-500 mt-1">{award.year}</p>
                  </div>
                ))}
              </div>
            </motion.div>
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
                Services Offered
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive creative services to bring your vision to life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200"
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></div>
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience & Testimonials */}
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Experience */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Experience</h2>
                <div className="space-y-6">
                  {profileData.experience && profileData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                        <p className="text-gray-600 text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Client Testimonials</h2>
                <div className="space-y-6">
                  {profileData.testimonials && profileData.testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-indigo-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-indigo-600">{testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
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
              Let's Create Something Amazing Together
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Ready to bring your next project to life? I'd love to hear about your vision and explore how we can collaborate.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${profileData.email}`}
                className="flex items-center space-x-3 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{profileData.email}</span>
              </a>
              
              <a
                href={`tel:${profileData.phone}`}
                className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 transition-colors"
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
                href={profileData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Users className="w-8 h-8" />
              </a>
              <a
                href={profileData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Heart className="w-8 h-8" />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Portfolio Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Taylor Morgan</h3>
              <p className="text-gray-400 mb-4">
                © 2025 Taylor Morgan. Multi-disciplinary creative professional.
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
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#experience" className="text-gray-400 hover:text-white transition-colors">Experience</a></li>
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
                <a href="mailto:portfolio.builder659@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Made with Portfolio Builder • <a href="mailto:portfolio.builder659@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">Get Help</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GeneralPortfolioTemplate