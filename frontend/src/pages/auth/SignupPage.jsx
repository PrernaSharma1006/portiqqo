import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import OTPVerification from '../../components/auth/OTPVerification';

function SignupPage() {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from login with verified email
  useEffect(() => {
    if (location.state?.otpVerified && location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
      setStep('password');
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    setPasswordStrength({ score, feedback });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Check if user already exists
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          setErrors({ email: 'An account with this email already exists. Please sign in instead.' });
          return;
        }
        
        // Send OTP for verification
        const otpResponse = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: formData.email,
            action: 'signup'
          })
        });

        if (otpResponse.ok) {
          setStep('otp');
        } else {
          const otpData = await otpResponse.json();
          setErrors({ submit: otpData.message || 'Failed to send OTP' });
        }
      } else {
        setErrors({ submit: data.message || 'Failed to check email' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = (data) => {
    setStep('password');
  };

  const handleResendOTP = async () => {
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.email,
        action: 'signup'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to resend OTP');
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setErrors({});
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'bg-rose-500';
    if (passwordStrength.score <= 2) return 'bg-orange-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-lime-500';
    return 'bg-mint-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 1) return 'Very Weak';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  // Show OTP verification step
  if (step === 'otp') {
    return (
      <>
        <Helmet>
          <title>Verify Email - Portiqqo</title>
          <meta name="description" content="Verify your email to continue registration" />
        </Helmet>
        <OTPVerification
          email={formData.email}
          onVerifySuccess={handleOTPSuccess}
          onResendOTP={handleResendOTP}
          onBack={handleBackToEmail}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - Portiqqo</title>
        <meta name="description" content="Create your Portiqqo account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-peach-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">PB</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-lavender-800">
              {step === 'password' ? 'Create Your Account' : 'Get Started'}
            </h2>
            <p className="mt-2 text-sm text-lavender-600">
              {step === 'password' 
                ? 'Set up your password and profile'
                : 'Enter your email to create your account'
              }
            </p>
          </div>
          
          <div className="card p-8">
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-lavender-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'input-error' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="error-text">{errors.email}</p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                      <p className="text-sm text-rose-600">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Sending OTP...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-lavender-600">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="font-medium text-primary-500 hover:text-primary-400 transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </motion.form>
              )}

              {step === 'password' && (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-lavender-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="error-text">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-lavender-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field ${errors.password ? 'input-error' : ''}`}
                      placeholder="Create a strong password"
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex-1 bg-lavender-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-lavender-600">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <ul className="text-xs text-lavender-600 space-y-1">
                            {passwordStrength.feedback.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {errors.password && (
                      <p className="error-text">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-lavender-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="error-text">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                      <p className="text-sm text-rose-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading || passwordStrength.score < 3}
                      className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    {!location.state?.otpVerified && (
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="btn-ghost w-full"
                      >
                        Change Email
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <p className="text-xs text-lavender-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SignupPage;