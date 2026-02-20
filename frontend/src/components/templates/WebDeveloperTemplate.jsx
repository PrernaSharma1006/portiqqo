import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  Code, 
  Star, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Monitor,
  Server,
  Database,
  Smartphone,
  Globe,
  Settings,
  Users,
  Award,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function WebDeveloperTemplate({ 
  isPublic = false, 
  portfolioData = {}, 
  personalInfo = {}, 
  socialLinks = {}, 
  skills = [], 
  projects = [] 
}) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  // Sample data for the template
  const profileData = {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    description: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud technologies with a focus on creating efficient, user-friendly solutions.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=400&fit=crop",
    location: "San Francisco, CA",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    website: "www.alexjohnson.dev",
    resumeUrl: "/resume.pdf",
    social: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      website: "https://alexjohnson.dev"
    },
    projects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
        githubUrl: "https://github.com/alexjohnson/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.alexjohnson.dev",
        featured: true,
        stats: { stars: 124, forks: 34, commits: 156 },
        category: "fullstack"
      },
      {
        id: 2,
        title: "Task Management App",
        description: "Collaborative task management tool with real-time updates, team collaboration, and project tracking.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
        technologies: ["Next.js", "TypeScript", "Prisma", "Socket.io", "Vercel"],
        githubUrl: "https://github.com/alexjohnson/task-manager",
        liveUrl: "https://taskmanager.alexjohnson.dev",
        featured: true,
        stats: { stars: 89, forks: 23, commits: 203 },
        category: "fullstack"
      },
      {
        id: 3,
        title: "Weather Dashboard",
        description: "Real-time weather dashboard with location-based forecasts and interactive maps.",
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
        technologies: ["Vue.js", "Express.js", "MongoDB", "Chart.js", "OpenWeather API"],
        githubUrl: "https://github.com/alexjohnson/weather-dashboard",
        liveUrl: "https://weather.alexjohnson.dev",
        featured: false,
        stats: { stars: 45, forks: 12, commits: 87 },
        category: "frontend"
      },
      {
        id: 4,
        title: "Blog CMS",
        description: "Content management system for bloggers with markdown support and SEO optimization.",
        image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=600&h=400&fit=crop",
        technologies: ["React", "Django", "PostgreSQL", "Redis", "Docker"],
        githubUrl: "https://github.com/alexjohnson/blog-cms",
        liveUrl: "https://blog-cms.alexjohnson.dev",
        featured: false,
        stats: { stars: 67, forks: 19, commits: 134 },
        category: "frontend"
      },
      {
        id: 5,
        title: "API Gateway",
        description: "Microservices API gateway with rate limiting, authentication, and monitoring.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
        technologies: ["Node.js", "Redis", "JWT", "Docker", "Kubernetes"],
        githubUrl: "https://github.com/alexjohnson/api-gateway",
        liveUrl: null,
        featured: false,
        stats: { stars: 78, forks: 25, commits: 98 },
        category: "backend"
      },
      {
        id: 6,
        title: "Portfolio Website",
        description: "Responsive portfolio website built with modern web technologies and optimized for performance.",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
        githubUrl: "https://github.com/alexjohnson/portfolio",
        liveUrl: "https://alexjohnson.dev",
        featured: false,
        stats: { stars: 34, forks: 8, commits: 76 },
        category: "tools"
      }
    ],
    experience: [
      {
        company: "TechCorp Inc.",
        position: "Senior Full Stack Developer",
        duration: "2022 - Present",
        description: "Lead development of web applications serving 100k+ users. Implemented microservices architecture and improved system performance by 40%."
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        duration: "2020 - 2022",
        description: "Built and maintained multiple web applications. Collaborated with design team to implement responsive UIs and optimize user experience."
      },
      {
        company: "WebSolutions",
        position: "Junior Developer",
        duration: "2019 - 2020",
        description: "Developed and maintained client websites. Gained experience in various technologies and contributed to team projects."
      }
    ]
  }

  const skillsData = [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Node.js", level: 88 },
    { name: "Python", level: 85 },
    { name: "Next.js", level: 92 },
    { name: "PostgreSQL", level: 80 },
    { name: "AWS", level: 78 },
    { name: "Docker", level: 75 }
  ]

  const servicesData = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Frontend Development",
      description: "Modern, responsive web applications using React, Vue, and cutting-edge CSS frameworks."
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Backend Development",
      description: "Scalable server-side solutions with Node.js, Python, and cloud infrastructure."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database Design",
      description: "Efficient database architecture and optimization for PostgreSQL, MongoDB, and more."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Responsive designs that work seamlessly across all devices and screen sizes."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "API Development",
      description: "RESTful and GraphQL APIs with comprehensive documentation and testing."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "DevOps & Deployment",
      description: "CI/CD pipelines, containerization, and cloud deployment solutions."
    }
  ]

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'backend', name: 'Backend' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'tools', name: 'Tools' }
  ]

  // Use passed projects if in public mode and projects exist, otherwise use demo data
  const projectsToDisplay = isPublic && projects.length > 0 
    ? projects 
    : profileData.projects;

  console.log('=== WEB DEVELOPER TEMPLATE DEBUG ===');
  console.log('isPublic:', isPublic);
  console.log('projects prop:', projects);
  console.log('projects.length:', projects?.length);
  console.log('profileData.projects:', profileData.projects);
  console.log('projectsToDisplay:', projectsToDisplay);

  // Map projects to ensure they have proper structure and category
  const workData = projectsToDisplay.map((project, index) => {
    const mapped = {
      ...project,
      id: project.id || project._id || index,
      image: project.images?.[0]?.url || project.image || 'https://via.placeholder.com/600x400',
      category: project.category || 'fullstack',
      technologies: project.technologies || [],
      liveUrl: project.links?.live || project.liveUrl,
      githubUrl: project.links?.github || project.githubUrl,
      stats: project.stats || { stars: 0, forks: 0, commits: 0 }
    };
    console.log(`Mapped project ${index}:`, mapped);
    console.log(`  - category: ${mapped.category}`);
    return mapped;
  });

  console.log('workData array:', workData);
  console.log('selectedCategory:', selectedCategory);

  const filteredWork = selectedCategory === 'all' 
    ? workData 
    : workData.filter(work => work.category === selectedCategory)

  console.log('filteredWork:', filteredWork);
  console.log('filteredWork.length:', filteredWork.length);

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
                onClick={() => navigate('/editor/web-developer')}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Code className="w-4 h-4" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
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
              My Projects
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Explore my portfolio of web development projects showcasing modern technologies and best practices
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
                    ? 'bg-blue-600 text-white'
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
            {filteredWork.map((project) => (
              <motion.div
                key={project.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {project.stats && (project.stats.stars > 0 || project.stats.commits > 0) && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {project.stats.stars > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {project.stats.stars}
                          </div>
                        )}
                        {project.stats.commits > 0 && (
                          <div className="flex items-center">
                            <Code className="w-4 h-4 mr-1" />
                            {project.stats.commits}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                Technical expertise in modern web development technologies and frameworks
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
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
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
                Comprehensive web development services from concept to deployment
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-6">
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
                Work Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                My professional journey and career progression
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {profileData.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="relative pl-8 pb-12 last:pb-0"
                  variants={fadeInUp}
                >
                  {/* Timeline line */}
                  {index !== profileData.experience.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-blue-200"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow"></div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-lg text-blue-600 font-semibold">{exp.company}</p>
                      </div>
                      <div className="flex items-center text-gray-500 mt-2 md:mt-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
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
                Full-stack developer passionate about creating scalable web applications and innovative digital solutions.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">5+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">50+</div>
                  <div className="text-sm text-gray-400">Projects Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">25+</div>
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
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
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

export default WebDeveloperTemplate