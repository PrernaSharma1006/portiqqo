const express = require('express');
const router = express.Router();
const {
  savePortfolio,
  publishPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getPublicPortfolio,
  getPortfolioAnalytics,
  deletePortfolio,
  setCustomDomain,
  verifyCustomDomain,
  removeCustomDomain
} = require('../controllers/portfolioController');
const { auth } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/save', auth, savePortfolio);
router.post('/publish', auth, publishPortfolio);
router.get('/my-portfolios', auth, getMyPortfolios);
router.get('/:id', auth, getPortfolioById);
router.get('/:id/analytics', auth, getPortfolioAnalytics);
router.delete('/:id', auth, deletePortfolio);

// Custom Domain Management (Premium)
router.post('/:id/custom-domain', auth, setCustomDomain);
router.post('/:id/custom-domain/verify', auth, verifyCustomDomain);
router.delete('/:id/custom-domain', auth, removeCustomDomain);

// Public routes (no authentication required)
router.get('/public/:subdomain', getPublicPortfolio);

module.exports = router;