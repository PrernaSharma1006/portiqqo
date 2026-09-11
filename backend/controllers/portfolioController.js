const dns = require('dns').promises;
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Template = require('../models/Template');
const Subscription = require('../models/Subscription');

// Helper function to check if user has premium subscription
const checkUserPremiumStatus = async (userId) => {
  const subscription = await Subscription.findOne({ 
    user: userId, 
    status: 'active' 
  });
  
  if (!subscription) {
    return { isPremium: false, portfolioLimit: 1 };
  }
  
  return {
    isPremium: subscription.type === 'premium',
    portfolioLimit: subscription.type === 'premium' ? 999 : subscription.usage.portfolioLimit || 1
  };
};

// @desc    Create or update portfolio
// @route   POST /api/portfolio/save
// @access  Private
exports.savePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioData = req.body;

    console.log('Saving portfolio for user:', userId);
    console.log('Portfolio data profession:', portfolioData.profession);

    // Find or create template for this profession
    let template = await Template.findOne({ profession: portfolioData.profession });
    if (!template) {
      console.log('Creating new template for profession:', portfolioData.profession);
      // Create a basic template if doesn't exist
      try {
        template = await Template.create({
          name: portfolioData.profession,
          displayName: portfolioData.profession.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Template for ${portfolioData.profession}`,
          profession: portfolioData.profession,
          preview: {
            desktop: 'https://via.placeholder.com/1200x800',
            mobile: 'https://via.placeholder.com/400x800'
          },
          isActive: true,
          isPremium: false
        });
        console.log('Template created:', template._id);
      } catch (templateError) {
        console.error('Error creating template:', templateError);
        // Continue without template if creation fails
        template = null;
      }
    }

    // Check if portfolio ID is provided for update
    let portfolio = null;
    if (portfolioData.id) {
      portfolio = await Portfolio.findOne({ 
        _id: portfolioData.id,
        user: userId
      });
    }
    
    // If no ID provided, check if user already has a portfolio for this profession
    if (!portfolio) {
      portfolio = await Portfolio.findOne({ 
        user: userId, 
        profession: portfolioData.profession 
      });
    }

    if (portfolio) {
      console.log('Updating existing portfolio:', portfolio._id);
      // Update existing portfolio while preserving isPublished status and subdomain
      const updateData = { 
        ...portfolioData, 
        user: userId, 
        template: template?._id
      };
      
      // Only set isPublished to false if it's explicitly false in the payload
      // Otherwise, preserve the existing value
      if (portfolioData.isPublished !== undefined) {
        updateData.isPublished = portfolioData.isPublished;
      }
      
      // Preserve existing subdomain if not provided in update
      if (!portfolioData.subdomain) {
        updateData.subdomain = portfolio.subdomain;
      }
      
      portfolio = await Portfolio.findByIdAndUpdate(
        portfolio._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      // Check portfolio limit before creating new portfolio
      const existingPortfoliosCount = await Portfolio.countDocuments({ user: userId });
      const { isPremium, portfolioLimit } = await checkUserPremiumStatus(userId);
      
      console.log(`User has ${existingPortfoliosCount} portfolios. Limit: ${portfolioLimit}. Premium: ${isPremium}`);
      
      if (existingPortfoliosCount >= portfolioLimit) {
        return res.status(403).json({
          success: false,
          message: isPremium 
            ? 'You have reached your portfolio limit' 
            : 'Free users can only create one portfolio. Upgrade to Premium to create more portfolios.',
          code: 'PORTFOLIO_LIMIT_REACHED',
          existingPortfoliosCount,
          portfolioLimit,
          isPremium
        });
      }
      
      console.log('Creating new portfolio');
      // Create new portfolio
      // Use custom subdomain from request, or generate from user's name
      const user = await User.findById(userId);
      let subdomain = portfolioData.subdomain;
      
      if (!subdomain) {
        // Generate subdomain from user's name if not provided
        subdomain = `${user.firstName}-${user.lastName}`.toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      } else {
        // Validate and sanitize custom subdomain
        subdomain = subdomain.toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      console.log('Generated/Provided subdomain:', subdomain);
      
      // Ensure subdomain is unique
      subdomain = await Portfolio.findAvailableSubdomain(subdomain);
      console.log('Final subdomain:', subdomain);

      // Remove id field if present (it might be invalid for new creation)
      const { id, _id, ...portfolioDataWithoutId } = portfolioData;
      
      // Clean up any invalid IDs in nested objects (like projects, skills, etc.)
      const cleanedData = JSON.parse(JSON.stringify(portfolioDataWithoutId, (key, value) => {
        // Remove _id and id fields from nested objects
        if (key === '_id' || key === 'id') {
          return undefined;
        }
        return value;
      }));

      portfolio = await Portfolio.create({
        ...cleanedData,
        user: userId,
        template: template?._id,
        subdomain,
        isPublished: false
      });
      console.log('Portfolio created successfully:', portfolio._id);
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio saved successfully',
      portfolio: {
        id: portfolio._id,
        subdomain: portfolio.subdomain,
        isPublished: portfolio.isPublished
      }
    });
  } catch (error) {
    console.error('Save portfolio error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving portfolio',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Publish portfolio (make it publicly accessible)
// @route   POST /api/portfolio/publish
// @access  Private
exports.publishPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const { portfolioId, profession } = req.body;

    // Find portfolio by ID or profession
    let portfolio;
    if (portfolioId) {
      portfolio = await Portfolio.findOne({ _id: portfolioId, user: userId });
    } else if (profession) {
      portfolio = await Portfolio.findOne({ user: userId, profession });
    }

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found. Please save your portfolio first.'
      });
    }

    // Update publish status
    portfolio.isPublished = true;
    await portfolio.save();

    // Generate public URL with path routing or custom domain
    const cleanSubdomain = (portfolio.subdomain || '').replace(/\.portiqqo\.me$/i, '').trim();
    let baseUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'https://portiqqo.vercel.app';
    if (baseUrl.includes('portiqqo.me')) {
      baseUrl = 'https://portiqqo.vercel.app';
    }
    const publicUrl = portfolio.customDomain && portfolio.customDomainVerified
      ? `https://${portfolio.customDomain}`
      : `${baseUrl.replace(/\/$/, '')}/${cleanSubdomain}`;

    res.status(200).json({
      success: true,
      message: 'Portfolio published successfully!',
      portfolio: {
        id: portfolio._id,
        subdomain: portfolio.subdomain,
        isPublished: portfolio.isPublished,
        publicUrl
      }
    });
  } catch (error) {
    console.error('Publish portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error publishing portfolio'
    });
  }
};

// @desc    Get user's portfolios
// @route   GET /api/portfolio/my-portfolios
// @access  Private
exports.getMyPortfolios = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const portfolios = await Portfolio.find({ user: userId })
      .populate('template', 'name profession')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      portfolios
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching portfolios'
    });
  }
};

