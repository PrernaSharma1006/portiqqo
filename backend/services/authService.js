const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '1d',
    });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate secure random token
  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash token for storage
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Create token response object
  createTokenResponse(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      token,
      refreshToken,
      expiresIn: '1d',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        subscription: user.subscription,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        storageUsagePercentage: user.storageUsagePercentage
      }
    };
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength with comprehensive checks
  validatePassword(password) {
    const errors = [];
    
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    const weakPatterns = [
      { pattern: /^password/i, message: 'Password cannot start with "password"' },
      { pattern: /^123456/, message: 'Password cannot start with sequential numbers' },
      { pattern: /^qwerty/i, message: 'Password cannot be a keyboard pattern' },
      { pattern: /^admin/i, message: 'Password cannot start with "admin"' },
      { pattern: /^letmein/i, message: 'Password is too common' },
      { pattern: /(.)\\1{3,}/, message: 'Password cannot have 4 or more repeated characters' },
      { pattern: /^\\d+$/, message: 'Password cannot be only numbers' },
      { pattern: /^[a-zA-Z]+$/, message: 'Password cannot be only letters' }
    ];
    
    weakPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(password)) {
        errors.push(message);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: [...new Set(errors)], // Remove duplicates
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength score
  calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    
    // Bonus points for length
    if (password.length >= 12) score += 0.5;
    if (password.length >= 16) score += 0.5;
    
    // Penalty for common patterns
    const commonPatterns = [/password/i, /123456/, /qwerty/i, /admin/i];
    commonPatterns.forEach(pattern => {
      if (pattern.test(password)) score -= 1;
    });
    
    return Math.max(0, Math.min(5, score));
  }

  // Rate limiting for OTP requests
  canRequestOTP(lastRequest, attempts = 0) {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const maxAttempts = 5;

    // Check if too many attempts
    if (attempts >= maxAttempts) {
      return { canRequest: false, reason: 'Too many attempts. Try again later.' };
    }

    // Check rate limiting
    if (lastRequest && (now - lastRequest) < oneMinute) {
      return { canRequest: false, reason: 'Please wait before requesting another code.' };
    }

    return { canRequest: true };
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }

  // Check if user session is valid
  isSessionValid(user, tokenIssuedAt) {
    // Check if user account is active
    if (!user.isActive) {
      return false;
    }

    // Check if user email is verified
    if (!user.isEmailVerified) {
      return false;
    }

    // Could add more session validation logic here
    // For example, check if password was changed after token was issued
    
    return true;
  }

  // Generate subdomain from name
  generateSubdomain(firstName, lastName) {
    const fullName = `${firstName}-${lastName}`.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return fullName || 'portfolio';
  }

  // Validate subdomain format
  validateSubdomain(subdomain) {
    const subdomainRegex = /^[a-z0-9-]+$/;
    
    if (!subdomain || subdomain.length < 3 || subdomain.length > 50) {
      return { valid: false, message: 'Subdomain must be 3-50 characters long' };
    }
    
    if (!subdomainRegex.test(subdomain)) {
      return { valid: false, message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' };
    }
    
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return { valid: false, message: 'Subdomain cannot start or end with a hyphen' };
    }
    
    // Reserved subdomains
    const reserved = [
      'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 
      'store', 'support', 'help', 'about', 'contact', 'legal', 
      'privacy', 'terms', 'docs', 'dev', 'staging', 'test'
    ];
    
    if (reserved.includes(subdomain)) {
      return { valid: false, message: 'This subdomain is reserved' };
    }
    
    return { valid: true };
  }
}

module.exports = new AuthService();