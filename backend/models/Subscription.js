const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayCustomerId: {
    type: String,
    sparse: true
  },
  razorpaySubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  planId: String,
  type: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'unpaid'],
    default: 'active'
  },
  currentPeriodStart: {
    type: Date,
    default: Date.now
  },
  currentPeriodEnd: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  canceledAt: Date,
  endedAt: Date,
  trialStart: Date,
  trialEnd: Date,
  
  // Billing information
  billing: {
    amount: {
      type: Number,
      default: 8100 // Amount in paise (₹81.00)
    },
    currency: {
      type: String,
      default: 'INR'
    },
    interval: {
      type: String,
      enum: ['month', 'year'],
      default: 'month'
    },
    intervalCount: {
      type: Number,
      default: 1
    }
  },
  
  // Usage tracking
  usage: {
    storageUsed: {
      type: Number,
      default: 0 // in bytes
    },
    storageLimit: {
      type: Number,
      default: 16106127360 // 15GB in bytes for free plan
    },
    portfoliosCreated: {
      type: Number,
      default: 0
    },
    portfolioLimit: {
      type: Number,
      default: 1 // 1 portfolio for free plan
    },
    bandwidthUsed: {
      type: Number,
      default: 0 // in bytes
    },
    bandwidthLimit: {
      type: Number,
      default: 107374182400 // 100GB in bytes
    }
  },
  
  // Feature access
  features: {
    customDomain: {
      type: Boolean,
      default: false
    },
    advancedAnalytics: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    whiteLabel: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    teamCollaboration: {
      type: Boolean,
      default: false
    }
  },
  
  // Payment history
  invoices: [{
    razorpayPaymentId: String,
    razorpayOrderId: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded']
    },
    paidAt: Date
  }],
  
  // Discount/Coupon information
  discount: {
    couponId: String,
    percentOff: Number,
    amountOff: Number,
    currency: String,
    duration: {
      type: String,
      enum: ['once', 'repeating', 'forever']
    },
    durationInMonths: Number,
    validUntil: Date
  },
  
  // Metadata
  metadata: {
    source: String, // How the user subscribed (web, mobile, etc.)
    campaign: String, // Marketing campaign
    referrer: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ razorpayCustomerId: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.currentPeriodEnd) return 0;
  const now = new Date();
  const diffTime = this.currentPeriodEnd - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// Virtual for usage percentages
subscriptionSchema.virtual('storageUsagePercentage').get(function() {
  return Math.round((this.usage.storageUsed / this.usage.storageLimit) * 100);
});

subscriptionSchema.virtual('bandwidthUsagePercentage').get(function() {
  return Math.round((this.usage.bandwidthUsed / this.usage.bandwidthLimit) * 100);
});

// Virtual for is expired
subscriptionSchema.virtual('isExpired').get(function() {
  return this.currentPeriodEnd < new Date();
});

// Virtual for is trial
subscriptionSchema.virtual('isTrial').get(function() {
  const now = new Date();
  return this.trialStart && this.trialEnd && now >= this.trialStart && now <= this.trialEnd;
});

// Method to check if feature is available
subscriptionSchema.methods.hasFeature = function(featureName) {
  if (this.status !== 'active') return false;
  if (this.type === 'free') {
    // Free plan has limited features
    const freeFeatures = ['basicAnalytics'];
    return freeFeatures.includes(featureName);
  }
  return this.features[featureName] === true;
};

// Method to check if storage limit is exceeded
subscriptionSchema.methods.isStorageExceeded = function() {
  return this.usage.storageUsed >= this.usage.storageLimit;
};

// Method to check if portfolio limit is exceeded
subscriptionSchema.methods.isPortfolioLimitExceeded = function() {
  return this.usage.portfoliosCreated >= this.usage.portfolioLimit;
};

// Method to increment storage usage
subscriptionSchema.methods.incrementStorage = function(bytes) {
  this.usage.storageUsed += bytes;
  return this.save();
};

// Method to decrement storage usage
subscriptionSchema.methods.decrementStorage = function(bytes) {
  this.usage.storageUsed = Math.max(0, this.usage.storageUsed - bytes);
  return this.save();
};

// Method to increment bandwidth usage
subscriptionSchema.methods.incrementBandwidth = function(bytes) {
  this.usage.bandwidthUsed += bytes;
  return this.save();
};

// Method to reset monthly usage (called by cron job)
subscriptionSchema.methods.resetMonthlyUsage = function() {
  this.usage.bandwidthUsed = 0;
  return this.save();
};

// Method to upgrade subscription
subscriptionSchema.methods.upgrade = function(newType = 'premium') {
  this.type = newType;
  
  if (newType === 'premium') {
    // Set premium limits and features
    this.usage.storageLimit = 1099511627776; // 1TB
    this.usage.portfolioLimit = -1; // Unlimited
    this.usage.bandwidthLimit = 1099511627776; // 1TB
    
    // Enable premium features
    Object.keys(this.features.toObject()).forEach(feature => {
      this.features[feature] = true;
    });
  }
  
  return this.save();
};

// Method to downgrade subscription
subscriptionSchema.methods.downgrade = function() {
  this.type = 'free';
  
  // Set free limits
  this.usage.storageLimit = 16106127360; // 15GB
  this.usage.portfolioLimit = 1;
  this.usage.bandwidthLimit = 107374182400; // 100GB
  
  // Disable premium features
  Object.keys(this.features.toObject()).forEach(feature => {
    this.features[feature] = false;
  });
  
  return this.save();
};

// Static method to find expiring subscriptions
subscriptionSchema.statics.findExpiring = function(days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return this.find({
    status: 'active',
    type: 'premium',
    currentPeriodEnd: { $lte: cutoffDate },
    cancelAtPeriodEnd: false
  });
};

// Static method to find expired subscriptions
subscriptionSchema.statics.findExpired = function() {
  return this.find({
    status: 'active',
    currentPeriodEnd: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Subscription', subscriptionSchema);