// @desc    Get single portfolio by ID
// @route   GET /api/portfolio/:id
// @access  Private
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('template', 'name profession');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching portfolio'
    });
  }
};

// @desc    Get public portfolio by subdomain or custom domain
// @route   GET /api/portfolio/public/:subdomain
// @access  Public
exports.getPublicPortfolio = async (req, res) => {
  try {
    const identifier = req.params.subdomain.toLowerCase().trim();
    
    // Find portfolio matching either subdomain OR verified customDomain
    const portfolio = await Portfolio.findOne({ 
      $or: [
        { subdomain: identifier },
        { customDomain: identifier }
      ],
      isPublished: true,
      isActive: true
    }).populate('user', 'firstName lastName email');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or not published'
      });
    }

    // Check if free trial has expired
    const now = new Date();
    if (portfolio.freeTrialEndsAt && portfolio.freeTrialEndsAt < now) {
      const subscription = await Subscription.findOne({
        user: portfolio.user._id,
        status: 'active',
        type: 'premium'
      });
      const hasPremium = subscription && subscription.currentPeriodEnd > now;
      if (!hasPremium) {
        return res.status(403).json({
          success: false,
          code: 'TRIAL_EXPIRED',
          message: "This portfolio's free trial has ended. The owner needs to upgrade to a paid plan to keep it live.",
          trialEndedAt: portfolio.freeTrialEndsAt
        });
      }
    }

    // Helper to parse referrer source
    const rawReferrer = req.headers['referer'] || req.headers['referrer'] || req.query?.ref || '';
    let referrerSource = 'Direct';
    if (rawReferrer) {
      const lower = rawReferrer.toLowerCase();
      if (lower.includes('linkedin')) referrerSource = 'LinkedIn';
      else if (lower.includes('twitter') || lower.includes('t.co') || lower.includes('x.com')) referrerSource = 'Twitter / X';
      else if (lower.includes('github')) referrerSource = 'GitHub';
      else if (lower.includes('instagram')) referrerSource = 'Instagram';
      else if (lower.includes('google')) referrerSource = 'Google Search';
      else if (lower.includes('facebook') || lower.includes('fb.com')) referrerSource = 'Facebook';
      else if (lower.includes('youtube')) referrerSource = 'YouTube';
      else if (lower.includes('reddit')) referrerSource = 'Reddit';
      else if (lower.includes('dribbble') || lower.includes('behance')) referrerSource = 'Design Portals';
      else {
        try {
          const parsed = new URL(rawReferrer);
          referrerSource = parsed.hostname.replace('www.', '');
        } catch (_) {
          referrerSource = 'Other Websites';
        }
      }
    }

    // Helper to parse device type
    const ua = req.headers['user-agent'] || '';
    let deviceType = 'Desktop';
    if (/mobile/i.test(ua)) deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

    // Increment view count & record analytics event
    portfolio.views = (portfolio.views || 0) + 1;
    portfolio.lastViewed = new Date();
    
    if (!portfolio.viewEvents) portfolio.viewEvents = [];
    portfolio.viewEvents.push({
      timestamp: new Date(),
      referrer: referrerSource,
      device: deviceType,
      browser: ua.includes('Chrome') ? 'Chrome' : (ua.includes('Safari') ? 'Safari' : (ua.includes('Firefox') ? 'Firefox' : 'Other'))
    });

    // Keep last 500 events to prevent unbounded document growth
    if (portfolio.viewEvents.length > 500) {
      portfolio.viewEvents = portfolio.viewEvents.slice(-500);
    }

    await portfolio.save();

    res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error('Get public portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching portfolio'
    });
  }
};

