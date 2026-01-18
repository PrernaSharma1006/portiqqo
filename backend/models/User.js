const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 50
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  otpCode: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  lastOtpRequest: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  storageUsed: {
    type: Number,
    default: 0 // in bytes
  },
  storageLimit: {
    type: Number,
    default: 16106127360 // 15GB in bytes
  },
  subscription: {
    type: {
      type: String,
      enum: ['trial', 'active', 'cancelled', 'expired'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    trialStartDate: {
      type: Date,
      default: Date.now
    },
    trialEndDate: {
      type: Date,
      default: function() {
        // 7 days from now
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ otpCode: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for storage usage percentage
userSchema.virtual('storageUsagePercentage').get(function() {
  return Math.round((this.storageUsed / this.storageLimit) * 100);
});

// Pre-save middleware to hash password if it exists
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otpCode = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.lastOtpRequest = Date.now();
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(enteredOTP) {
  if (!this.otpCode || !this.otpExpires) {
    return false;
  }
  
  if (Date.now() > this.otpExpires) {
    return false;
  }
  
  return this.otpCode === enteredOTP;
};

// Method to clear OTP
userSchema.methods.clearOTP = function() {
  this.otpCode = null;
  this.otpExpires = null;
  this.otpAttempts = 0;
};

// Method to check if user can request new OTP (rate limiting)
userSchema.methods.canRequestOTP = function() {
  const oneMinute = 60 * 1000;
  return !this.lastOtpRequest || (Date.now() - this.lastOtpRequest) > oneMinute;
};

// Method to increment storage usage
userSchema.methods.incrementStorage = function(bytes) {
  this.storageUsed += bytes;
  return this.save();
};

// Method to decrement storage usage
userSchema.methods.decrementStorage = function(bytes) {
  this.storageUsed = Math.max(0, this.storageUsed - bytes);
  return this.save();
};

// Method to check if user has exceeded storage limit
userSchema.methods.hasExceededStorage = function() {
  return this.storageUsed >= this.storageLimit;
};

module.exports = mongoose.model('User', userSchema);