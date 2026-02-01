const express = require('express');
const router = express.Router();
const {
  savePortfolio,
  publishPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getPublicPortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');
const { auth } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/save', auth, savePortfolio);
router.post('/publish', auth, publishPortfolio);
router.get('/my-portfolios', auth, getMyPortfolios);
router.get('/:id', auth, getPortfolioById);
router.delete('/:id', auth, deletePortfolio);

// Public routes (no authentication required)
router.get('/public/:subdomain', getPublicPortfolio);

module.exports = router;