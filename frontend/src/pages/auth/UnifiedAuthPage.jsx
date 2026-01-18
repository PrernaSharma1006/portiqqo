import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, LogIn, CheckCircle, Eye, EyeOff, Mail } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function UnifiedAuthPage() {
  const [activeCard, setActiveCard] = useState('choice')
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
    if (score <= 4) return 'bg-blue-500'
    return 'bg-green-500'
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
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterAuth')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterAuth')
          navigate(redirectPath)
        } else {
          navigate('/dashboard')
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
    setErrors({}) // Clear any previous errors
    
    try {
      console.log('Checking if email exists:', formData.email)
      const result = await checkEmailExists(formData.email)
      console.log('Email exists result:', result)
      
      if (result.exists) {
        setErrors({ email: 'Email is already registered. Please sign in instead.' })
        setIsLoading(false)
        return
      }
      
      // Send OTP for verification
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
      setResendTimer(60) // 60 second cooldown
      setActiveCard('otp')
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (otp) => {
    // Check if user is blocked
    if (otpData.blocked) {
      setErrors({ submit: 'Too many failed attempts. Please wait and resend a new OTP.' })
      return
    }

    setIsLoading(true)
    setErrors({}) // Clear any previous errors
    
    try {
      console.log('Verifying OTP:', otp, 'for email:', otpData.email)
      const verifyResult = await verifyOTP(otpData.email, otp)
      
      if (!verifyResult.success) {
        throw new Error('OTP verification failed')
      }
      
      console.log('OTP verified successfully, completing signup...')
      
      // Mark OTP as verified and reset attempts
      setOtpData(prev => ({ ...prev, verified: true, attempts: 0, blocked: false }))
      
      // Complete signup with user details only after OTP is verified
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })
      
      setActiveCard('success')
      setTimeout(() => {
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterAuth')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterAuth')
          navigate(redirectPath)
        } else {
          navigate('/dashboard')
        }
      }, 2000)
    } catch (error) {
      console.error('OTP verification error:', error)
      
      // Increment failed attempts
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
    if (resendTimer > 0) {
      return // Still in cooldown
    }

    try {
      setIsLoading(true)
      await sendOTP(otpData.email)
      
      // Reset attempts and blocking, start new cooldown
      setOtpData(prev => ({ 
        ...prev, 
        attempts: 0, 
        blocked: false, 
        lastResendTime: Date.now()
      }))
      setResendTimer(60) // 60 second cooldown
      setErrors({}) // Clear any errors
      
      console.log('OTP resent successfully')
    } catch (error) {
      console.error('Resend OTP error:', error)
      setErrors({ submit: 'Failed to resend OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    setActiveCard('choice')
    setErrors({})
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
        <title>Sign In / Sign Up - Portiqqo</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-mint-50 to-peach-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            
            {activeCard === 'choice' && (
              <motion.div
                key="choice"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">
                    Portiqqo
                  </h1>
                  <p className="text-secondary-600">
                    Choose how you'd like to continue
                  </p>
                </div>

                <motion.div 
                  className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary-200"
                  onClick={() => setActiveCard('login')}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <LogIn className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                        Sign In
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        Already have an account? Sign in with email and password.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-mint-200"
                  onClick={() => setActiveCard('signup')}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-mint-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                        Create Account
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        New user? Create account with email verification.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeCard === 'login' && (
              <motion.div
                key="login"
                className="card p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <LogIn className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-secondary-600">
                    Sign in to your account
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/google`}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCard('signup')}
                      className="btn-ghost w-full"
                    >
                      Don't have an account? Create one
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeCard === 'otp' && (
              <motion.div
                key="otp"
                className="card p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-secondary-600 mb-2">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-primary-600 font-medium">{otpData.email}</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleOTPSubmit(otpData.otp); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3 text-center">
                      Enter verification code
                    </label>
                    <input
                      type="text"
                      value={otpData.otp}
                      onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                      className={`input-field text-center text-lg font-semibold tracking-widest ${
                        otpData.blocked ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="123456"
                      maxLength="6"
                      disabled={otpData.blocked}
                    />
                    
                    {/* Attempt counter */}
                    {otpData.attempts > 0 && !otpData.blocked && (
                      <p className="mt-2 text-sm text-center text-orange-600">
                        {5 - otpData.attempts} attempts remaining
                      </p>
                    )}
                    
                    {errors.submit && (
                      <p className="mt-3 text-sm text-center text-red-600">
                        {errors.submit}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading || otpData.otp.length !== 6 || otpData.blocked}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : otpData.blocked ? 'Blocked - Resend OTP' : 'Verify Email'}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className={`text-sm ${
                          resendTimer > 0 || isLoading
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-primary-600 hover:text-primary-700'
                        }`}
                      >
                        {resendTimer > 0 
                          ? `Resend code (${resendTimer}s)`
                          : isLoading
                          ? 'Sending...'
                          : 'Resend code'
                        }
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={goBack}
                      className="btn-ghost w-full"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeCard === 'signup' && (
              <motion.div
                key="signup"
                className="card p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 text-mint-600 rounded-full mb-4">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                    Create Account
                  </h1>
                  <p className="text-secondary-600">
                    Join Portiqqo
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  {/* Google Signup Button */}
                  <button
                    type="button"
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/google`}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-700">Password Strength:</span>
                          <span className={`text-sm font-semibold ${
                            passwordStrength.score <= 2 ? 'text-red-600' :
                            passwordStrength.score <= 3 ? 'text-yellow-600' :
                            passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {getPasswordStrengthText(passwordStrength.score)}
                          </span>
                        </div>
                        
                        {/* Strength Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              getPasswordStrengthColor(passwordStrength.score)
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="space-y-1">
                          <div className="text-xs text-secondary-600 mb-1">Password must contain:</div>
                          {[
                            { key: 'length', text: 'At least 8 characters', check: formData.password.length >= 8 },
                            { key: 'uppercase', text: 'One uppercase letter (A-Z)', check: /[A-Z]/.test(formData.password) },
                            { key: 'lowercase', text: 'One lowercase letter (a-z)', check: /[a-z]/.test(formData.password) },
                            { key: 'number', text: 'One number (0-9)', check: /\d/.test(formData.password) },
                            { key: 'special', text: 'One special character (!@#$%^&*)', check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) }
                          ].map((requirement) => (
                            <div key={requirement.key} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                requirement.check ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <span className={`text-xs ${
                                requirement.check ? 'text-green-600' : 'text-secondary-500'
                              }`}>
                                {requirement.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading || (formData.password && !passwordStrength.isValid)}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCard('login')}
                      className="btn-ghost w-full"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeCard === 'success' && (
              <motion.div
                key="success"
                className="card p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                  Welcome to Portiqqo!
                </h1>
                <p className="text-secondary-600 mb-6">
                  You're all set! Redirecting to dashboard...
                </p>
                <div className="loading-spinner mx-auto"></div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default UnifiedAuthPage