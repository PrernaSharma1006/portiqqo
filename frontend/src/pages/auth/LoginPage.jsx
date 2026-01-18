import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import OTPVerification from '../../components/auth/OTPVerification';

function LoginPage() {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      // Check if user exists and send OTP
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setUserExists(data.exists);
        
        // Send OTP for verification
        const otpResponse = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: formData.email,
            action: data.exists ? 'login' : 'signup'
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
    if (userExists) {
      // User exists, proceed to password entry
      setStep('password');
    } else {
      // New user, redirect to signup
      navigate('/signup', { 
        state: { 
          email: formData.email, 
          otpVerified: true,
          verificationData: data
        } 
      });
    }
  };

  const handleResendOTP = async () => {
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.email,
        action: userExists ? 'login' : 'signup'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to resend OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setErrors({});
  };

  // Show OTP verification step
  if (step === 'otp') {
    return (
      <>
        <Helmet>
          <title>Verify Email - Portiqqo</title>
          <meta name="description" content="Verify your email with OTP" />
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
        <title>Sign In - Portiqqo</title>
        <meta name="description" content="Sign in to your Portiqqo account" />
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
              {step === 'password' ? 'Enter Your Password' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-lavender-600">
              {step === 'password' 
                ? `Complete login for ${formData.email}`
                : 'Enter your email to sign in to your account'
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
                      Don't have an account?{' '}
                      <Link 
                        to="/signup" 
                        className="font-medium text-primary-500 hover:text-primary-400 transition-colors duration-200"
                      >
                        Sign up
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
                    <label htmlFor="password" className="block text-sm font-medium text-lavender-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field ${errors.password ? 'input-error' : ''}`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="error-text">{errors.password}</p>
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
                      disabled={isLoading}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="btn-ghost w-full"
                    >
                      Change Email
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <p className="text-xs text-lavender-500">
              By signing in, you agree to our{' '}
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

export default LoginPage