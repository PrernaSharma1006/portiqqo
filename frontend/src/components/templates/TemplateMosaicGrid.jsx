import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, Check, Zap, Sparkles, Terminal, TrendingUp, Layout, Film, Camera, Layers, Play } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

// Animated Web Developer Component Illustration
const WebDevIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
    {/* Grid Pattern */}
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }} />

    {/* Ambient Glow */}
    <motion.div 
      className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.2, 1] : 1, opacity: isHovered ? 0.3 : 0.15 }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Terminal Code Window */}
    <motion.div 
      className="relative z-10 w-full max-w-[340px] bg-slate-900/90 rounded-2xl border border-cyan-500/30 shadow-2xl p-4 backdrop-blur-md"
      animate={{ y: isHovered ? -6 : 0, rotateX: isHovered ? 4 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Window Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/80">
          <Terminal className="w-3 h-3" />
          <span>portfolio.config.js</span>
        </div>
      </div>

      {/* Code Lines with Animation */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">const</span>
          <span className="text-cyan-300">developer</span>
          <span className="text-slate-400">=</span>
          <span className="text-amber-300">&#123;</span>
        </div>
        <div className="pl-4 flex items-center gap-2">
          <span className="text-slate-400">stack:</span>
          <span className="text-emerald-400">'React, Node, Next.js'</span>,
        </div>
        <div className="pl-4 flex items-center gap-2">
          <span className="text-slate-400">status:</span>
          <span className="text-cyan-400">'Ready to Hire'</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-300">&#125;;</span>
          <motion.span 
            className="w-2 h-4 bg-cyan-400 inline-block"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>

    {/* Floating Tech Badges */}
    <motion.div 
      className="absolute top-5 left-5 bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <span>&lt;REACT /&gt;</span>
    </motion.div>

    <motion.div 
      className="absolute bottom-5 right-5 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    >
      <span>FULL-STACK ⚡</span>
    </motion.div>
  </div>
)

// Animated Digital Marketer Component Illustration
const MarketerIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center p-4">
    {/* Radial Glow */}
    <motion.div 
      className="absolute w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
      transition={{ duration: 4, repeat: Infinity }}
    />

    {/* SVG Growth Chart & Particles */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 360" fill="none">
      <path 
        d="M 50 290 Q 180 260 260 170 T 450 70" 
        stroke="#facc15" 
        strokeWidth="3.5" 
        strokeDasharray="6 6" 
        className="opacity-60"
      />
      {/* Animated Path Rocket Particle */}
      <motion.circle 
        r="6" 
        fill="#facc15"
        animate={{
          cx: [50, 180, 260, 450],
          cy: [290, 260, 170, 70]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>

    {/* Live ROI Card */}
    <motion.div 
      className="relative z-10 bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md text-center max-w-[240px]"
      animate={{ scale: isHovered ? 1.05 : 1, y: isHovered ? -4 : 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>GROWTH METRICS</span>
      </div>

      <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
        +340%
      </div>
      <p className="text-xs text-zinc-400">Campaign ROI & Traffic Growth</p>

      {/* Animated Mini Bars */}
      <div className="flex items-end justify-center gap-1.5 mt-3 h-8">
        {[40, 65, 50, 85, 100].map((h, i) => (
          <motion.div
            key={i}
            className="w-2.5 bg-amber-400 rounded-t-sm"
            initial={{ height: '20%' }}
            animate={{ height: isHovered ? `${h}%` : `${h * 0.7}%` }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        ))}
      </div>
    </motion.div>

    {/* Floating Badge */}
    <motion.div 
      className="absolute bottom-5 left-5 bg-zinc-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      SEO RANK #1 🚀
    </motion.div>
  </div>
)

// Animated UI/UX Designer Illustration
const DesignerIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center p-4">
    {/* Pink Radial Glow */}
    <motion.div 
      className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 3.5, repeat: Infinity }}
    />

    {/* Wireframe Card Canvas */}
    <motion.div 
      className="relative z-10 w-full max-w-[310px] bg-zinc-900/90 rounded-2xl border border-dashed border-pink-500/40 p-4 shadow-2xl backdrop-blur-md"
      animate={{ y: isHovered ? -5 : 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="h-3.5 w-24 bg-pink-500/30 rounded-full" />
        <div className="w-5 h-5 rounded-full bg-purple-500/40 border border-purple-400/50" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="col-span-1 h-16 bg-zinc-800 rounded-xl border border-zinc-700/50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-pink-500/30 border border-pink-500/50" />
        </div>
        <div className="col-span-2 h-16 bg-zinc-800 rounded-xl border border-zinc-700/50 p-2.5 space-y-1.5">
          <div className="h-2.5 w-full bg-purple-400/40 rounded-full" />
          <div className="h-2.5 w-3/4 bg-zinc-600/50 rounded-full" />
        </div>
      </div>

      <div className="h-9 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30 flex items-center justify-between px-3">
        <span className="text-[11px] font-mono text-pink-300 font-bold">Design System Token</span>
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
      </div>

      {/* Animated Animated Cursor */}
      <motion.div 
        className="absolute top-12 right-12 z-20 pointer-events-none"
        animate={{ 
          x: isHovered ? [0, -30, -10] : [0, -15, 0],
          y: isHovered ? [0, 20, 5] : [0, 10, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-6 h-6 text-pink-500 filter drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 3.75L18.75 12L12 14.25L9.75 21L4.5 3.75Z" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </motion.div>

    {/* Floating Badge */}
    <motion.div 
      className="absolute top-5 left-5 bg-zinc-900/90 border border-pink-500/40 text-pink-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <Layout className="w-3.5 h-3.5" />
      <span>FIGMA 🎨</span>
    </motion.div>
  </div>
)

// Animated Video Editor Illustration
const VideoEditorIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-teal-950 flex items-center justify-center p-4">
    {/* Teal Glow */}
    <motion.div 
      className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Player Window */}
    <motion.div 
      className="relative z-10 w-full max-w-[320px] bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-4 shadow-2xl backdrop-blur-md text-center"
      animate={{ y: isHovered ? -5 : 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* Play Icon with Pulsing Waves */}
      <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10">
          <Play className="w-6 h-6 text-slate-950 fill-slate-950 ml-0.5" />
        </div>
      </div>

      {/* Video Editing Timeline */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
            animate={{ width: isHovered ? ['20%', '85%', '40%'] : '60%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-emerald-400/80">
          <span>00:14 / 02:45</span>
          <span>4K SHOWREEL</span>
        </div>
      </div>
    </motion.div>

    {/* Floating Badge */}
    <motion.div 
      className="absolute bottom-5 right-5 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1"
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 2.8, repeat: Infinity }}
    >
      <Film className="w-3.5 h-3.5" />
      <span>4K 60FPS 🎬</span>
    </motion.div>
  </div>
)

// Animated Photographer Illustration
const PhotographerIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-indigo-950 flex items-center justify-center p-4">
    {/* Purple Glow */}
    <motion.div 
      className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 3.5, repeat: Infinity }}
    />

    {/* Lens Target & Aperture Rings */}
    <div className="relative z-10 w-44 h-44 flex items-center justify-center">
      {/* Outer Rotating Aperture Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner Rotating Ring */}
      <motion.div 
        className="absolute inset-3 rounded-full border border-purple-500/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Lens Core */}
      <motion.div 
        className="w-24 h-24 rounded-full bg-slate-900 border-2 border-purple-500/60 shadow-2xl flex items-center justify-center relative overflow-hidden"
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-16 h-16 rounded-full bg-indigo-950 border border-purple-400/40 flex items-center justify-center">
          <Camera className="w-8 h-8 text-purple-400" />
        </div>

        {/* Shutter Lens Reflection */}
        <motion.div 
          className="absolute -top-4 -left-4 w-12 h-12 bg-white/20 rounded-full blur-sm transform -rotate-45"
          animate={{ opacity: isHovered ? [0.2, 0.6, 0.2] : 0.3 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>

    {/* Floating Badge */}
    <motion.div 
      className="absolute bottom-5 left-5 bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      RAW • 50MM f/1.4 📷
    </motion.div>
  </div>
)

// Animated General Portfolio Illustration
const GeneralIllustration = ({ isHovered }) => (
  <div className="relative w-full h-full overflow-hidden bg-stone-950 flex items-center justify-center p-4">
    {/* Amber Glow */}
    <motion.div 
      className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"
      animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Floating Bento Modules */}
    <div className="relative z-10 grid grid-cols-3 gap-2.5 w-full max-w-[310px]">
      <motion.div 
        className="col-span-2 bg-stone-900/90 border border-amber-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md"
        animate={{ y: isHovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-16 h-2.5 bg-amber-400/40 rounded-full mb-2" />
        <div className="w-full h-2 bg-stone-700/50 rounded-full mb-1" />
        <div className="w-2/3 h-2 bg-stone-700/50 rounded-full" />
      </motion.div>

      <motion.div 
        className="col-span-1 bg-stone-900/90 border border-amber-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-center"
        animate={{ y: isHovered ? -7 : 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
      >
        <Layers className="w-6 h-6 text-amber-400" />
      </motion.div>

      <motion.div 
        className="col-span-3 bg-stone-900/90 border border-amber-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-between"
        animate={{ y: isHovered ? -3 : 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <span className="text-xs font-bold text-amber-300">Customizable Layout</span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </motion.div>
    </div>

    {/* Floating Badge */}
    <motion.div 
      className="absolute top-5 right-5 bg-stone-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md"
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      MODULAR • EASY ✨
    </motion.div>
  </div>
)

export const templatesData = [
  {
    id: 'web-developer',
    routeId: 'web-developer',
    previewId: 'web-developer',
    name: 'Web Developer',
    subtitle: 'Code, Repos & Tech Stack',
    tag: 'DEVELOPMENT',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentColor: '#38bdf8',
    description: 'Clean, modern portfolio engineered for software engineers, frontend, backend, and full-stack devs.',
    features: ['GitHub Repos Integration', 'Interactive Tech Stack', 'Live Project Demos'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: WebDevIllustration
  },
  {
    id: 'digital-marketer',
    routeId: 'digital-marketer',
    previewId: 'digital-marketer',
    name: 'Digital Marketer',
    subtitle: 'Campaigns, SEO & Growth',
    tag: 'MARKETING & SEO',
    tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    accentColor: '#facc15',
    description: 'Dynamic showcase for growth hackers, SEO experts, performance marketers, and social media managers.',
    features: ['Campaign ROI Metrics', 'SEO Rank Tracking', 'Client Case Studies'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: MarketerIllustration
  },
  {
    id: 'uiux-designer',
    routeId: 'ui-ux-designer',
    previewId: 'ui-ux-designer',
    name: 'UI/UX Designer',
    subtitle: 'Figma, Wireframes & UX',
    tag: 'PRODUCT DESIGN',
    tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    accentColor: '#ec4899',
    description: 'Crafted for product designers, Figma creators, and design systems architects who value aesthetics.',
    features: ['Interactive Figma Embeds', 'Design Process Breakdown', 'Prototype Links'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: DesignerIllustration
  },
  {
    id: 'video-editor',
    routeId: 'video-editor',
    previewId: 'video-editor',
    name: 'Video Editor',
    subtitle: 'Reels, YouTube & Motion',
    tag: 'MOTION & VIDEO',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentColor: '#10b981',
    description: 'Built for video creators, animators, reel makers, and film editors with embedded video players.',
    features: ['YouTube & Vimeo Integration', 'Aspect Ratio Grid', 'Showreel Hero Player'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: VideoEditorIllustration
  },
  {
    id: 'photographer',
    routeId: 'photographer',
    previewId: 'photographer',
    name: 'Photographer',
    subtitle: 'High-Res Galleries & Lightbox',
    tag: 'VISUAL & PHOTO',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentColor: '#a855f7',
    description: 'Minimalist, distraction-free visual layout designed to let high-resolution photography speak.',
    features: ['Full-Screen Lightbox Mode', 'Masonry Image Grid', 'EXIF Camera Info'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: PhotographerIllustration
  },
  {
    id: 'general',
    routeId: 'general-portfolio',
    previewId: 'general-portfolio',
    name: 'General Portfolio',
    subtitle: 'Multi-Purpose & Customizable',
    tag: 'ALL CREATORS',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentColor: '#f59e0b',
    description: 'Versatile, modular layout suitable for consultants, freelancers, writers, architects, and artists.',
    features: ['Custom Sections', 'Multi-Media Support', 'Easy Setup'],
    height: 'h-[320px] sm:h-[350px]',
    illustration: GeneralIllustration
  }
]

export default function TemplateMosaicGrid({ onSelectTemplate, isDashboard = false }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [hoveredId, setHoveredId] = useState(null)

  const handleTemplateClick = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template)
      return
    }

    const route = `/editor/${template.routeId}`
    if (!isAuthenticated && !isDashboard) {
      localStorage.setItem('redirectAfterAuth', route)
      navigate('/auth')
    } else {
      navigate(route)
    }
  }

  const handlePreviewClick = (e, template) => {
    e.stopPropagation()
    navigate(`/preview/${template.previewId}`)
  }

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 divide-slate-800/80">
        {templatesData.map((template, idx) => {
          const isHovered = hoveredId === template.id
          const IllustrationComponent = template.illustration

          // Clean Seamless Mosaic Grid Dividers
          const borderClasses = `
            ${idx % 3 !== 2 ? 'lg:border-r border-slate-800/80' : ''}
            ${idx % 2 === 0 ? 'md:border-r lg:border-r-0 border-slate-800/80' : ''}
            ${idx < 3 ? 'lg:border-b border-slate-800/80' : ''}
            ${idx < 4 ? 'md:border-b lg:border-b-0 border-slate-800/80' : ''}
          `

          return (
            <div
              key={template.id}
              className={`group relative overflow-hidden cursor-pointer bg-slate-950 ${template.height} ${borderClasses}`}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleTemplateClick(template)}
            >
              {/* Dynamic Interactive Animated Canvas */}
              <div className="absolute inset-0 w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
                <IllustrationComponent isHovered={isHovered} />
              </div>

              {/* Top Tag Badge (Always visible) */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border backdrop-blur-md shadow-md transition-all duration-300 ${template.tagColor}`}>
                  <Zap className="w-3.5 h-3.5" />
                  {template.tag}
                </span>
              </div>

              {/* Bottom Info Bar (Slides up / expands on hover) */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col justify-end transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-extrabold text-xl tracking-tight group-hover:text-pink-300 transition-colors">
                    {template.name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                    {template.subtitle}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {template.description}
                </p>

                {/* Animated Glass Control Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => handlePreviewClick(e, template)}
                    className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all duration-200 flex items-center justify-center gap-1.5 backdrop-blur-md shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>

                  <button
                    onClick={() => handleTemplateClick(template)}
                    className="flex-1 py-2 px-3 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 text-xs font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
