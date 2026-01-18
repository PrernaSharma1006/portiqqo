const User = require('../models/User');
const authService = require('../services/authService');

// @desc    Simple login - create user and token from email only
// @route   POST /api/auth/login
// @access  Public
const simpleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        firstName: email.split('@')[0] || 'User',
        lastName: '',
        isEmailVerified: true,
        loginCount: 1,
        lastLogin: new Date()
      });
      await user.save();
      console.log(`✅ New user created: ${email}`);
    } else {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount += 1;
      user.isEmailVerified = true;
      await user.save();
      console.log(`✅ User logged in: ${email}`);
    }

    // Generate tokens
    const tokenResponse = authService.createTokenResponse(user);

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: tokenResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// @desc    Check if email exists (always allow for simplicity)
// @route   POST /api/auth/check-email
// @access  Public
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // For development, always allow email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    res.status(200).json({
      success: true,
      exists: !!user,
      data: {
        available: true, // Always available for registration
        exists: !!user
      }
    });

  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check email'
    });
  }
};

// @desc    Mock OTP send (returns fixed OTP)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Return mock OTP for development
    console.log(`🔧 [DEV] Mock OTP for ${email}: 123456`);

    res.status(200).json({
      success: true,
      message: 'Verification code sent',
      data: {
        email: email,
        otp: '123456', // Fixed OTP for development
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
};

// @desc    Mock OTP verify (accepts 123456)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Accept only the mock OTP
    if (otp !== '123456') {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP. Use 123456 for development.'
      });
    }

    console.log(`✅ OTP verified for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: email,
        verified: true
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
};

// @desc    Simple signup (same as login for development)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  return simpleLogin(req, res);
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user data'
    });
  }
};

// @desc    Logout (simple response)
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Refresh token (simple mock)
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: {
      token: 'mock-refresh-token',
      expiresIn: '1h'
    }
  });
};

// @desc    Update profile (simple mock)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

module.exports = {
  login: simpleLogin,
  signup,
  sendOTP,
  verifyOTP,
  checkEmail,
  getMe,
  logout,
  refreshToken,
  updateProfile
};