import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, LogIn, CheckCircle, Eye, EyeOff, Mail, ArrowLeft, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

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
  const [activeCard, setActiveCard] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false
  })
  const [otpData, setOtpData] = useState({ 
    email: '', 
    otp: '',
    attempts: 0,
    blocked: false,
    lastResendTime: 0
  })
  const [resendTimer, setResendTimer] = useState(0)
  
  const { login, checkEmailExists, sendOTP, verifyOTP, signup } = useAuth()
  const navigate = useNavigate()

  const handleSwitchCard = (card) => {
    setActiveCard(card)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    })
    setShowPassword(false)
    setPasswordStrength({
      score: 0,
      feedback: [],
      isValid: false
    })
  }

  // Catch URL error params from OAuth callbacks & handle mode params
  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'signup' || modeParam === 'register') {
      handleSwitchCard('signup')
    } else if (modeParam === 'login' || modeParam === 'signin') {
      handleSwitchCard('login')
    }

    const errorParam = searchParams.get('error')
    const msgParam = searchParams.get('msg') || searchParams.get('details')
    if (errorParam) {
      const displayMsg = msgParam
        ? `Authentication Error (${errorParam}): ${msgParam}`
        : `Authentication failed (${errorParam}). Please try again.`
      setErrors(prev => ({ ...prev, submit: displayMsg }))
    }
  }, [searchParams])

  // Timer effect for resend cooldown
  useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time password validation
    if (name === 'password') {
      const strength = validatePassword(value)
      setPasswordStrength(strength)
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
    
    const feedback = []
    if (!checks.length) feedback.push('At least 8 characters')
    if (!checks.uppercase) feedback.push('One uppercase letter')
    if (!checks.lowercase) feedback.push('One lowercase letter')
    if (!checks.number) feedback.push('One number')
    if (!checks.special) feedback.push('One special character (!@#$%^&*)')
    
    const validChecks = Object.values(checks).filter(Boolean).length
    const score = Math.min(validChecks, 5)
    const isValid = score >= 4 // Require at least 4 out of 5 criteria
    
    return { score, feedback, isValid, checks }
  }

  const getPasswordStrengthColor = (score) => {
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 3) return 'bg-yellow-500'
    if (score <= 4) return 'bg-pink-400'
    return 'bg-emerald-500'
  }

  const getPasswordStrengthText = (score) => {
    if (score <= 1) return 'Very Weak'
    if (score <= 2) return 'Weak'
    if (score <= 3) return 'Fair'
    if (score <= 4) return 'Strong'
    return 'Very Strong'
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log('Attempting login with:', { email: formData.email, password: '***' })
      await login(formData.email, formData.password)
      console.log('Login successful!')
      setActiveCard('success')
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirectAfterAuth')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterAuth')
          navigate(redirectPath)
        } else {
          navigate('/')
        }
      }, 2000)
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: error.message || 'Invalid email or password. Please check your credentials or create an account.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet security requirements'
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('Checking if email exists:', formData.email)
      const result = await checkEmailExists(formData.email)
      console.log('Email exists result:', result)
      
      if (result.exists) {
        setErrors({ email: 'Email is already registered. Please sign in instead.' })
        setIsLoading(false)
        return
      }
      
      console.log('Sending OTP to:', formData.email)
      await sendOTP(formData.email)
      setOtpData({ 
        email: formData.email, 
        otp: '', 
        verified: false,
        attempts: 0,
        blocked: false,
        lastResendTime: Date.now()
      })
      setResendTimer(60)
      setActiveCard('otp')
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (otp) => {
    if (otpData.blocked) {
      setErrors({ submit: 'Too many failed attempts. Please wait and resend a new OTP.' })
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('Verifying OTP:', otp, 'for email:', otpData.email)
      const verifyResult = await verifyOTP(otpData.email, otp)
      
      if (!verifyResult.success) {
        throw new Error('OTP verification failed')
      }
      
      console.log('OTP verified successfully, completing signup...')
      
      setOtpData(prev => ({ ...prev, verified: true, attempts: 0, blocked: false }))
      
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })
      
      setActiveCard('success')
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirectAfterAuth')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterAuth')
          navigate(redirectPath)
        } else {
          navigate('/')
        }
      }, 2000)
    } catch (error) {
      console.error('OTP verification error:', error)
      
      const newAttempts = otpData.attempts + 1
      const isBlocked = newAttempts >= 5
      
      setOtpData(prev => ({ 
        ...prev, 
        attempts: newAttempts,
        blocked: isBlocked
      }))
      
      if (isBlocked) {
        setErrors({ 
          submit: `Too many failed attempts (${newAttempts}/5). Please resend a new OTP to try again.` 
        })
      } else {
        setErrors({ 
          submit: `Invalid OTP. ${5 - newAttempts} attempts remaining.` 
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    try {
      setIsLoading(true)
      await sendOTP(otpData.email)
      
      setOtpData(prev => ({ 
        ...prev, 
        attempts: 0, 
        blocked: false, 
        lastResendTime: Date.now()
      }))
      setResendTimer(60)
      setErrors({})
    } catch (error) {
      console.error('Resend OTP error:', error)
      setErrors({ submit: 'Failed to resend OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    handleSwitchCard('login')
    setOtpData({ 
      email: '', 
      otp: '', 
      attempts: 0, 
      blocked: false, 
      lastResendTime: 0 
    })
    setResendTimer(0)
  }

  return (
    <>
      <Helmet>
        <title>Portiqqo - Sign In & Registration</title>
      </Helmet>

      {/* Outer Page Container - Warm Editorial Cream Theme */}
      <div className="min-h-screen bg-[#f9f6f0] dark:bg-[#141210] text-stone-900 dark:text-stone-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300">
        
        {/* Soft Warm Glowing Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f472b6]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#e6ccb2]/30 dark:bg-stone-800/40 blur-3xl pointer-events-none" />

        {/* 50/50 Split Container - Brand Dark Stone Left, Editorial Warm Cream Right */}
        <div className="w-full max-w-4xl min-h-[580px] rounded-3xl overflow-hidden shadow-2xl bg-[#fdfbf7] dark:bg-[#181614] border border-[#e6ccb2] dark:border-stone-800 flex flex-col md:flex-row my-auto z-10">
          
          {/* LEFT SIDE (50%): Brand Dark Theme Panel */}
          <div className="w-full md:w-1/2 bg-[#141210] text-stone-100 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-[580px] border-b md:border-b-0 md:border-r border-[#e6ccb2]/20 dark:border-stone-800">
            
            {/* Subtle Gradient & Card Overlays */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f472b6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Logo & Home Link */}
            <div className="flex items-center justify-between z-10">
              <Link to="/" className="font-heading font-black text-2xl tracking-tight text-stone-100 flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <span>porti<span className="text-[#f472b6]">qqo</span></span>
              </Link>
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700/80 transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>

            {/* Middle Welcome Text & Action Pill */}
            <div className="my-auto py-8 z-10 space-y-4">
              <AnimatePresence mode="wait">
                {activeCard === 'login' ? (
                  <motion.div
                    key="login-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                      <span>Join 2,500+ Creators</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight leading-tight text-stone-50">
                      Don't have an account?
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-normal">
                      Create an account to explore our curated portfolio templates and build your custom showcase.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchCard('signup')}
                        className="px-8 py-3 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-black text-sm rounded-full shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Create Account
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide uppercase">
                      <LogIn className="w-3.5 h-3.5 text-[#f472b6]" />
                      <span>Already Registered?</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight leading-tight text-stone-50">
                      Have an account?
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-normal">
                      Sign in with your email and password to manage your portfolio and editor settings.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchCard('login')}
                        className="px-8 py-3 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-black text-sm rounded-full shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Sign In
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Footer Note */}
            <div className="text-xs text-stone-400 font-medium z-10">
              Showcase your work professionally with Portiqqo
            </div>
          </div>

          {/* RIGHT SIDE (50%): Form Fields Container */}
          <div className="w-full md:w-1/2 bg-[#fdfbf7] dark:bg-[#181614] text-stone-900 dark:text-stone-100 p-6 sm:p-10 flex flex-col justify-center">
            
            {/* Top Form Segmented Mode Switcher */}
            {activeCard !== 'otp' && activeCard !== 'success' && (
              <div className="flex items-center justify-center p-1 bg-[#f5ebe0] dark:bg-stone-800/80 border border-[#e6ccb2] dark:border-stone-700 rounded-2xl mb-6 max-w-xs mx-auto w-full">
                <button
                  type="button"
                  onClick={() => handleSwitchCard('login')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                    activeCard === 'login' 
                      ? 'bg-[#f472b6] text-stone-950 shadow-md' 
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchCard('signup')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                    activeCard === 'signup' 
                      ? 'bg-[#f472b6] text-stone-950 shadow-md' 
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* LOGIN FORM VIEW */}
              {activeCard === 'login' && (
                <motion.div
                  key="login-form-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-heading font-black text-stone-900 dark:text-stone-100 tracking-tight">
                      Log In
                    </h1>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Enter your credentials to access your account
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Google Auth Button */}
                    <button
                      type="button"
                      onClick={() => window.location.href = googleAuthUrl}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-stone-800 border border-[#e6ccb2] dark:border-stone-700 rounded-2xl hover:bg-[#f5ebe0] dark:hover:bg-stone-700 transition-colors font-semibold text-xs text-stone-800 dark:text-stone-200 shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e6ccb2] dark:border-stone-800" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-[#fdfbf7] dark:bg-[#181614] px-3 text-stone-400 font-bold">OR</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-email" className="block text-xs font-bold text-stone-800 dark:text-stone-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                          errors.email ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-xs font-bold text-stone-800 dark:text-stone-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="login-password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 pr-10 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                            errors.password ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                    </div>

                    {errors.submit && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.submit}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-black rounded-2xl shadow-lg shadow-pink-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs"
                    >
                      {isLoading ? 'Signing In...' : 'Log In'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* CREATE ACCOUNT FORM VIEW */}
              {activeCard === 'signup' && (
                <motion.div
                  key="signup-form-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-heading font-black text-stone-900 dark:text-stone-100 tracking-tight">
                      Create Account
                    </h1>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Fill out your details to get started
                    </p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-3">
                    {/* Google Auth Button */}
                    <button
                      type="button"
                      onClick={() => window.location.href = googleAuthUrl}
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-stone-800 border border-[#e6ccb2] dark:border-stone-700 rounded-2xl hover:bg-[#f5ebe0] dark:hover:bg-stone-700 transition-colors font-semibold text-xs text-stone-800 dark:text-stone-200 shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative my-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e6ccb2] dark:border-stone-800" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-[#fdfbf7] dark:bg-[#181614] px-2 text-stone-400 font-bold">OR</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label htmlFor="signup-firstName" className="block text-[11px] font-bold text-stone-800 dark:text-stone-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="signup-firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                            errors.firstName ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label htmlFor="signup-lastName" className="block text-[11px] font-bold text-stone-800 dark:text-stone-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="signup-lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                            errors.lastName ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-[11px] font-bold text-stone-800 dark:text-stone-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="signup-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                          errors.email ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                        }`}
                        placeholder="name@domain.com"
                      />
                      {errors.email && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-[11px] font-bold text-stone-800 dark:text-stone-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="signup-password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-3.5 py-2 pr-10 rounded-2xl bg-white dark:bg-stone-900 border text-xs focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20 outline-none transition-all ${
                            errors.password ? 'border-red-500' : 'border-[#e6ccb2] dark:border-stone-700'
                          }`}
                          placeholder="Create password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {formData.password && (
                        <div className="mt-2 p-2 bg-[#f5ebe0] dark:bg-stone-800/80 rounded-xl border border-[#e6ccb2] dark:border-stone-700">
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span>Strength:</span>
                            <span className={
                              passwordStrength.score <= 2 ? 'text-red-500' :
                              passwordStrength.score <= 3 ? 'text-amber-500' : 'text-emerald-500'
                            }>
                              {getPasswordStrengthText(passwordStrength.score)}
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {errors.password && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.password}</p>}
                    </div>

                    {errors.submit && (
                      <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
                        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{errors.submit}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || (formData.password && !passwordStrength.isValid)}
                      className="w-full py-3 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-black rounded-2xl shadow-lg shadow-pink-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* OTP VERIFICATION VIEW */}
              {activeCard === 'otp' && (
                <motion.div
                  key="otp-form-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 text-center"
                >
                  <div>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500/10 text-pink-600 rounded-2xl mb-3">
                      <Mail className="w-6 h-6 text-[#f472b6]" />
                    </div>
                    <h1 className="text-2xl font-heading font-black tracking-tight">
                      Verify Your Email
                    </h1>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      We've sent a 6-digit code to <span className="font-bold text-stone-900 dark:text-stone-100">{otpData.email}</span>
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleOTPSubmit(otpData.otp); }} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={otpData.otp}
                        onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                        className="w-full text-center text-xl font-bold tracking-[0.4em] py-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#e6ccb2] dark:border-stone-700 outline-none focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20"
                        placeholder="123456"
                        maxLength="6"
                        disabled={otpData.blocked}
                      />
                      {otpData.attempts > 0 && !otpData.blocked && (
                        <p className="mt-2 text-xs text-amber-600 font-medium">
                          {5 - otpData.attempts} attempts remaining
                        </p>
                      )}
                      {errors.submit && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{errors.submit}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpData.otp.length !== 6 || otpData.blocked}
                      className="w-full py-3.5 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-black rounded-2xl shadow-lg shadow-pink-500/20 transition-all text-xs disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : otpData.blocked ? 'Blocked - Resend OTP' : 'Verify Email'}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className="text-[#f472b6] font-bold hover:underline disabled:opacity-50"
                      >
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend code'}
                      </button>
                      <button
                        type="button"
                        onClick={goBack}
                        className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-bold"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* SUCCESS VIEW */}
              {activeCard === 'success' && (
                <motion.div
                  key="success-view-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-heading font-black tracking-tight">
                    Welcome to Portiqqo!
                  </h1>
                  <p className="text-xs text-stone-500">
                    You're all set! Redirecting...
                  </p>
                  <div className="w-6 h-6 border-2 border-[#f472b6] border-t-transparent rounded-full animate-spin mx-auto mt-4" />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-stone-500 dark:text-stone-400 z-10 mt-4">
          &copy; {new Date().getFullYear()} Portiqqo. All rights reserved.
        </div>
      </div>
    </>
  )
}

export default UnifiedAuthPage