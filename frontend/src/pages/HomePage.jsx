import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Palette, Globe, Upload, Zap, Users, Star, Check, ExternalLink, Eye, Quote, CheckCircle2, Heart, MessageSquare, Bot, BarChart3, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getApiUrl } from '../services/api'
import TemplateSelectionModal, { professionTemplates } from '../components/modals/TemplateSelectionModal'
import FeedbackModal from '../components/modals/FeedbackModal'
import { markFeedbackGiven } from '../utils/feedbackHelper'
import Cube3DCard from '../components/cards/Cube3DCard'
import StrokeText from '../components/ui/StrokeText'
import BounceCards from '../components/ui/BounceCards'
import ProfileCard from '../components/ui/ProfileCard'
import { Code, Film, Camera, Briefcase } from 'lucide-react'

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
  const { user, isAuthenticated } = useAuth()
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [testimonials, setTestimonials] = useState([
    {
      name: "Sarah Johnson",
      role: "Lead Product Designer",
      handle: "@sarah.design",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      content: "Portiqqo made it incredibly easy to showcase my Figma case studies. I closed 3 high-ticket freelance clients within two weeks of launching!",
      rating: 5,
      highlight: "Closed 3 high-ticket clients"
    },
    {
      name: "Mike Chen",
      role: "Full Stack Engineer",
      handle: "@mikechen.dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The GitHub integration and instant custom domain setup are brilliant. My portfolio loads blazingly fast and recruiters constantly compliment the clean UI.",
      rating: 5,
      highlight: "Blazingly fast & clean UI"
    },
    {
      name: "Emma Davis",
      role: "Commercial Photographer",
      handle: "@emmadavis.photo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      content: "The high-resolution photo gallery and lightbox view let my shots speak for themselves. The best portfolio tool for visual creators hands down.",
      rating: 5,
      highlight: "Best for visual creators"
    },
    {
      name: "Alex Rivera",
      role: "Motion & Video Editor",
      handle: "@alexmotion.cc",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content: "Embedding 4K showreels with custom aspect ratios works like magic. Portiqqo helped me stand out from dozens of applicants for a major studio project.",
      rating: 5,
      highlight: "4K video showcase"
    },
    {
      name: "Priya Sharma",
      role: "Growth & Digital Marketer",
      handle: "@priyagrowth.me",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      content: "Presenting SEO growth curves and campaign ROI in an interactive format completely changed my pitch conversion rate. 10/10 recommended!",
      rating: 5,
      highlight: "Boosted pitch conversions"
    },
    {
      name: "David Kim",
      role: "Frontend Architect",
      handle: "@davidkim.tech",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      content: "I used to spend weeks rebuilding my portfolio from scratch. With Portiqqo, I had a custom-branded site live with my own domain in under 15 minutes.",
      rating: 5,
      highlight: "Live in under 15 minutes"
    }
  ])
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlanPayment = async (planType) => {
    const token = localStorage.getItem('authToken')
    if (!isAuthenticated && !token) {
      localStorage.setItem('redirectAfterAuth', `/pricing?plan=${planType}`)
      navigate('/auth')
      return
    }

    setLoadingPlan(planType)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load Razorpay payment gateway')
        setLoadingPlan(null)
        return
      }

      const activeToken = token || localStorage.getItem('authToken')
      const res = await fetch(getApiUrl('/api/subscriptions/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ plan: planType })
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order')
      }

      if (data.isDemo) {
        const verifyRes = await fetch(getApiUrl('/api/subscriptions/verify-payment'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            razorpay_order_id: data.order.id,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'demo_sig',
            plan: planType
          })
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          toast.success('🎉 Premium activated! Welcome to Portiqqo Premium.')
          setTimeout(() => navigate('/dashboard'), 1500)
        } else {
          toast.error(verifyData.message || 'Payment verification failed.')
        }
        setLoadingPlan(null)
        return
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Portiqqo',
        description: data.order.description,
        order_id: data.order.id,
        prefill: {
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
          email: user?.email || ''
        },
        theme: { color: '#ec4899' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(getApiUrl('/api/subscriptions/verify-payment'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${activeToken}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planType
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              toast.success('🎉 Premium activated! Welcome to Portiqqo Premium.')
              setTimeout(() => navigate('/dashboard'), 1500)
            } else {
              toast.error(verifyData.message || 'Payment verification failed.')
            }
          } catch (err) {
            toast.error('Payment verification failed.')
          }
          setLoadingPlan(null)
        },
        modal: {
          ondismiss: () => setLoadingPlan(null)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error?.description || 'Transaction cancelled'}`)
        setLoadingPlan(null)
      })
      rzp.open()
    } catch (error) {
      toast.error(error.message || 'Something went wrong with payment')
      setLoadingPlan(null)
    }
  }

  useEffect(() => {
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
    const routeMap = {
      'developer': '/editor/web-developer',
      'web-developer': '/editor/web-developer',
      'designer': '/editor/ui-ux-designer',
      'uiux-designer': '/editor/ui-ux-designer',
      'photographer': '/editor/photographer',
      'videographer': '/editor/video-editor',
      'video-editor': '/editor/video-editor',
      'digital-marketer': '/editor/digital-marketer',
      'general': '/editor/general-portfolio'
    }

    const targetRoute = routeMap[profession.id] || '/editor/general-portfolio'

    if (!isAuthenticated) {
      // Prompt user to login first before editing/exploring templates
      localStorage.setItem('redirectAfterAuth', targetRoute)
      navigate('/auth')
      return
    }

    navigate(targetRoute)
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
      icon: <Palette className="w-6 h-6 text-pink-500" />,
      title: "Profession-Tailored Templates",
      description: "Designed specifically for Developers, UI/UX Designers, Photographers, and Marketers with customized showcase blocks.",
      gradient: "from-pink-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      badge: "6+ Professions",
      backTagline: "Engineered for your creative craft",
      backDetails: [
        "Tailored presets for Devs, Designers, Photographers & Editors",
        "Interactive case study, showreel & portfolio sections",
        "Instant 1-click theme, font & layout customization"
      ]
    },
    {
      icon: <Bot className="w-6 h-6 text-pink-500" />,
      title: "AI Portfolio Assistant",
      description: "Powered by Smart AI. Automatically generate compelling project case studies, bio summaries, and SEO descriptions.",
      gradient: "from-pink-500/10 via-stone-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-[#f5ebe0] text-pink-600 border-[#e6ccb2]",
      badge: "Smart AI",
      backTagline: "Powered by Advanced AI",
      backDetails: [
        "Auto-generate project case studies & descriptions",
        "Instant professional bio & skill highlights writer",
        "Automated SEO meta tags & social preview generator"
      ]
    },
    {
      icon: <Globe className="w-6 h-6 text-pink-500" />,
      title: "Custom Domains & Subdomains",
      description: "Connect your own branded domain (yourname.com) with automatic SSL certificate or get a free custom subdomain in seconds.",
      gradient: "from-pink-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      badge: "100% White-Label",
      backTagline: "Zero Portiqqo branding required",
      backDetails: [
        "Free custom subdomain (yourname.portiqqo.me)",
        "Connect branded custom domain (yourname.com)",
        "Automatic SSL certificates & edge CDN binding"
      ]
    },
    {
      icon: <Upload className="w-6 h-6 text-pink-500" />,
      title: "Instant Media & File Uploads",
      description: "Drag-and-drop support for high-res images, 4K video embeds (YouTube/Vimeo), and downloadable PDF resumes.",
      gradient: "from-pink-500/10 via-stone-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-[#f5ebe0] text-pink-600 border-[#e6ccb2]",
      badge: "50MB Max Files",
      backTagline: "Lightning fast asset CDN storage",
      backDetails: [
        "Drag & drop high-resolution photo galleries",
        "4K video embeds with custom aspect ratios",
        "Downloadable PDF resumes & client proposal docs"
      ]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
      title: "Visitor Analytics & Insights",
      description: "Track real-time pageviews, client referrers (LinkedIn, GitHub, Direct), and discover which projects get the most attention.",
      gradient: "from-pink-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      badge: "Live Metrics",
      backTagline: "Real-time client tracking dashboard",
      backDetails: [
        "Real-time pageview counter & unique visitor stats",
        "Client referral tracking (LinkedIn, GitHub, Direct)",
        "See which project case studies convert best"
      ]
    },
    {
      icon: <Zap className="w-6 h-6 text-pink-500" />,
      title: "Blazing Performance & SEO",
      description: "Built for speed with 99+ Google Lighthouse scores, social OpenGraph share cards, and mobile-first responsiveness.",
      gradient: "from-pink-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-[#f472b6]/80 dark:border-pink-500/60",
      sideColor: "bg-[#f472b6] dark:bg-pink-600 border-[#ec4899] dark:border-pink-500",
      topColor: "bg-[#f472b6]/90 dark:bg-pink-500/90 border-[#f472b6] dark:border-pink-400",
      iconBg: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      badge: "99+ Lighthouse",
      backTagline: "Built for maximum search visibility",
      backDetails: [
        "Sub-0.4 second First Contentful Paint load time",
        "Automatic OpenGraph social sharing previews",
        "Mobile-first responsive design across all devices"
      ]
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

  const annualFeatures = [
    "7 Days Free Trial",
    "1 Portfolio Website",
    "Professional Templates",
    "Custom Subdomain",
    "Mobile Responsive",
    "Advanced Analytics & Insights",
    "Priority Support",
    "Save ₹272 / Year (28% OFF)"
  ]

  return (
    <>
      <Helmet>
        <title>Portiqqo - Create Stunning Professional Portfolios</title>
        <meta name="description" content="Build beautiful professional portfolios with ease. Choose from templates, upload your work, and get your unique subdomain. Perfect for designers, developers, photographers, and creators." />
        <meta name="keywords" content="portfolio builder, professional portfolio, website builder, designer portfolio, developer portfolio, photography portfolio" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-x-hidden max-w-full w-full min-h-[calc(100vh-64px)] flex flex-col justify-center bg-[#f9f6f0] dark:bg-[#141210] border-b border-[#e6ccb2]/60 dark:border-stone-800/80 py-8 sm:py-16 lg:py-24">
        <div className="relative container-width section-padding max-w-full overflow-x-hidden w-full">
          <motion.div 
            className="max-w-7xl mx-auto w-full"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Main Hero Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              {/* Left Content (Centered on mobile, left-aligned on desktop) */}
              <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden text-center lg:text-left flex flex-col items-center lg:items-start">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 max-w-full bg-[#f5ebe0] border border-[#e6ccb2] dark:bg-stone-900/90 dark:border-stone-800 rounded-full text-stone-900 dark:text-pink-300 text-xs font-semibold tracking-wide uppercase shadow-sm mx-auto lg:mx-0">
                  <Zap className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <span className="truncate">No Coding Required • Launch in Minutes</span>
                </motion.div>

                <motion.div variants={fadeInUp} className="w-full max-w-full overflow-x-hidden">
                  <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-heading font-black text-stone-900 dark:text-stone-50 leading-[1.08] tracking-tight flex flex-col items-center lg:items-start gap-1 sm:gap-2 max-w-full overflow-x-hidden">
                    <span>Build Your</span>
                    <StrokeText 
                      text="Dream Portfolio"
                      fillColor="#f472b6"
                      strokeColor="#f472b6"
                      strokeWidth={2}
                      fontSize={isMobile ? 48 : 88}
                      alignCenter={isMobile}
                      fontWeight={900}
                      letterSpacing={-1}
                      trigger="loop"
                      repeatDelay={2.5}
                      fillMode="wipe"
                      drawDuration={1.4}
                      className="text-[#f472b6] dark:text-[#f472b6] max-w-full my-0.5"
                    />
                    <span>Today</span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  className="text-base sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
                  variants={fadeInUp}
                >
                  Stunning templates, powerful customization, and your own domain. 
                  Join thousands of creators showcasing their work professionally.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto pt-1 justify-center lg:justify-start"
                  variants={fadeInUp}
                >
                  <Link 
                    to="/auth" 
                    className="w-full sm:w-auto px-8 py-4 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 rounded-2xl font-extrabold text-base sm:text-lg shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center group"
                  >
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button 
                    onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-8 py-4 bg-[#f5ebe0] hover:bg-[#e6ccb2] text-stone-900 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-100 border border-[#e6ccb2] dark:border-stone-800 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex items-center justify-center"
                  >
                    Explore Templates
                  </button>
                </motion.div>

                {/* Hero Stat / Trust Highlights */}
                <motion.div 
                  variants={fadeInUp}
                  className="pt-4 border-t border-[#e6ccb2]/60 dark:border-stone-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-semibold w-full"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>2,500+ Portfolios Created</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-pink-500 font-bold">⚡</span>
                    <span>Sub-0.4s Fast Load</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 font-bold">Presets</span>
                    <span>6+ Profession Presets</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Content - Visual Element (Responsive on Mobile & Desktop) */}
              <motion.div 
                className="relative w-full pt-4 lg:pt-0"
                variants={fadeInUp}
              >
                <div className="relative w-full h-[260px] sm:h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden">
                  {/* Rotating Circle - Editorial Beige Version */}
                  <div className="absolute pointer-events-none w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px]" style={{ animation: 'spin-slow 25s linear infinite' }}>
                    <svg className="w-full h-full" viewBox="0 0 450 450">
                      <defs>
                        <path
                          id="circlePath"
                          d="M 225, 225 m -215, 0 a 215,215 0 1,1 430,0 a 215,215 0 1,1 -430,0"
                        />
                      </defs>
                      <text className="text-[14px] sm:text-[15px] lg:text-[17px]" fontWeight="700" fill="#a89f91" opacity="0.45" letterSpacing="5">
                        <textPath href="#circlePath">
                          PORTIQQO • SHOWCASE YOUR WORK • PORTIQQO • SHOWCASE YOUR WORK • PORTIQQO • SHOWCASE YOUR WORK
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Center Content - Decorative Cards and Globe Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Decorative Floating Card 1 */}
                      <motion.div 
                        className="absolute -top-8 -left-10 sm:-top-16 lg:-top-20 sm:-left-16 lg:-left-20 w-32 h-22 sm:w-44 sm:h-30 lg:w-52 lg:h-34 bg-[#fdfbf7] dark:bg-stone-900 border-2 border-[#e6ccb2] dark:border-stone-800 rounded-xl sm:rounded-2xl shadow-xl p-2.5 sm:p-4 rotate-[-10deg]"
                        animate={{ y: [0, -6, 0], rotate: [-10, -6, -10] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <div className="text-stone-900 dark:text-stone-100 text-[11px] sm:text-sm font-bold mb-1 sm:mb-2">Web Developer</div>
                        <div className="w-full h-1.5 sm:h-2 bg-pink-400/30 rounded-full mb-1"></div>
                        <div className="w-3/4 h-1.5 sm:h-2 bg-pink-400/30 rounded-full"></div>
                      </motion.div>

                      {/* Decorative Floating Card 2 */}
                      <motion.div 
                        className="absolute -bottom-8 -right-8 sm:-bottom-14 lg:-bottom-16 sm:-right-14 lg:-right-16 w-30 h-20 sm:w-42 sm:h-28 lg:w-48 lg:h-30 bg-[#f472b6] text-stone-950 rounded-xl sm:rounded-2xl shadow-xl p-2.5 sm:p-4 rotate-[8deg]"
                        animate={{ y: [0, 6, 0], rotate: [8, 11, 8] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      >
                        <div className="text-stone-950 font-bold text-[10px] sm:text-xs lg:text-sm mb-1 sm:mb-2">Photographer</div>
                        <div className="w-full h-1.5 sm:h-2 bg-stone-950/20 rounded-full mb-1"></div>
                        <div className="w-2/3 h-1.5 sm:h-2 bg-stone-950/20 rounded-full"></div>
                      </motion.div>

                      {/* Center Icon */}
                      <div className="flex w-16 h-16 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl items-center justify-center shadow-2xl">
                        <Globe className="w-8 h-8 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-[#f9f6f0] via-[#fdfbf7] to-[#f9f6f0] dark:from-[#141210] dark:via-stone-900 dark:to-[#141210] transition-colors duration-300 relative overflow-hidden">
        <div className="container-width section-padding relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5ebe0] border border-[#e6ccb2] dark:bg-stone-900/90 dark:border-stone-800 text-stone-900 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>THE ULTIMATE FREELANCE TOOLKIT</span>
            </motion.div>

            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-stone-900 dark:text-stone-50 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p 
              className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              From custom domains to Smart AI assistants and 4K media showcases, build a portfolio that converts visitors into paying clients.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Cube3DCard feature={feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-[#f9f6f0] dark:bg-[#141210] border-b border-[#e6ccb2]/60 dark:border-stone-800/80 transition-colors duration-300 relative overflow-hidden">
        <div className="container-width section-padding relative z-10">
          <motion.div 
            className="text-center mb-10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5ebe0] border border-[#e6ccb2] dark:bg-stone-900/90 dark:border-stone-800 text-stone-900 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 text-pink-500" />
              <span>CURATED PROFESSION TEMPLATES</span>
            </motion.div>

            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-stone-900 dark:text-stone-50 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Choose Your <span className="text-pink-500">Perfect Template</span>
            </motion.h2>
            <motion.p 
              className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Handcrafted, responsive portfolio templates engineered for your specific creative craft.
            </motion.p>
          </motion.div>

          {/* Template Cards - Desktop: BounceCards fan, Mobile: horizontal scroll grid */}
          {/* Mobile card grid - shown only on small screens */}
          <div className="md:hidden w-full mt-6 mb-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { id: 'developer', label: 'Web Developer', emoji: '💻', bg: 'bg-[#141210]', text: 'text-stone-100', sub: 'text-stone-400', badge: 'bg-pink-500/20 text-pink-300', badgeText: 'Dev' },
                { id: 'designer', label: 'UI/UX Designer', emoji: '🎨', bg: 'bg-[#fdfbf7] dark:bg-stone-900', text: 'text-stone-900 dark:text-stone-100', sub: 'text-stone-500 dark:text-stone-400', badge: 'bg-[#f5ebe0] dark:bg-stone-800 text-stone-700 dark:text-pink-300', badgeText: 'Design' },
                { id: 'photographer', label: 'Photographer', emoji: '📷', bg: 'bg-[#141210]', text: 'text-stone-100', sub: 'text-stone-400', badge: 'bg-pink-500/20 text-pink-300', badgeText: 'Photo' },
                { id: 'videographer', label: 'Video Editor', emoji: '🎬', bg: 'bg-[#fdfbf7] dark:bg-stone-900', text: 'text-stone-900 dark:text-stone-100', sub: 'text-stone-500 dark:text-stone-400', badge: 'bg-[#f5ebe0] dark:bg-stone-800 text-stone-700 dark:text-pink-300', badgeText: 'Video' },
                { id: 'general', label: 'General Portfolio', emoji: '✨', bg: 'bg-[#141210]', text: 'text-stone-100', sub: 'text-stone-400', badge: 'bg-pink-500/20 text-pink-300', badgeText: 'All' },
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleProfessionSelect({ id: card.id })}
                  className={`${card.bg} rounded-2xl border border-[#e6ccb2] dark:border-stone-800 p-4 flex flex-col gap-2 text-left shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 ${card.id === 'general' ? 'col-span-2' : ''}`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${card.badge}`}>{card.badgeText}</span>
                  <div className="text-2xl">{card.emoji}</div>
                  <div>
                    <p className={`text-sm font-bold ${card.text}`}>{card.label}</p>
                    <p className={`text-[11px] mt-0.5 ${card.sub}`}>Tap to use →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop BounceCards Interactive Showcase */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="hidden md:flex w-full justify-center py-6 overflow-hidden min-h-[420px]"
          >
            <BounceCards
              cards={[
                {
                  id: 'developer',
                  name: 'Web Developer',
                  content: (
                    <div className="w-full h-full p-5 bg-[#141210] text-stone-100 flex flex-col justify-between relative group select-none">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-full font-bold uppercase tracking-wider text-[10px]">Development</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="my-auto space-y-3">
                        <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-[11px] text-pink-300">
                          <span className="text-stone-500">// dev.config.js</span>
                          <br />
                          <span className="text-pink-400">const</span> dev = &#123;
                          <br />
                          &nbsp;&nbsp;stack: <span className="text-amber-200">'React, Node'</span>
                          <br />
                          &#125;;
                        </div>
                        <h4 className="text-lg font-bold text-stone-100">Web Developer</h4>
                        <p className="text-xs text-stone-400 line-clamp-2">For software engineers, frontend &amp; full-stack devs.</p>
                      </div>
                      <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs font-bold text-pink-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                },
                {
                  id: 'designer',
                  name: 'UI/UX Designer',
                  content: (
                    <div className="w-full h-full p-5 bg-[#fdfbf7] dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col justify-between relative group border border-[#e6ccb2] dark:border-stone-800 select-none">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-[#f5ebe0] dark:bg-stone-800 text-stone-800 dark:text-pink-300 rounded-full font-bold uppercase tracking-wider text-[10px]">Product Design</span>
                        <Sparkles className="w-4 h-4 text-pink-500" />
                      </div>
                      <div className="my-auto space-y-3">
                        <div className="p-3 bg-[#f5ebe0] dark:bg-stone-800 rounded-xl border border-[#e6ccb2] dark:border-stone-700">
                          <div className="flex gap-1.5 mb-2">
                            <div className="w-3 h-3 rounded-full bg-pink-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-stone-400" />
                          </div>
                          <div className="h-2 w-3/4 bg-stone-300 dark:bg-stone-700 rounded mb-1" />
                          <div className="h-2 w-1/2 bg-pink-300 dark:bg-pink-500/40 rounded" />
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">UI/UX Designer</h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">Figma creators, case studies &amp; design systems.</p>
                      </div>
                      <div className="pt-2 border-t border-[#e6ccb2] dark:border-stone-800 flex justify-between items-center text-xs font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                },
                {
                  id: 'photographer',
                  name: 'Photographer',
                  content: (
                    <div className="w-full h-full p-5 bg-[#141210] text-stone-100 flex flex-col justify-between relative group select-none">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-full font-bold uppercase tracking-wider text-[10px]">Visual &amp; Photo</span>
                        <Camera className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="my-auto space-y-3">
                        <div className="h-20 rounded-xl bg-gradient-to-tr from-pink-900/60 to-stone-800 border border-stone-800 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full border-2 border-pink-400/60 flex items-center justify-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-pink-500" />
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-stone-100">Photographer</h4>
                        <p className="text-xs text-stone-400 line-clamp-2">Distraction-free layout for photo galleries &amp; artists.</p>
                      </div>
                      <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs font-bold text-pink-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                },
                {
                  id: 'videographer',
                  name: 'Video Editor',
                  content: (
                    <div className="w-full h-full p-5 bg-[#fdfbf7] dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col justify-between relative group border border-[#e6ccb2] dark:border-stone-800 select-none">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-[#f5ebe0] dark:bg-stone-800 text-stone-800 dark:text-pink-300 rounded-full font-bold uppercase tracking-wider text-[10px]">Motion &amp; Video</span>
                        <Film className="w-4 h-4 text-pink-500" />
                      </div>
                      <div className="my-auto space-y-3">
                        <div className="h-20 rounded-xl bg-[#f5ebe0] dark:bg-stone-800 border border-[#e6ccb2] dark:border-stone-700 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-[#f472b6] text-stone-950 flex items-center justify-center shadow-md text-xs font-bold">
                            ▶
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">Video Editor</h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">4K showreels, animators &amp; video creators.</p>
                      </div>
                      <div className="pt-2 border-t border-[#e6ccb2] dark:border-stone-800 flex justify-between items-center text-xs font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                },
                {
                  id: 'general',
                  name: 'General Portfolio',
                  content: (
                    <div className="w-full h-full p-5 bg-[#141210] text-stone-100 flex flex-col justify-between relative group select-none">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-full font-bold uppercase tracking-wider text-[10px]">All Creators</span>
                        <Briefcase className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="my-auto space-y-3">
                        <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1.5">
                          <div className="h-2 w-full bg-stone-700 rounded" />
                          <div className="h-2 w-2/3 bg-pink-500/60 rounded" />
                        </div>
                        <h4 className="text-lg font-bold text-stone-100">General Portfolio</h4>
                        <p className="text-xs text-stone-400 line-clamp-2">Versatile modular layout for any creative craft.</p>
                      </div>
                      <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs font-bold text-pink-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                }
              ]}
              containerWidth={1000}
              containerHeight={380}
              cardWidth={260}
              cardHeight={340}
              animationDelay={0.2}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.7)"
              transformStyles={[
                'rotate(-12deg) translate(-270px, 15px)',
                'rotate(-6deg) translate(-135px, -5px)',
                'rotate(0deg) translate(0px, 0px)',
                'rotate(6deg) translate(135px, -5px)',
                'rotate(12deg) translate(270px, 15px)'
              ]}
              enableHover={true}
              onCardClick={(item) => handleProfessionSelect({ id: item.id })}
            />
          </motion.div>

          {/* Profession Quick Select Pills */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-2.5 mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {professionTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleProfessionSelect(template)}
                className="px-4 py-2 bg-[#f5ebe0] hover:bg-[#e6ccb2] text-stone-900 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-100 border border-[#e6ccb2] dark:border-stone-800 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 shadow-sm flex items-center gap-2"
              >
                <span>{template.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-pink-500" />
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Modern Social Proof Carousel */}
      <section className="py-20 bg-[#f9f6f0] dark:bg-[#141210] border-b border-[#e6ccb2]/60 dark:border-stone-800/80 overflow-hidden transition-colors duration-300 relative">
        <div className="container-width section-padding">
          <motion.div 
            className="text-center mb-14"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5ebe0] border border-[#e6ccb2] dark:bg-stone-900/90 dark:border-stone-800 text-stone-900 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm"
            >
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                ))}
              </div>
              <span className="font-bold">4.9/5</span>
              <span className="text-stone-400 dark:text-stone-500">&bull;</span>
              <span>Trusted by 2,500+ Freelancers & Creators</span>
            </motion.div>

            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-stone-900 dark:text-stone-50 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Loved by Creators Worldwide
            </motion.h2>
            <motion.p 
              className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              See how developers, designers, and video creators win dream clients with Portiqqo
            </motion.p>
          </motion.div>

          {/* Continuous Smooth Infinite Marquee with Left & Right Gradient Masks */}
          <div className="relative mb-14 overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Left Edge Gradient Fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#f9f6f0] dark:from-[#141210] to-transparent z-10" />
            
            {/* Right Edge Gradient Fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#f9f6f0] dark:from-[#141210] to-transparent z-10" />

            <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused] w-max">
              {/* Duplicate testimonials 3x for endless seamless loop */}
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index}
                  className="w-[280px] sm:w-[380px] max-w-[calc(100vw-3rem)] flex-shrink-0 bg-[#fdfbf7] dark:bg-[#1a1816] rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-[#e6ccb2] dark:border-stone-800 flex flex-col justify-between group hover:-translate-y-1 relative"
                >
                  {/* Top: Stars & Highlight Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4 text-amber-500 fill-amber-500" 
                          />
                        ))}
                      </div>
                      
                      {testimonial.highlight && (
                        <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-300 bg-[#f5ebe0] dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-[#e6ccb2] dark:border-stone-700">
                          {testimonial.highlight}
                        </span>
                      )}
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative mb-6">
                      <Quote className="w-6 h-6 text-stone-300 dark:text-stone-700 absolute -top-2 -left-1 -z-0 opacity-60" />
                      <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-[15px] leading-relaxed relative z-10 italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>

                  {/* Creator Info Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#e6ccb2]/60 dark:border-stone-800">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-pink-400/40 shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base truncate">
                          {testimonial.name}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" title="Verified Creator" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <span className="truncate">{testimonial.role}</span>
                        {testimonial.handle && (
                          <span className="font-mono text-pink-500 dark:text-pink-400 text-[11px]">{testimonial.handle}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Feedback Button & Trust Metrics */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 font-extrabold text-stone-950 text-sm sm:text-base transition-all duration-300 bg-[#f472b6] hover:bg-[#ec4899] rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-105"
            >
              <span className="relative flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Share Your Story & Feedback
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-[#f9f6f0] via-[#f5ebe0]/40 to-[#f9f6f0] dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 transition-colors duration-300 relative overflow-hidden">
        <div className="container-width section-padding relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-stone-900 dark:text-stone-100 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p 
              className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Start with a 7-day risk-free trial on any plan. Cancel anytime with zero hassle!
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch px-2 sm:px-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Monthly Plan Card */}
            <ProfileCard
              behindGlowEnabled={true}
              behindGlowColor="rgba(244, 114, 182, 0.35)"
              behindGlowSize="50%"
              enableTilt={true}
              showUserInfo={false}
              innerGradient="linear-gradient(150deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 235, 224, 0.75) 100%)"
              className="w-full h-full"
            >
              <div className="relative flex flex-col h-full text-stone-900 dark:text-stone-100 justify-between">
                <div>
                  {/* 7 Days Free Trial Badge */}
                  <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                      7 DAYS FREE TRIAL
                    </span>
                  </div>
                  
                  <div className="text-center mb-5">
                    <h3 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mb-1 tracking-tight">
                      Monthly Plan
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 my-2">
                      <span className="text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">₹81</span>
                      <span className="text-base font-semibold text-stone-600 dark:text-stone-400">/month</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      Billed monthly after 7-day trial • Cancel anytime
                    </p>
                  </div>

                  <div className="w-full h-px bg-stone-300/60 dark:bg-stone-700/60 my-3" />

                  <ul className="space-y-2.5 my-4">
                    {pricingFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm">
                        <div className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center mr-2.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mt-5 text-center">
                    <button 
                      onClick={() => handlePlanPayment('monthly')}
                      disabled={loadingPlan === 'monthly'}
                      className="w-full py-3.5 text-sm font-extrabold text-stone-100 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
                    >
                      <span>{loadingPlan === 'monthly' ? 'Opening Payment...' : 'Start Monthly Trial'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      No credit card required for trial
                    </p>
                  </div>
                </div>
              </div>
            </ProfileCard>

            {/* Annual Plan Card (700/year - Featured) */}
            <ProfileCard
              behindGlowEnabled={true}
              behindGlowColor="rgba(244, 114, 182, 0.65)"
              behindGlowSize="55%"
              enableTilt={true}
              showUserInfo={false}
              innerGradient="linear-gradient(150deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 235, 224, 0.85) 50%, rgba(244, 114, 182, 0.22) 100%)"
              className="w-full h-full"
            >
              <div className="relative flex flex-col h-full text-stone-900 dark:text-stone-100 justify-between">
                <div>
                  {/* Best Value Badge */}
                  <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-[#f472b6] text-stone-950 text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow-md shadow-pink-500/20 tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                      BEST VALUE — SAVE 28%
                    </span>
                  </div>
                  
                  <div className="text-center mb-5">
                    <h3 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mb-1 tracking-tight">
                      Annual Access
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 my-2">
                      <span className="text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">₹700</span>
                      <span className="text-base font-semibold text-stone-600 dark:text-stone-400">/year</span>
                    </div>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-bold">
                      Just ~₹58/month • 7-day free trial included
                    </p>
                  </div>

                  <div className="w-full h-px bg-pink-300/50 dark:bg-pink-900/40 my-3" />

                  <ul className="space-y-2.5 my-4">
                    {annualFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#f472b6] text-stone-950 flex items-center justify-center mr-2.5 flex-shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mt-5 text-center">
                    <button 
                      onClick={() => handlePlanPayment('yearly')}
                      disabled={loadingPlan === 'yearly'}
                      className="w-full py-3.5 text-sm font-extrabold text-stone-950 bg-[#f472b6] hover:bg-[#ec4899] rounded-xl shadow-lg shadow-pink-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
                    >
                      <span>{loadingPlan === 'yearly' ? 'Opening Payment...' : 'Get Annual Access'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      Billed annually • Cancel anytime
                    </p>
                  </div>
                </div>
              </div>
            </ProfileCard>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-900 dark:bg-stone-950 text-stone-100 relative overflow-hidden border-t border-stone-800/80">
        <div className="container-width section-padding relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-stone-100"
              variants={fadeInUp}
            >
              Ready to Show the World Your Work?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-stone-300 mb-8"
              variants={fadeInUp}
            >
              Join thousands of creators who trust Portiqqo to showcase their talent
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/auth"
                className="inline-flex items-center justify-center bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 px-8 py-4 text-lg font-extrabold rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-105 transition-all duration-300 group"
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