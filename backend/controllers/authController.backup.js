const User = require('../models/User');
const emailService = require('../services/emailService');
const authService = require('../services/authService');

// @desc    Generate token (simplified - no actual OTP)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res, next) => {
  try {
    const { email, action = 'login' } = req.body;

    // Validate email
    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // For development, just return success with a mock OTP
    const mockOTP = '123456';
    console.log(`🔧 [DEV MODE] Mock OTP for ${email}: ${mockOTP}`);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      data: {
        email: email,
        expiresIn: '10 minutes',
        action: action,
        devOTP: mockOTP // Only in development
      }
    });

  } catch (error) {
    console.error('SendOTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
};

// @desc    Verify OTP (simplified - accepts 123456)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // For development, accept mock OTP
    if (otp !== '123456') {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code. Use 123456 for development.',
        attemptsRemaining: 3
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        firstName: email.split('@')[0],
        lastName: '',
        isEmailVerified: true,
        loginCount: 0
      });
      await user.save();
    } else {
      // Mark existing user as verified
      user.isEmailVerified = true;
      await user.save();
    }

    console.log(`✅ OTP verified for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: user.email,
        isNewUser: user.loginCount === 0,
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('VerifyOTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
};

// @desc    Login with email and password password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user and include password for validation
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isTemporary: { $ne: true }
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email before logging in'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate tokens
    const tokenResponse = authService.createTokenResponse(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: tokenResponse
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Complete signup with password
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Find user (should be temporary from OTP verification)
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

    if (!user.isTemporary && user.password) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Update user with password and name
    user.password = password;
    user.firstName = name.split(' ')[0] || name;
    user.lastName = name.split(' ').slice(1).join(' ') || '';
    user.isTemporary = false;
    user.loginCount = 1;
    user.lastLogin = new Date();
    
    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.firstName, user.lastName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if welcome email fails
    }

    // Generate tokens
    const tokenResponse = authService.createTokenResponse(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: tokenResponse
    });

  } catch (error) {
    next(error);
  }
};
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = authService.verifyRefreshToken(refreshToken);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Check if session is still valid
    if (!authService.isSessionValid(user)) {
      return res.status(401).json({
        success: false,
        error: 'Session is no longer valid'
      });
    }

    // Generate new tokens
    const tokenResponse = authService.createTokenResponse(user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokenResponse
    });

  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // In a more complex system, you might want to maintain a blacklist of tokens
    // For now, we'll just send a success response
    // The client should remove the token from storage
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otpCode -otpExpires');
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        subscription: user.subscription,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        storageUsagePercentage: user.storageUsagePercentage,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    
    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    const user = await User.findById(req.user.id);
    
    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Check if email exists (simplified for development)
// @route   POST /api/auth/check-email
// @access  Public
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const user = await User.findOne({ 
      email: email.toLowerCase()
    });
    
    console.log(`📧 Email check for ${email}: ${user ? 'exists' : 'new user'}`);
    
    res.status(200).json({
      success: true,
      exists: !!user,
      data: {
        available: !user,
        exists: !!user
      }
    });

  } catch (error) {
    console.error('CheckEmail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check email'
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  login,
  signup,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  checkEmail
};