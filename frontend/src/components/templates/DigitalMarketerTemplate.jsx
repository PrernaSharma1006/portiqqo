import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, ExternalLink, Award, Calendar, MapPin, Mail, Phone, Download, ArrowRight, Target, Users, LineChart, PieChart, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function DigitalMarketerTemplate() {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const navigate = useNavigate()

  const marketerData = {
    name: "Sofia Rodriguez",
    title: "Digital Marketing Strategist",
    specialties: ["PPC Advertising", "Social Media", "SEO", "Content Marketing"],
    location: "Miami, FL",
    email: "sofia.rodriguez@email.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300",
    bio: "Results-driven digital marketing strategist with 8+ years of experience driving growth for brands across industries. Specialized in data-driven campaigns that deliver measurable ROI.",
    website: "https://sofiarodriguez.marketing",
    social: {
      linkedin: "https://linkedin.com/in/sofiarodriguez",
      twitter: "https://twitter.com/sofiamarketing",
      website: "https://sofiarodriguez.marketing"
    },
    certifications: [
      "Google Ads Certified",
      "Facebook Blueprint Certified",
      "HubSpot Inbound Certified",
      "Google Analytics IQ",
      "Salesforce Marketing Cloud"
    ],
    metrics: {
      overview: {
        totalBudgetManaged: "$2.5M+",
        avgROI: "340%",
        campaignsLaunched: "150+",
        clientsServed: "45+"
      }
    },
    campaigns: [
      {
        id: 1,
        title: "E-commerce Growth Campaign",
        client: "FashionForward Inc.",
        category: "E-commerce",
        duration: "6 months",
        budget: "$125,000",
        results: {
          roi: "450%",
          revenueGenerated: "$562,500",
          leadIncrease: "280%",
          cpaReduction: "65%"
        },
        channels: ["Google Ads", "Facebook Ads", "Email Marketing", "SEO"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
        description: "Complete digital transformation driving record-breaking revenue growth through integrated multi-channel approach.",
        featured: true,
        testimonial: {
          text: "Sofia's strategy increased our online revenue by 450%. Her data-driven approach was exactly what we needed.",
          author: "John Smith, CEO FashionForward"
        }
      },
      {
        id: 2,
        title: "SaaS Lead Generation",
        client: "TechSolutions Pro",
        category: "B2B SaaS",
        duration: "12 months",
        budget: "$200,000",
        results: {
          roi: "380%",
          mqls: "1,250",
          salesQualified: "340",
          cplReduction: "45%"
        },
        channels: ["LinkedIn Ads", "Content Marketing", "Marketing Automation", "Webinars"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
        description: "Sophisticated B2B lead generation strategy targeting enterprise clients with complex sales cycles.",
        featured: true,
        testimonial: {
          text: "Our lead quality improved dramatically. Sofia understood our B2B audience perfectly.",
          author: "Lisa Chen, CMO TechSolutions"
        }
      },
      {
        id: 3,
        title: "Local Business Revival",
        client: "Downtown Dining Group",
        category: "Local Business",
        duration: "4 months",
        budget: "$25,000",
        results: {
          roi: "320%",
          footTrafficIncrease: "150%",
          onlineOrders: "400%",
          brandAwareness: "180%"
        },
        channels: ["Google My Business", "Social Media", "Local SEO", "Influencer Marketing"],
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
        description: "Hyperlocal marketing strategy helping restaurant group recover and thrive post-pandemic.",
        featured: false
      },
      {
        id: 4,
        title: "Mobile App Launch",
        client: "FitTracker App",
        category: "Mobile App",
        duration: "3 months",
        budget: "$80,000",
        results: {
          roi: "290%",
          downloads: "125,000",
          activeUsers: "45,000",
          retention: "68%"
        },
        channels: ["App Store Optimization", "Social Media", "Influencer Marketing", "PR"],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
        description: "Comprehensive mobile app launch strategy driving rapid user acquisition and engagement.",
        featured: false
      },
      {
        id: 5,
        title: "Brand Awareness Campaign",
        client: "EcoLife Products",
        category: "Consumer Goods",
        duration: "8 months",
        budget: "$150,000",
        results: {
          roi: "250%",
          brandAwareness: "200%",
          socialFollowing: "300%",
          engagement: "180%"
        },
        channels: ["Social Media", "Content Marketing", "Influencer Partnerships", "PR"],
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
        description: "Sustainable brand positioning campaign building authentic connections with eco-conscious consumers.",
        featured: false
      }
    ],
    services: [
      {
        name: "PPC Management",
        price: "Starting at $2,500/mo",
        description: "Google Ads, Facebook Ads, and multi-platform campaign management with ROI optimization",
        deliverables: ["Campaign Setup", "Ongoing Optimization", "Monthly Reports", "A/B Testing"]
      },
      {
        name: "SEO Strategy",
        price: "Starting at $1,800/mo",
        description: "Complete SEO audit, strategy development, and implementation for organic growth",
        deliverables: ["Technical Audit", "Content Strategy", "Link Building", "Performance Tracking"]
      },
      {
        name: "Social Media Marketing",
        price: "Starting at $1,200/mo",
        description: "Social media strategy, content creation, and community management across platforms",
        deliverables: ["Content Calendar", "Community Management", "Influencer Outreach", "Analytics"]
      },
      {
        name: "Marketing Automation",
        price: "Starting at $2,000/mo",
        description: "Email marketing, lead nurturing, and customer journey optimization",
        deliverables: ["Automation Setup", "Email Campaigns", "Lead Scoring", "CRM Integration"]
      }
    ],
    tools: {
      analytics: ["Google Analytics", "Google Tag Manager", "Hotjar", "Mixpanel", "Tableau"],
      advertising: ["Google Ads", "Facebook Ads Manager", "LinkedIn Campaign Manager", "Microsoft Advertising"],
      automation: ["HubSpot", "Marketo", "Mailchimp", "Klaviyo", "Zapier"],
      seo: ["SEMrush", "Ahrefs", "Screaming Frog", "Google Search Console", "Moz"]
    }
  }

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
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/editor/digital-marketer')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <span>Use This Template</span>
              </button>
              <img
                src={marketerData.avatar}
                alt={marketerData.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{marketerData.name}</h1>
                <p className="text-orange-600">{marketerData.title}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#results" className="text-gray-600 hover:text-orange-600 transition-colors">Results</a>
              <a href="#campaigns" className="text-gray-600 hover:text-orange-600 transition-colors">Campaigns</a>
              <a href="#services" className="text-gray-600 hover:text-orange-600 transition-colors">Services</a>
              <a href="#tools" className="text-gray-600 hover:text-orange-600 transition-colors">Tools</a>
              <a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact</a>
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
                src={marketerData.avatar}
                alt={marketerData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white/20"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              variants={fadeInUp}
            >
              {marketerData.name}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl text-orange-200 mb-6"
              variants={fadeInUp}
            >
              {marketerData.title}
            </motion.h2>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-8"
              variants={fadeInUp}
            >
              {marketerData.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </motion.div>
            
            <motion.p 
              className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {marketerData.bio}
            </motion.p>
            
            {/* Key Metrics */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">{marketerData.metrics.overview.totalBudgetManaged}</div>
                <div className="text-orange-200 text-sm">Budget Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketerData.metrics.overview.avgROI}</div>
                <div className="text-orange-200 text-sm">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketerData.metrics.overview.campaignsLaunched}</div>
                <div className="text-orange-200 text-sm">Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketerData.metrics.overview.clientsServed}</div>
                <div className="text-orange-200 text-sm">Clients Served</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <a
                href="#campaigns"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center group"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Case Studies
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="#contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Get Strategy Consultation
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section id="campaigns" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Campaign Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Data-driven campaigns that delivered exceptional results for clients
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {marketerData.campaigns.filter(c => c.featured).map((campaign) => (
                <motion.div
                  key={campaign.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                        {campaign.category}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{campaign.results.roi}</div>
                        <div className="text-sm text-gray-500">ROI</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{campaign.title}</h3>
                    <p className="text-orange-600 font-semibold mb-3">{campaign.client}</p>
                    <p className="text-gray-600 mb-4">{campaign.description}</p>
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Object.entries(campaign.results).slice(1).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaign.channels.map((channel, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                    
                    {campaign.testimonial && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm text-orange-800 italic">"{campaign.testimonial.text}"</p>
                        <p className="text-xs text-orange-600 mt-2">— {campaign.testimonial.author}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* All Campaigns Grid */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">All Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketerData.campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          {campaign.category}
                        </span>
                        <span className="text-lg font-bold text-green-600">{campaign.results.roi}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{campaign.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{campaign.client}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{campaign.duration}</span>
                        <span>{campaign.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Marketing Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive digital marketing solutions to grow your business
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {marketerData.services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-orange-50 transition-all duration-200"
                  variants={fadeInUp}
                >
                  <div className="mb-4">
                    {index === 0 && <Target className="w-8 h-8 text-orange-600" />}
                    {index === 1 && <TrendingUp className="w-8 h-8 text-orange-600" />}
                    {index === 2 && <Users className="w-8 h-8 text-orange-600" />}
                    {index === 3 && <BarChart3 className="w-8 h-8 text-orange-600" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-3">{service.price}</p>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-1">
                    {service.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
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

      {/* Tools & Certifications */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tools & Expertise
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Tools */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Marketing Tools</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(marketerData.tools).map(([category, tools]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-gray-700 mb-3 capitalize">{category}</h4>
                      <div className="space-y-2">
                        {tools.map((tool, index) => (
                          <div
                            key={index}
                            className="bg-white p-2 rounded border text-sm"
                          >
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h3>
                <div className="space-y-3">
                  {marketerData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                    >
                      <Award className="w-6 h-6 text-orange-600 mr-3" />
                      <span className="font-medium text-gray-900">{cert}</span>
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
              Ready to Scale Your Business?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Let's discuss how data-driven marketing can accelerate your growth
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              variants={fadeInUp}
            >
              <a
                href={`mailto:${marketerData.email}`}
                className="flex items-center space-x-3 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{marketerData.email}</span>
              </a>
              
              <a
                href={`tel:${marketerData.phone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{marketerData.phone}</span>
              </a>
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-6"
              variants={fadeInUp}
            >
              <a
                href={marketerData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Users className="w-8 h-8" />
              </a>
              <a
                href={marketerData.social.website}
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
            {/* Marketer Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Sofia Rodriguez</h3>
              <p className="text-gray-400 mb-4">
                © 2025 Sofia Rodriguez. Driving growth through data-driven marketing.
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
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#campaigns" className="text-gray-400 hover:text-white transition-colors">Campaigns</a></li>
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

export default DigitalMarketerTemplate