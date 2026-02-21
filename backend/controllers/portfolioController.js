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

      portfolio = await Portfolio.create({
        ...portfolioDataWithoutId,
        user: userId,
        template: template?._id,
        subdomain,
        isPublished: false
      });
      console.log('Portfolio created:', portfolio._id);
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

    // Generate public URL with subdomain
    const publicUrl = `https://${portfolio.subdomain}.portiqqo.me`;

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

// @desc    Get public portfolio by subdomain
// @route   GET /api/portfolio/public/:subdomain
// @access  Public
exports.getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      subdomain: req.params.subdomain,
      isPublished: true,
      isActive: true
    }).populate('user', 'firstName lastName email');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or not published'
      });
    }

    // Increment view count
    portfolio.views += 1;
    portfolio.lastViewed = new Date();
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