// @desc    Get detailed visitor analytics for a portfolio
// @route   GET /api/portfolios/:id/analytics
// @access  Private (Owner only)
exports.getPortfolioAnalytics = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    const events = portfolio.viewEvents || [];
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(now.getTime() - 7 * oneDayMs);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * oneDayMs);

    // Views Today & This Week & This Month
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const viewsToday = events.filter(e => new Date(e.timestamp) >= startOfToday).length;
    const viewsThisWeek = events.filter(e => new Date(e.timestamp) >= sevenDaysAgo).length;
    const viewsThisMonth = events.filter(e => new Date(e.timestamp) >= thirtyDaysAgo).length;

    // Daily breakdown for the past 7 days (ready for chart)
    const dailyViews = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * oneDayMs);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart.getTime() + oneDayMs);
      
      const count = events.filter(e => {
        const t = new Date(e.timestamp);
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dailyViews.push({
        date: dayLabel,
        shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
        views: count
      });
    }

    // Top Referrer breakdown
    const referrerCounts = {};
    events.forEach(e => {
      const ref = e.referrer || 'Direct';
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    const totalEvents = events.length || 1;
    const topReferrers = Object.entries(referrerCounts)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / totalEvents) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Devices breakdown
    const deviceCounts = {};
    events.forEach(e => {
      const dev = e.device || 'Desktop';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });

    const devices = Object.entries(deviceCounts)
      .map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / totalEvents) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      analytics: {
        totalViews: portfolio.views || events.length || 0,
        viewsToday,
        viewsThisWeek: viewsThisWeek || portfolio.views || 0,
        viewsThisMonth: viewsThisMonth || portfolio.views || 0,
        lastViewed: portfolio.lastViewed,
        dailyViews,
        topReferrers: topReferrers.length > 0 ? topReferrers : [{ source: 'Direct', count: portfolio.views || 0, percentage: 100 }],
        devices: devices.length > 0 ? devices : [{ device: 'Desktop', count: portfolio.views || 0, percentage: 100 }]
      }
    });
  } catch (error) {
    console.error('Get portfolio analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching analytics'
    });
  }
};

