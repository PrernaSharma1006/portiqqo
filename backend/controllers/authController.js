const User = require('../models/User');
const authService = require('../services/authService');

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !authService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ 
      email: cleanEmail,
      isEmailVerified: true,
      isTemporary: { $ne: true }
    }).select('_id email').lean();

    return res.status(200).json({
      success: true,
      exists: !!existingUser,
      data: {
        email: cleanEmail,
        exists: !!existingUser
      }
    });
  } catch (error) {
    console.error('CheckEmail error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check email'
    });
  }
};

// @desc    Complete Signup with verified email and password
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists or create new one
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      user.password = password;
      user.isEmailVerified = true;
      user.isTemporary = false;
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();
    } else {
      user = new User({
        email: cleanEmail,
        firstName: firstName || cleanEmail.split('@')[0] || 'User',
        lastName: lastName || '',
        password: password,
        isEmailVerified: true,
        isTemporary: false,
        lastLogin: new Date(),
        loginCount: 1
      });
      await user.save();
    }

    // Create JWT token response
    const tokenResponse = authService.createTokenResponse(user);

    console.log(`🎉 User registered & logged in: ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: tokenResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
};

// @desc    Login with email and password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password if set
    if (user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const tokenResponse = authService.createTokenResponse(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: tokenResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const decoded = authService.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const tokenResponse = authService.createTokenResponse(user);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokenResponse
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({
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
    return res.status(200).json({
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
    return res.status(500).json({
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
    const { firstName, lastName } = req.body || {};
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    await user.save();

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// @desc    Login with email and password (alias)
// @route   POST /api/auth/login-password
// @access  Public
const loginWithPassword = login;

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  login,
  loginWithPassword,
  signup,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  checkEmail
};