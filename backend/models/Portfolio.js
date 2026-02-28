const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens']
  },
  profession: {
    type: String,
    required: true,
    enum: [
      'developer',
      'ui-ux-designer',
      'graphic-designer',
      'photographer',
      'video-editor',
      'writer',
      'marketer',
      'digital-marketer',
      'architect',
      'illustrator',
      'musician',
      'general',
      'other'
    ]
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: false  // Made optional as we create templates dynamically
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  freeTrialEndsAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from creation
    }
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewed: {
    type: Date
  },
  
  // Personal Information
  personalInfo: {
    firstName: String,
    lastName: String,
    tagline: String,
    bio: String,
    location: String,
    phone: String,
    email: String,
    website: String,
    profileImage: {
      url: String,
      publicId: String,
      size: Number
    }
  },
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    behance: String,
    dribbble: String,
    youtube: String,
    facebook: String,
    tiktok: String,
    custom: [{
      name: String,
      url: String,
      icon: String
    }]
  },
  
  // Skills
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    category: {
      type: String,
      enum: ['technical', 'design', 'soft', 'language', 'other'],
      default: 'technical'
    }
  }],
  
  // Experience
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date, // null means current job
    isCurrent: {
      type: Boolean,
      default: false
    },
    description: String,
    technologies: [String],
    achievements: [String]
  }],
  
  // Education
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrent: {
      type: Boolean,
      default: false
    },
    gpa: String,
    description: String,
    achievements: [String]
  }],
  
  // Projects
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    shortDescription: String,
    technologies: [String],
    category: String,
    images: [{
      url: String,
      publicId: String,
      size: Number,
      alt: String
    }],
    videos: [{
      url: String,
      publicId: String,
      size: Number,
      title: String,
      thumbnail: String
    }],
    links: {
      live: String,
      github: String,
      demo: String,
      case_study: String
    },
    startDate: Date,
    endDate: Date,
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  // Services (for freelancers)
  services: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    price: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      type: {
        type: String,
        enum: ['fixed', 'hourly', 'project'],
        default: 'fixed'
      }
    },
    duration: String,
    features: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Testimonials
  testimonials: [{
    name: {
      type: String,
      required: true
    },
    position: String,
    company: String,
    content: {
      type: String,
      required: true
    },
    avatar: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    date: {
      type: Date,
      default: Date.now
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  
  // Certifications
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    url: String,
    image: {
      url: String,
      publicId: String,
      size: Number
    }
  }],
  
  // Media/Portfolio Items
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'pdf', 'link'],
      required: true
    },
    title: String,
    description: String,
    url: String,
    publicId: String,
    size: Number,
    thumbnail: String,
    category: String,
    tags: [String],
    order: {
      type: Number,
      default: 0
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  
  // Contact Information
  contact: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    availability: {
      status: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
      },
      message: String
    },
    workingHours: {
      timezone: String,
      schedule: {
        monday: { start: String, end: String, available: Boolean },
        tuesday: { start: String, end: String, available: Boolean },
        wednesday: { start: String, end: String, available: Boolean },
        thursday: { start: String, end: String, available: Boolean },
        friday: { start: String, end: String, available: Boolean },
        saturday: { start: String, end: String, available: Boolean },
        sunday: { start: String, end: String, available: Boolean }
      }
    }
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    structured: Boolean
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: String,
    enableTracking: {
      type: Boolean,
      default: false
    }
  },
  
  // Theme/Styling
  theme: {
    colorPrimary: {
      type: String,
      default: '#3B82F6'
    },
    colorSecondary: {
      type: String,
      default: '#1F2937'
    },
    colorAccent: {
      type: String,
      default: '#F59E0B'
    },
    fontPrimary: {
      type: String,
      default: 'Inter'
    },
    fontSecondary: {
      type: String,
      default: 'Poppins'
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  
  // Custom Sections
  customSections: [{
    title: String,
    content: String,
    type: {
      type: String,
      enum: ['text', 'html', 'markdown'],
      default: 'text'
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  // Template-specific data (stores full editor state for each template)
  templateData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
portfolioSchema.index({ user: 1 });
portfolioSchema.index({ subdomain: 1 });
portfolioSchema.index({ profession: 1 });
portfolioSchema.index({ isPublished: 1, isActive: 1 });
portfolioSchema.index({ views: -1 });

// Virtual for full URL
portfolioSchema.virtual('fullUrl').get(function() {
  const baseUrl = process.env.SUBDOMAIN_BASE || 'portfolios.local';
  return `https://${this.subdomain}.${baseUrl}`;
});

// Virtual for storage used calculation
portfolioSchema.virtual('storageUsed').get(function() {
  let total = 0;
  
  // Calculate storage from profile image
  if (this.personalInfo.profileImage?.size) {
    total += this.personalInfo.profileImage.size;
  }
  
  // Calculate storage from project images and videos
  this.projects.forEach(project => {
    project.images?.forEach(img => total += img.size || 0);
    project.videos?.forEach(vid => total += vid.size || 0);
  });
  
  // Calculate storage from media files
  this.media.forEach(item => {
    total += item.size || 0;
  });
  
  // Calculate storage from certification images
  this.certifications.forEach(cert => {
    if (cert.image?.size) total += cert.image.size;
  });
  
  return total;
});

// Method to increment view count
portfolioSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Method to check if portfolio is accessible (published and user has active subscription)
portfolioSchema.methods.isAccessible = async function() {
  if (!this.isPublished || !this.isActive) return false;
  
  await this.populate('user');
  const user = this.user;
  
  // Free users with active account can access
  if (user.subscription.type === 'free' && user.subscription.status === 'active') {
    return true;
  }
  
  // Premium users need active subscription
  if (user.subscription.type === 'premium') {
    return user.subscription.status === 'active';
  }
  
  return false;
};

// Static method to find available subdomain
portfolioSchema.statics.findAvailableSubdomain = async function(baseSubdomain) {
  let subdomain = baseSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  let counter = 0;
  let originalSubdomain = subdomain;
  
  while (await this.findOne({ subdomain })) {
    counter++;
    subdomain = `${originalSubdomain}-${counter}`;
  }
  
  return subdomain;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);