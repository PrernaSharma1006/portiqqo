import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OTPVerification = ({ 
  email, 
  onVerifySuccess, 
  onResendOTP, 
  onBack,
  isLoading = false 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef([]);
  const maxAttempts = 4;

  useEffect(() => {
    if (timeRemaining > 0 && !canResend) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setCanResend(true);
    }
  }, [timeRemaining, canResend]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all inputs are filled
    if (newOtp.every(digit => digit !== '') && !isVerifying) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        onVerifySuccess(data);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError(`Maximum attempts exceeded. Please request a new OTP.`);
          setCanResend(true);
          setTimeRemaining(0);
        } else {
          setError(`Invalid OTP. ${maxAttempts - newAttempts} attempts remaining.`);
        }
        
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await onResendOTP();
      setTimeRemaining(60);
      setCanResend(false);
      setAttempts(0);
      setError('');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-peach-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading text-lavender-800 mb-2">
              Verify Your Email
            </h1>
            <p className="text-lavender-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-lavender-800 mt-1">
              {email}
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-lavender-700 mb-3 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors duration-200"
                    disabled={isVerifying || isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <p className="error-text">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attempts and Timer */}
            <div className="text-center space-y-2">
              {attempts > 0 && attempts < maxAttempts && (
                <p className="text-sm text-rose-600">
                  {attempts} of {maxAttempts} attempts used
                </p>
              )}
              
              {!canResend && timeRemaining > 0 && (
                <p className="text-sm text-lavender-600">
                  Resend OTP in {formatTime(timeRemaining)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canResend && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleResendOTP}
                  className="btn-primary w-full"
                  disabled={isLoading}
                >
                  Resend OTP
                </motion.button>
              )}

              <button
                onClick={() => handleVerifyOTP()}
                disabled={otp.some(digit => digit === '') || isVerifying || isLoading}
                className="btn-secondary w-full flex items-center justify-center"
              >
                {isVerifying ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                onClick={onBack}
                className="btn-ghost w-full"
                disabled={isVerifying || isLoading}
              >
                Change Email Address
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-lavender-600">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;