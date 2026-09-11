const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const {
  sendOTP,
  verifyOTP,
  login,
  loginWithPassword,
  signup,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  checkEmail
} = require('../controllers/authController');

// @route   POST /api/auth/send-otp
// @desc    Send OTP for registration
// @access  Public
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/login
// @desc    Login with email and password
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/login-password
// @desc    Login with email and password directly
// @access  Public
router.post('/login-password', loginWithPassword);

// @route   POST /api/auth/signup
// @desc    Complete signup with password
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', refreshToken);

// @route   POST /api/auth/check-email
// @desc    Check if email is available
// @access  Public
router.post('/check-email', checkEmail);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, logout);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET /api/auth/google
// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
const getFrontendUrl = () => {
  if (process.env.APP_URL && !process.env.APP_URL.includes('onrender.com')) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    return 'https://portiqqo.vercel.app';
  }
  return 'http://localhost:3000';
};

router.get('/google/callback', (req, res, next) => {
  const frontendUrl = getFrontendUrl();

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Passport Google Strategy Error:', err);
      const msg = err.message || 'Passport strategy error';
      return res.redirect(`${frontendUrl}/auth?error=google_strategy_error&msg=${encodeURIComponent(msg)}`);
    }

    if (!user) {
      console.error('Passport Google Strategy No User:', info);
      const msg = (info && info.message) || 'Could not verify user account from Google';
      return res.redirect(`${frontendUrl}/auth?error=google_no_user&msg=${encodeURIComponent(msg)}`);
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_for_development_only';

      const token = jwt.sign(
        { 
          id: user._id,
          userId: user._id,
          email: user.email,
          type: 'google_oauth'
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
    } catch (jwtErr) {
      console.error('Google Callback JWT Error:', jwtErr);
      return res.redirect(`${frontendUrl}/auth?error=jwt_signing_error&msg=${encodeURIComponent(jwtErr.message)}`);
    }
  })(req, res, next);
});

module.exports = router;