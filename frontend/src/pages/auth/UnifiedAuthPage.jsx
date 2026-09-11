import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('your-render-url')) {
    return envUrl.replace(/\/$/, '').replace(/\/api$/, '')
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://portiqqo.onrender.com'
  }
  return ''
}

const apiBase = getApiBaseUrl()
const googleAuthUrl = apiBase ? `${apiBase}/api/auth/google` : '/api/auth/google'

function UnifiedAuthPage() {
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const msgParam = searchParams.get('msg') || searchParams.get('details')
    if (errorParam) {
      const displayMsg = msgParam
        ? `Google Sign-In Error (${errorParam}): ${msgParam}`
        : `Google Authentication failed (${errorParam}). Please try again.`
      setErrorMessage(displayMsg)
    }
  }, [searchParams])

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl
  }

  return (
    <>
      <Helmet>
        <title>Portiqqo - Sign In with Google</title>
        <meta name="description" content="Sign in or register for Portiqqo using Google" />
      </Helmet>

      {/* Page Background */}
      <div className="min-h-screen bg-[#f9f6f0] dark:bg-[#141210] text-stone-900 dark:text-stone-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300">
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f472b6]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#e6ccb2]/30 dark:bg-stone-800/40 blur-3xl pointer-events-none" />

        {/* 50/50 Split Container */}
        <div className="w-full max-w-4xl min-h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-[#fdfbf7] dark:bg-[#181614] border border-[#e6ccb2] dark:border-stone-800 flex flex-col md:flex-row my-auto z-10">
          
          {/* LEFT SIDE (50%): Brand Hero Panel */}
          <div className="w-full md:w-1/2 bg-[#141210] text-stone-100 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#e6ccb2]/20 dark:border-stone-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f472b6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Logo & Back to Home */}
            <div className="flex items-center justify-between z-10">
              <Link to="/" className="font-heading font-black text-2xl tracking-tight text-stone-100 flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <span>porti<span className="text-[#f472b6]">qqo</span></span>
              </Link>
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700/80 transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>

            {/* Middle Copy */}
            <div className="my-auto py-8 z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>Instant Google Authentication</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight leading-tight text-stone-50">
                Welcome to Portiqqo
              </h2>

              <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-normal">
                Sign in or register in 1-click using your Google Account. Build and publish your custom portfolio in seconds.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-[#f472b6] shrink-0" />
                  <span>No passwords or email verification codes needed</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1-Click Instant Sign In & Account Creation</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secured by Google OAuth 2.0</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-400 font-medium z-10">
              Build your professional online presence with Portiqqo
            </div>
          </div>

          {/* RIGHT SIDE (50%): Google Auth Action Panel */}
          <div className="w-full md:w-1/2 bg-[#fdfbf7] dark:bg-[#181614] text-stone-900 dark:text-stone-100 p-8 sm:p-12 flex flex-col justify-center items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm space-y-6"
            >
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5ebe0] dark:bg-stone-800 border border-[#e6ccb2] dark:border-stone-700 rounded-3xl mb-4 shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-heading font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  Sign In or Register
                </h1>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                  Continue with your Google account to log in or create your Portiqqo profile instantly.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Main Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3.5 px-6 py-4 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-100 dark:text-stone-900 font-extrabold text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                By continuing, you agree to Portiqqo's{' '}
                <Link to="/terms-of-service" className="underline hover:text-stone-800 dark:hover:text-stone-200">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="underline hover:text-stone-800 dark:hover:text-stone-200">Privacy Policy</Link>.
              </p>
            </motion.div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-stone-500 dark:text-stone-400 z-10 mt-4">
          &copy; {new Date().getFullYear()} Portiqqo. All rights reserved.
        </div>
      </div>
    </>
  )
}

export default UnifiedAuthPage