// @desc    Set or update custom domain for portfolio
// @route   POST /api/portfolio/:id/custom-domain
// @access  Private (Premium only)
exports.setCustomDomain = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;
    let { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain name is required'
      });
    }

    // Check if user has active premium subscription
    const subscription = await Subscription.findOne({
      user: userId,
      status: 'active',
      type: 'premium'
    });

    const isPremium = subscription && subscription.currentPeriodEnd > new Date();
    if (!isPremium) {
      return res.status(403).json({
        success: false,
        code: 'UPGRADE_REQUIRED',
        message: 'Custom domain is a Premium feature. Please upgrade your subscription to connect a custom domain.'
      });
    }

    // Clean domain (remove protocol, trailing slashes, www prefix if full domain)
    domain = domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    // Validate domain format
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain format. Example: yourname.com or portfolio.yourname.com'
      });
    }

    // Reserved domains check
    const reservedDomains = ['portiqqo.me', 'localhost', '127.0.0.1', 'admin', 'api', 'app'];
    if (reservedDomains.some(r => domain === r || domain.endsWith(`.${r}`))) {
      return res.status(400).json({
        success: false,
        message: 'This domain cannot be used as a custom domain'
      });
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ _id: portfolioId, user: userId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Check if domain is already in use by another portfolio
    const existing = await Portfolio.findOne({
      _id: { $ne: portfolioId },
      customDomain: domain
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This domain is already connected to another portfolio'
      });
    }

    portfolio.customDomain = domain;
    portfolio.customDomainVerified = false; // Reset verification until tested
    portfolio.customDomainVerifiedAt = null;
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: 'Custom domain configured successfully. Please configure your DNS settings.',
      customDomain: portfolio.customDomain,
      customDomainVerified: portfolio.customDomainVerified,
      dnsInstructions: {
        type: domain.split('.').length > 2 ? 'CNAME' : 'A',
        host: domain.split('.').length > 2 ? domain.split('.')[0] : '@',
        target: 'cname.portiqqo.me',
        aRecordIp: '143.198.128.45'
      }
    });
  } catch (error) {
    console.error('Set custom domain error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error setting custom domain'
    });
  }
};

// @desc    Verify DNS configuration for custom domain
// @route   POST /api/portfolio/:id/custom-domain/verify
// @access  Private (Premium only)
exports.verifyCustomDomain = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findOne({ _id: portfolioId, user: userId });
    if (!portfolio || !portfolio.customDomain) {
      return res.status(404).json({
        success: false,
        message: 'No custom domain configured for this portfolio'
      });
    }

    const domain = portfolio.customDomain;
    let isVerified = false;
    let verificationDetails = {};

    try {
      // 1. Try CNAME verification
      try {
        const cnames = await dns.resolveCname(domain);
        verificationDetails.cnames = cnames;
        if (cnames.some(c => c.toLowerCase().includes('portiqqo.me'))) {
          isVerified = true;
        }
      } catch (cnameErr) {
        verificationDetails.cnameError = cnameErr.code;
      }

      // 2. Try A record verification if CNAME not resolved
      if (!isVerified) {
        try {
          const aRecords = await dns.resolve4(domain);
          verificationDetails.aRecords = aRecords;
          // In development or if pointing to valid host
          if (aRecords && aRecords.length > 0) {
            isVerified = true;
          }
        } catch (aErr) {
          verificationDetails.aError = aErr.code;
        }
      }
    } catch (dnsErr) {
      console.warn('DNS lookup issue:', dnsErr.message);
    }

    // In local development mode, simulate verification success if requested
    if (process.env.NODE_ENV === 'development') {
      isVerified = true;
    }

    portfolio.customDomainVerified = isVerified;
    if (isVerified) {
      portfolio.customDomainVerifiedAt = new Date();
    }
    await portfolio.save();

    if (isVerified) {
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Domain verified successfully! Your portfolio is now accessible via your custom domain.',
        customDomain: portfolio.customDomain,
        customDomainVerified: true
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'DNS records could not be verified yet. DNS changes can take up to 24-48 hours to propagate.',
        details: verificationDetails,
        dnsInstructions: {
          cname: { host: '@', value: 'cname.portiqqo.me' },
          aRecord: { host: '@', value: '143.198.128.45' }
        }
      });
    }
  } catch (error) {
    console.error('Verify custom domain error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying custom domain'
    });
  }
};

// @desc    Remove custom domain from portfolio
// @route   DELETE /api/portfolio/:id/custom-domain
// @access  Private
exports.removeCustomDomain = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findOne({ _id: portfolioId, user: userId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    portfolio.customDomain = undefined;
    portfolio.customDomainVerified = false;
    portfolio.customDomainVerifiedAt = null;
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: 'Custom domain removed successfully'
    });
  } catch (error) {
    console.error('Remove custom domain error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing custom domain'
    });
  }
};

// @desc    Delete portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting portfolio'
    });
  }
};
