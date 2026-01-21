import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import OTPVerification from '../../components/auth/OTPVerification'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
}

const slideIn = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.5 }
}

function AuthPage() {
  const [step, setStep] = useState('email') // 'email', 'user-exists', 'otp', 'new-user-success', 'returning-user-success'
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  })
  const [userExists, setUserExists] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { checkEmailExists, sendOTP, verifyOTP, login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Check if email exists
      const result = await checkEmailExists(formData.email)
      setUserExists(result.exists)
      
      if (result.exists) {
        setStep('user-exists')
      } else {
        // New user - send OTP directly
        await sendOTP(formData.email)
        setStep('otp')
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExistingUserLogin = async () => {
    setIsLoading(true)
    try {
      await sendOTP(formData.email)
      setStep('otp')
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to send OTP' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewUserSignup = async () => {
    setIsLoading(true)
    try {
      await sendOTP(formData.email)
      setStep('otp')
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to send OTP' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSuccess = async (data) => {
    try {
      // Complete login for both new and existing users
      await login(formData.email)
      
      if (userExists) {
        setStep('returning-user-success')
      } else {
        setStep('new-user-success')
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' })
    }
  }

  const handleResendOTP = async () => {
    try {
      await sendOTP(formData.email)
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to resend OTP' })
    }
  }

  const goBack = () => {
    if (step === 'user-exists') {
      setStep('email')
    } else if (step === 'otp') {
      setStep(userExists ? 'user-exists' : 'email')
    }
    setErrors({})
  }

  return (
    <>
      <Helmet>
        <title>Sign In / Sign Up - Portiqqo</title>
        <meta name="description" content="Create your account or sign in to Portiqqo" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-md px-2 sm:px-0">
          <AnimatePresence mode="wait">
            {/* Email Input Step */}
            {step === 'email' && (
              <motion.div
                key="email"
                className="card p-4 sm:p-6 md:p-8"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-secondary-900 mb-2">
                    Welcome to Portiqqo
                  </h1>
                  <p className="text-sm sm:text-base text-secondary-600">
                    Enter your email to get started
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                      placeholder="Enter your email address"
                      autoFocus
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Checking...
                      </div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* User Exists Step */}
            {step === 'user-exists' && (
              <motion.div
                key="user-exists"
                className="card p-8"
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 text-mint-600 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-secondary-600 mb-4">
                    An account with <span className="font-semibold">{formData.email}</span> already exists.
                  </p>
                  <p className="text-sm text-secondary-500">
                    We'll send a verification code to your email to sign you in securely.
                  </p>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleExistingUserLogin}
                    disabled={isLoading}
                    className="btn-primary w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Sending Code...
                      </div>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>

                  <button
                    onClick={goBack}
                    className="btn-ghost w-full flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Use Different Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Verification Step */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <OTPVerification
                  email={formData.email}
                  onVerifySuccess={handleOTPSuccess}
                  onResendOTP={handleResendOTP}
                  onBack={goBack}
                  title={userExists ? "Welcome Back!" : "Verify Your Email"}
                  subtitle={userExists 
                    ? "Please enter the verification code sent to your email to sign in." 
                    : "Please enter the verification code sent to your email to complete registration."
                  }
                />
              </motion.div>
            )}

            {/* New User Success */}
            {step === 'new-user-success' && (
              <motion.div
                key="new-user-success"
                className="card p-8 text-center"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                  Account Created Successfully!
                </h1>
                <p className="text-secondary-600 mb-6">
                  Welcome to Portiqqo! Your account has been verified and you're now logged in.
                </p>
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-sm text-secondary-500">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}

            {/* Returning User Success */}
            {step === 'returning-user-success' && (
              <motion.div
                key="returning-user-success"
                className="card p-8 text-center"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
                  Welcome Back!
                </h1>
                <p className="text-secondary-600 mb-6">
                  You've been successfully signed in to your Portiqqo account.
                </p>
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-sm text-secondary-500">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default AuthPage