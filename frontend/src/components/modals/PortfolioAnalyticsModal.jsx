import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, BarChart3, TrendingUp, Eye, Globe, Smartphone, 
  Monitor, Calendar, ArrowUpRight, Share2, Sparkles, RefreshCw 
} from 'lucide-react'
import { portfolioAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function PortfolioAnalyticsModal({ isOpen, onClose, portfolio }) {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (isOpen && portfolio?._id) {
      fetchAnalytics()
    }
  }, [isOpen, portfolio])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await portfolioAPI.getAnalytics(portfolio._id)
      if (res.data?.success) {
        setAnalytics(res.data.analytics)
      }
    } catch (err) {
      console.error('Failed to load analytics:', err)
      toast.error('Could not load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Calculate max views for bar chart scaling
  const maxDailyViews = analytics?.dailyViews
    ? Math.max(...analytics.dailyViews.map(d => d.views), 5)
    : 10

  const getSourceIcon = (source) => {
    const s = (source || '').toLowerCase()
    if (s.includes('linkedin')) return '💼'
    if (s.includes('twitter') || s.includes('x')) return '🐦'
    if (s.includes('github')) return '🐙'
    if (s.includes('google')) return '🔍'
    if (s.includes('instagram')) return '📸'
    return '🔗'
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 text-white my-8"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-800 flex items-start justify-between relative bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Visitor Analytics
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Tracking
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {portfolio?.title || 'Portfolio'} Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Public URL: <span className="font-mono text-purple-400">{portfolio?.publicUrl || `${window.location.origin}/${portfolio?.subdomain}`}</span>
                {portfolio?.customDomain && (
                  <span className="ml-2 font-mono text-cyan-400">({portfolio.customDomain})</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAnalytics}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                title="Refresh Analytics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
            {loading && !analytics ? (
              <div className="py-20 text-center">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Gathering visitor metrics & traffic sources...</p>
              </div>
            ) : (
              <>
                {/* 4 Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-medium">Total Views</span>
                      <Eye className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {analytics?.totalViews || 0}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> All-time count
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-medium">Past 7 Days</span>
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {analytics?.viewsThisWeek || 0}
                    </div>
                    <div className="text-[11px] text-blue-400 mt-1 font-medium">
                      Active this week
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-medium">Today</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {analytics?.viewsToday || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium">
                      Last 24 hours
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-medium">Top Source</span>
                      <Globe className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white truncate">
                      {analytics?.topReferrers?.[0]?.source || 'Direct'}
                    </div>
                    <div className="text-[11px] text-amber-400 mt-1 font-medium">
                      {analytics?.topReferrers?.[0]?.percentage || 100}% of traffic
                    </div>
                  </div>
                </div>

                {/* 7-Day Activity Chart */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-base text-white">Weekly Traffic Overview</h3>
                      <p className="text-xs text-slate-400">Daily unique portfolio impressions</p>
                    </div>
                    <span className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20 font-medium">
                      Past 7 Days
                    </span>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-700/80">
                    {analytics?.dailyViews?.map((item, idx) => {
                      const heightPercent = Math.max((item.views / maxDailyViews) * 100, 8)
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Hover Tooltip */}
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap pointer-events-none z-20">
                            {item.date}: {item.views} view{item.views === 1 ? '' : 's'}
                          </div>

                          {/* Bar */}
                          <div className="w-full max-w-[42px] bg-slate-700/40 rounded-t-lg overflow-hidden h-32 flex items-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercent}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg group-hover:from-purple-500 group-hover:to-cyan-400 transition-all duration-300 shadow-md"
                            />
                          </div>

                          {/* Day Label */}
                          <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                            {item.shortDay}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2-Column Breakdown: Referrers & Devices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                    <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      Top Traffic Referrers
                    </h4>

                    <div className="space-y-3">
                      {analytics?.topReferrers?.map((ref, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                              <span>{getSourceIcon(ref.source)}</span>
                              {ref.source}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {ref.count} ({ref.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                              style={{ width: `${ref.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device Distribution */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                    <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      Device Distribution
                    </h4>

                    <div className="space-y-3">
                      {analytics?.devices?.map((dev, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                              {dev.device === 'Mobile' ? (
                                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                              )}
                              {dev.device}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {dev.count} ({dev.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                dev.device === 'Mobile'
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${dev.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pro Tip Box */}
                <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-800 border border-purple-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Pro Tip to Boost Client Inquiries:</span> Add your live subdomain URL or custom domain to your <strong className="text-purple-300">LinkedIn headline</strong>, <strong className="text-cyan-300">GitHub profile</strong>, and email signature to get 3-5x more visitor discovery!
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Last viewed: {analytics?.lastViewed ? new Date(analytics.lastViewed).toLocaleDateString() : 'Active'}
            </span>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors border border-slate-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
