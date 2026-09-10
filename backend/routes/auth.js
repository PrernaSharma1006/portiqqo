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
} = require('../controllers/authController.real');

// @route   POST /api/auth/send-otp
// @desc    Send OTP for login/registration
// @access  Public
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
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

router.get('/google/callback', 
  (req, res, next) => {
    const defaultRedirect = getFrontendUrl();
    passport.authenticate('google', { 
      failureRedirect: `${defaultRedirect}/auth?error=google_auth_failed`,
      session: false 
    })(req, res, next);
  },
  (req, res) => {
    try {
      // Validate user object
      if (!req.user || !req.user._id) {
        throw new Error('User data not found from Passport Google authentication');
      }

      const jwtSecret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_for_development_only';

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: req.user._id,
          email: req.user.email,
          type: 'google_oauth'
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = getFrontendUrl();

      res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = getFrontendUrl();
      res.redirect(`${frontendUrl}/auth?error=authentication_failed&details=${encodeURIComponent(error.message)}`);
    }
  }
);

module.exports = router;