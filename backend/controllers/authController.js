const User = require('../models/User');
const emailService = require('../services/emailService');
const authService = require('../services/authService');

// @desc    Send OTP for login/registration
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email, action = 'login' } = req.body;

    // Validate email
    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Check rate limiting
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user && user.lastOtpRequest) {
      const timeSinceLastRequest = Date.now() - user.lastOtpRequest.getTime();
      if (timeSinceLastRequest < 60000) { // 1 minute cooldown
        return res.status(429).json({
          success: false,
          error: 'Please wait before requesting another OTP',
          waitTime: Math.ceil((60000 - timeSinceLastRequest) / 1000)
        });
      }
    }

    // Generate and store OTP
    if (!user) {
      // Create temporary user for OTP verification
      user = new User({
        email: email.toLowerCase(),
        firstName: email.split('@')[0] || 'User',
        lastName: '',
        isTemporary: true,
        isEmailVerified: false
      });
    }

    // Generate OTP using the User model method
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await emailService.sendOTP(email, otp, user.firstName);
      console.log(`📧 OTP sent successfully to: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        data: {
          email: email,
          expiresIn: '10 minutes',
          action: action
        }
      });

    } catch (emailError) {
      console.error('❌ Email service error:', emailError);
      
      // For development, provide fallback with actual OTP in response
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔧 [DEV MODE] Email failed, OTP for ${email}: ${otp}`);
        res.status(200).json({
          success: true,
          message: 'Email service unavailable. Using development mode.',
          data: {
            email: email,
            expiresIn: '10 minutes',
            action: action,
            devOTP: otp // Only in development when email fails
          }
        });
      } else {
        throw emailError;
      }
    }

  } catch (error) {
    console.error('SendOTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
};

// @desc    Verify OTP and complete email verification
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please request a new OTP.'
      });
    }

    // Verify OTP using the User model method
    const isValidOTP = user.verifyOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code'
      });
    }

    // Mark user as verified and not temporary
    user.isEmailVerified = true;
    user.isTemporary = false;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.lastOtpRequest = undefined;
    await user.save();

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

// @desc    Login with email and password directly
// @route   POST /api/auth/login-password
// @access  Public
const loginWithPassword = async (req, res) => {
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
      isEmailVerified: true,
      isTemporary: { $ne: true }
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
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
    console.error('Password login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// @desc    Login with email after OTP verification
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find verified user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: true,
      isTemporary: { $ne: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// @desc    Complete signup with password after OTP verification
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find verified user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

    // Update user info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password; // Will be hashed by pre-save middleware
    
    user.isTemporary = false;
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate tokens
    const tokenResponse = authService.createTokenResponse(user);

    res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: tokenResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
};

// @desc    Check if email exists
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

    // Check if user exists and is verified
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isTemporary: { $ne: true }
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

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
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
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
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
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
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

// @desc    Update user profile
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
      message: 'Profile updated successfully',
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
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
};