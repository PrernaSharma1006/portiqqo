import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Figma, 
  Palette, 
  Users, 
  Star, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Download, 
  ArrowRight, 
  Eye, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Zap,
  Search,
  Smartphone,
  Monitor,
  PenTool,
  Layout,
  Globe,
  Award,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function UIUXDesignerTemplate({ 
  isPublic = false, 
  portfolioData = {}, 
  personalInfo = {}, 
  socialLinks = {}, 
  skills = [], 
  projects = [] 
}) {
  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  // Sample data for the template
  const demoProfile = {
    name: "Jessica Chen",
    title: "UI/UX Designer",
    description: "Passionate UI/UX designer with 6+ years of experience creating user-centered digital experiences. Specializing in mobile apps, web platforms, and design systems that delight users and drive business results.",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=400&fit=crop",
    location: "New York, NY",
    email: "jessica.chen@email.com",
    phone: "+1 (555) 987-6543",
    website: "www.jessicachen.design",
    social: {
      dribbble: "https://dribbble.com/jessicachen",
      behance: "https://behance.net/jessicachen",
      linkedin: "https://linkedin.com/in/jessicachen"
    },
    caseStudies: [
      {
        id: 1,
        title: "FinTech Mobile App Redesign",
        subtitle: "Increasing user engagement by 40%",
        description: "Complete redesign of a financial mobile app focusing on user experience and accessibility improvements.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        category: "Mobile Design",
        duration: "3 months",
        year: "2024",
        client: "FinanceFlow Inc.",
        challenge: "Users were abandoning the app during onboarding and transaction flows",
        solution: "Simplified navigation, improved visual hierarchy, and streamlined user flows",
        impact: "40% increase in user engagement, 25% reduction in support tickets",
        tools: ["Figma", "Principle", "Maze"],
        featured: true,
        testimonial: {
          text: "Jessica's redesign transformed our app completely. User satisfaction scores increased dramatically.",
          author: "Sarah Johnson, Product Manager"
        }
      },
      {
        id: 2,
        title: "E-learning Platform Design",
        subtitle: "Designing for accessibility and engagement",
        description: "Created a comprehensive design system and interface for an online learning platform serving 50k+ students.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
        category: "Web Design",
        duration: "4 months",
        year: "2024",
        client: "EduTech Solutions",
        challenge: "Creating an engaging yet accessible learning environment for diverse users",
        solution: "Implemented WCAG guidelines, created adaptive components, and gamification elements",
        impact: "30% increase in course completion rates, 95% accessibility compliance",
        tools: ["Figma", "Adobe XD", "Hotjar"],
        featured: true,
        testimonial: {
          text: "The platform is beautiful and functional. Students love the new interface.",
          author: "Mark Davis, CEO"
        }
      },
      {
        id: 3,
        title: "Healthcare App UX Research",
        subtitle: "Understanding patient needs",
        description: "Conducted extensive user research for a telemedicine app, including interviews and usability testing.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
        category: "UX Research",
        duration: "2 months",
        year: "2023",
        client: "HealthConnect",
        challenge: "Understanding patient behavior and needs in digital healthcare",
        solution: "Multi-phase research including interviews, surveys, and prototype testing",
        impact: "Informed design decisions that improved patient satisfaction by 35%",
        tools: ["Miro", "Maze", "Zoom"],
        featured: false
      },
      {
        id: 4,
        title: "Design System Creation",
        subtitle: "Scaling design across teams",
        description: "Built a comprehensive design system for a SaaS company with 15+ product teams.",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
        category: "Design Systems",
        duration: "6 months",
        year: "2023",
        client: "TechCorp Inc.",
        challenge: "Inconsistent designs across multiple products and teams",
        solution: "Created unified component library, documentation, and design tokens",
        impact: "50% faster design-to-development handoff, improved brand consistency",
        tools: ["Figma", "Storybook", "Notion"],
        featured: false
      }
    ],
    awards: [
      { name: "Awwwards Site of the Day", year: "2024" },
      { name: "CSS Design Awards Winner", year: "2023" },
      { name: "UX Design Awards Honoree", year: "2023" }
    ],
    experience: [
      {
        company: "Design Studio Pro",
        position: "Senior UI/UX Designer",
        duration: "2022 - Present",
        description: "Lead designer for client projects, mentoring junior designers, and establishing design processes."
      },
      {
        company: "Tech Startup Inc.",
        position: "UI/UX Designer",
        duration: "2020 - 2022",
        description: "Designed mobile and web applications, conducted user research, and collaborated with development teams."
      },
      {
        company: "Creative Agency",
        position: "Junior Designer",
        duration: "2019 - 2020",
        description: "Created visual designs for digital campaigns, websites, and mobile applications."
      }
    ]
  }

  const profileData = isPublic ? {
    name: portfolioData.profile?.name || `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || demoProfile.name,
    title: portfolioData.profile?.title || portfolioData.profile?.tagline || personalInfo.tagline || demoProfile.title,
    description: portfolioData.profile?.description || portfolioData.profile?.bio || personalInfo.bio || demoProfile.description,
    profileImage: portfolioData.profile?.profileImage || portfolioData.profile?.image || personalInfo.profileImage?.url || demoProfile.profileImage,
    bannerImage: portfolioData.profile?.bannerImage || demoProfile.bannerImage,
    location: portfolioData.profile?.location || personalInfo.location || demoProfile.location,
    email: portfolioData.profile?.email || personalInfo.email || demoProfile.email,
    phone: portfolioData.profile?.phone || personalInfo.phone || demoProfile.phone,
    website: portfolioData.profile?.website || personalInfo.website || demoProfile.website,
    social: {
      dribbble: portfolioData.profile?.dribbble || socialLinks.dribbble || '',
      behance: portfolioData.profile?.behance || socialLinks.behance || '',
      linkedin: portfolioData.profile?.linkedin || socialLinks.linkedin || ''
    },
    caseStudies: demoProfile.caseStudies,
    awards: portfolioData.awards || demoProfile.awards,
    experience: portfolioData.experience || demoProfile.experience
  } : demoProfile

  const skillsData = isPublic && (portfolioData.skills?.length > 0 || skills.length > 0)
    ? (portfolioData.skills || skills).map(s => typeof s === 'string' ? { name: s, level: 80 } : { name: s.name || s, level: s.level || 80 })
    : [
    { name: "User Research", level: 95 },
    { name: "Wireframing", level: 92 },
    { name: "Prototyping", level: 90 },
    { name: "Visual Design", level: 88 },
    { name: "Interaction Design", level: 85 },
    { name: "Design Systems", level: 82 },
    { name: "Usability Testing", level: 80 },
    { name: "Figma", level: 95 }
  ]

  const servicesData = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "User Research",
      description: "In-depth user research including interviews, surveys, and usability testing to understand user needs."
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Complete interface design from wireframes to high-fidelity mockups with focus on user experience."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Design",
      description: "Native and responsive mobile app design optimized for iOS and Android platforms."
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Web Design",
      description: "Modern, responsive web design that works seamlessly across all devices and browsers."
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Design Systems",
      description: "Comprehensive design systems and component libraries for scalable design solutions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Prototyping",
      description: "Interactive prototypes and animations to validate concepts and demonstrate user flows."
    }
  ]

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'mobile', name: 'Mobile Design' },
    { id: 'web', name: 'Web Design' },
    { id: 'research', name: 'UX Research' },
    { id: 'systems', name: 'Design Systems' }
  ]

  // Use passed projects if in public mode and projects exist, otherwise use demo data
  const projectsToDisplay = isPublic && projects.length > 0 
    ? projects 
    : demoProfile.caseStudies;

  // Helper to check if a section is hidden in public view
  const isHidden = (name) => isPublic && (portfolioData.hiddenSections || []).includes(name)

  // Map projects to ensure they have proper structure and category
  const workData = projectsToDisplay.map((caseStudy, index) => ({
    ...caseStudy,
    id: caseStudy.id || caseStudy._id || index,
    image: caseStudy.images?.[0]?.url || caseStudy.image || 'https://via.placeholder.com/800',
    category: caseStudy.category ? 
      (caseStudy.category.toLowerCase().includes('mobile') ? 'mobile' :
       caseStudy.category.toLowerCase().includes('web') ? 'web' :
       caseStudy.category.toLowerCase().includes('research') ? 'research' :
       caseStudy.category.toLowerCase().includes('system') ? 'systems' : 'web') 
      : 'web',
    tools: caseStudy.tools || caseStudy.technologies || []
  }));

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
                onClick={() => navigate('/editor/ui-ux-designer')}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Palette className="w-4 h-4" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/60"></div>
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

      {/* Featured Case Studies */}
      <section id="work" className={`py-20 ${isHidden('caseStudies') ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Case Studies
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Solving real-world problems through thoughtful design and user research
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {profileData.caseStudies.filter(cs => cs.featured).map((caseStudy) => (
                <motion.div
                  key={caseStudy.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {caseStudy.category}
                      </span>
                      <span className="text-sm text-gray-500">{caseStudy.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{caseStudy.title}</h3>
                    <p className="text-purple-600 font-semibold mb-3">{caseStudy.subtitle}</p>
                    <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Challenge: </span>
                        <span className="text-sm text-gray-600">{caseStudy.challenge}</span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Impact: </span>
                        <span className="text-sm text-gray-600">{caseStudy.impact}</span>
                      </div>
                    </div>
                    
                    {caseStudy.tools && caseStudy.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {caseStudy.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {caseStudy.testimonial && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-800 italic">"{caseStudy.testimonial.text}"</p>
                        <p className="text-xs text-purple-600 mt-2">— {caseStudy.testimonial.author}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* All Case Studies Grid */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">All Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {profileData.caseStudies.map((caseStudy) => (
                  <div
                    key={caseStudy.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {caseStudy.category}
                        </span>
                        <span className="text-xs text-gray-500">{caseStudy.year}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{caseStudy.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{caseStudy.description}</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">{caseStudy.duration}</span>
                        <div className="flex space-x-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <Heart className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-20 bg-gray-50 ${isHidden('skills') ? 'hidden' : ''}`}>
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
                Design expertise and technical proficiency across UI/UX disciplines
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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
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
      <section id="services" className={`py-20 bg-white ${isHidden('services') ? 'hidden' : ''}`}>
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
                Comprehensive UX/UI design services from research to implementation
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

      {/* Experience */}
      <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Experience & Recognition
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Experience Timeline */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-8">Work Experience</h3>
                {profileData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-8 pb-8 last:pb-0"
                    variants={fadeInUp}
                  >
                    <div className="absolute left-2 top-2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow"></div>
                    {index !== profileData.experience.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-purple-200"></div>
                    )}
                    
                    <div className="bg-white rounded-lg p-6 shadow-sm ml-4">
                      <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                      <p className="text-purple-600 font-semibold mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-3">{exp.duration}</p>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Awards */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-8">Awards & Recognition</h3>
                <div className="space-y-4">
                  {profileData.awards.map((award, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-sm flex items-center"
                      variants={fadeInUp}
                    >
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{award.name}</h4>
                        <p className="text-gray-500">{award.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
              Let's Create Something Amazing
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              I'm always excited to work on new projects and collaborate with amazing teams
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${profileData.email}`}
                className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
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
                href={profileData.social.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Palette className="w-8 h-8" />
              </a>
              <a
                href={profileData.social.behance}
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
      <footer className={`bg-gray-900 text-white py-12 ${isHidden('footer') ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Designer Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{profileData.name}</h3>
              <p className="text-gray-400 mb-4">
                {portfolioData.footer?.copyright || `© ${new Date().getFullYear()} ${profileData.name}. ${profileData.title || 'UI/UX Designer'} crafting digital experiences.`}
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
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a></li>
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

export default UIUXDesignerTemplate