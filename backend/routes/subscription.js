const express = require('express');
const router = express.Router();

// Placeholder for subscription routes
// This will be implemented when we build the subscription functionality

// @route   GET /api/subscriptions
// @desc    Get user subscription
// @access  Private
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription routes - to be implemented'
  });
});

module.exports = router;