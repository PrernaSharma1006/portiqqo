const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
      'architect',
      'illustrator',
      'musician',
      'other'
    ]
  },
  preview: {
    desktop: {
      type: String,
      required: true // URL to desktop preview image
    },
    mobile: {
      type: String,
      required: true // URL to mobile preview image
    },
    tablet: String // URL to tablet preview image
  },
  demoUrl: String, // URL to live demo
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Template Configuration
  config: {
    // Available sections for this template
    sections: {
      hero: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: true },
        customizable: { type: Boolean, default: true }
      },
      about: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      skills: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      experience: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      projects: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      services: {
        enabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      testimonials: {
        enabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      },
      contact: {
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: true },
        customizable: { type: Boolean, default: true }
      },
      blog: {
        enabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        customizable: { type: Boolean, default: true }
      }
    },
    
    // Layout options
    layout: {
      type: {
        type: String,
        enum: ['single-page', 'multi-page', 'portfolio-grid', 'blog-style'],
        default: 'single-page'
      },
      navigation: {
        type: String,
        enum: ['top', 'side', 'hamburger', 'dots'],
        default: 'top'
      },
      scrollBehavior: {
        type: String,
        enum: ['smooth', 'instant', 'parallax'],
        default: 'smooth'
      }
    },
    
    // Color scheme
    colorScheme: {
      primary: { type: String, default: '#3B82F6' },
      secondary: { type: String, default: '#1F2937' },
      accent: { type: String, default: '#F59E0B' },
      background: { type: String, default: '#FFFFFF' },
      text: { type: String, default: '#1F2937' },
      muted: { type: String, default: '#6B7280' }
    },
    
    // Typography
    typography: {
      headingFont: { type: String, default: 'Poppins' },
      bodyFont: { type: String, default: 'Inter' },
      codeFont: { type: String, default: 'Fira Code' },
      fontSizes: {
        xs: { type: String, default: '0.75rem' },
        sm: { type: String, default: '0.875rem' },
        base: { type: String, default: '1rem' },
        lg: { type: String, default: '1.125rem' },
        xl: { type: String, default: '1.25rem' },
        '2xl': { type: String, default: '1.5rem' },
        '3xl': { type: String, default: '1.875rem' },
        '4xl': { type: String, default: '2.25rem' }
      }
    },
    
    // Component styles
    components: {
      buttons: {
        style: {
          type: String,
          enum: ['rounded', 'square', 'pill'],
          default: 'rounded'
        },
        size: {
          type: String,
          enum: ['sm', 'md', 'lg'],
          default: 'md'
        }
      },
      cards: {
        style: {
          type: String,
          enum: ['flat', 'shadow', 'border', 'elevated'],
          default: 'shadow'
        },
        rounded: {
          type: String,
          enum: ['none', 'sm', 'md', 'lg', 'xl'],
          default: 'md'
        }
      },
      animations: {
        enabled: { type: Boolean, default: true },
        duration: { type: String, default: '300ms' },
        easing: { type: String, default: 'ease-in-out' }
      }
    },
    
    // Responsive settings
    responsive: {
      breakpoints: {
        sm: { type: String, default: '640px' },
        md: { type: String, default: '768px' },
        lg: { type: String, default: '1024px' },
        xl: { type: String, default: '1280px' }
      },
      mobileFirst: { type: Boolean, default: true }
    }
  },
  
  // Template Files and Structure
  files: {
    // Main template files
    html: String, // HTML structure
    css: String,  // CSS styles
    js: String,   // JavaScript functionality
    
    // Component files
    components: [{
      name: String,
      type: {
        type: String,
        enum: ['react', 'html', 'vue', 'angular']
      },
      content: String,
      props: [String] // Expected props for the component
    }],
    
    // Assets
    assets: [{
      name: String,
      type: {
        type: String,
        enum: ['image', 'icon', 'font', 'other']
      },
      url: String,
      size: Number
    }]
  },
  
  // Template Requirements
  requirements: {
    minFields: {
      personalInfo: { type: Number, default: 3 },
      skills: { type: Number, default: 1 },
      projects: { type: Number, default: 1 }
    },
    requiredSections: [String], // Array of section names that must be filled
    optionalSections: [String]  // Array of section names that are optional
  },
  
  // Template Tags
  tags: [String],
  
  // Template Metadata
  metadata: {
    author: String,
    version: { type: String, default: '1.0.0' },
    license: { type: String, default: 'MIT' },
    compatibility: [String], // Compatible browser versions
    features: [String],      // List of template features
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }
}, {
  timestamps: true
});

// Indexes
templateSchema.index({ profession: 1 });
templateSchema.index({ isActive: 1 });
templateSchema.index({ isPremium: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ 'rating.average': -1 });
templateSchema.index({ tags: 1 });

// Virtual for popularity score
templateSchema.virtual('popularityScore').get(function() {
  const usageWeight = 0.6;
  const ratingWeight = 0.4;
  
  return (this.usageCount * usageWeight) + (this.rating.average * this.rating.count * ratingWeight);
});

// Method to increment usage count
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Method to update rating
templateSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Static method to get templates by profession
templateSchema.statics.getByProfession = function(profession, includeInactive = false) {
  const query = { profession };
  if (!includeInactive) {
    query.isActive = true;
  }
  return this.find(query).sort({ popularityScore: -1, createdAt: -1 });
};

// Static method to get featured templates
templateSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit);
};

// Static method to search templates
templateSchema.statics.search = function(query, profession = null) {
  const searchQuery = {
    isActive: true,
    $or: [
      { displayName: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  if (profession) {
    searchQuery.profession = profession;
  }
  
  return this.find(searchQuery).sort({ popularityScore: -1 });
};

module.exports = mongoose.model('Template', templateSchema);