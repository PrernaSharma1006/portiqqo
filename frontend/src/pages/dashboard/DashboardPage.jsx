import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Palette, Camera, Code, Layers, Briefcase, Pencil, Monitor } from 'lucide-react'

const templates = [
  {
    id: 'web-developer',
    name: 'Web Developer',
    description: 'Perfect for showcasing your coding projects and technical skills',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    features: ['Project Gallery', 'Tech Stack', 'GitHub Integration']
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Stunning layouts for your best shots and photography services',
    icon: Camera,
    color: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
    features: ['Photo Galleries', 'Lightbox View', 'Client Booking']
  },
  {
    id: 'uiux-designer',
    name: 'UI/UX Designer',
    description: 'Display your design process and creative solutions beautifully',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    features: ['Case Studies', 'Design Process', 'Figma Embeds']
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Showcase your video projects with embedded players and reels',
    icon: Monitor,
    color: 'from-green-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    features: ['Video Showcase', 'YouTube Integration', 'Showreel']
  },
  {
    id: 'illustrator',
    name: 'Illustrator',
    description: 'Highlight your artwork and illustrations in an elegant gallery',
    icon: Pencil,
    color: 'from-yellow-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&h=400&fit=crop',
    features: ['Art Gallery', 'Commission Info', 'Shop Integration']
  },
  {
    id: 'digital-marketer',
    name: 'Digital Marketer',
    description: 'Present your campaigns, results, and marketing expertise',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    features: ['Campaign Results', 'Analytics', 'Client Testimonials']
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Showcase architectural designs and completed projects',
    icon: Layers,
    color: 'from-slate-500 to-zinc-500',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop',
    features: ['3D Models', 'Blueprint View', 'Project Timeline']
  },
  {
    id: 'general',
    name: 'General Portfolio',
    description: 'Flexible template suitable for any profession or creative field',
    icon: Sparkles,
    color: 'from-violet-500 to-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=600&h=400&fit=crop',
    features: ['Customizable', 'Multi-Purpose', 'Easy Setup']
  }
]

function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleTemplateSelect = (templateId) => {
    navigate(`/templates/${templateId}`)
  }

  return (
    <>
      <Helmet>
        <title>Choose Your Template - Portiqqo</title>
        <meta name="description" content="Select the perfect template for your portfolio" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="container-width section-padding page-padding">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome {isAuthenticated && user ? user.firstName : 'Back'}! ✨
            </h1>
            <p className="text-xl text-slate-600 mb-6">
              Choose a template that matches your style
            </p>
            {isAuthenticated && user && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <span className="text-sm text-green-800">
                  Logged in as <strong>{user.email}</strong>
                </span>
              </div>
            )}
          </motion.div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template, index) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {template.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {template.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <span className="text-xs text-slate-500">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Button */}
                      <button className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        Choose Template
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage