const express = require('express');
const router = express.Router();

// Placeholder for portfolio routes
// This will be implemented when we build the portfolio functionality

// @route   GET /api/portfolios
// @desc    Get user portfolios
// @access  Private
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio routes - to be implemented'
  });
});

module.exports = router;