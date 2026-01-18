const express = require('express');
const router = express.Router();

// Placeholder for template routes
// This will be implemented when we build the template functionality

// @route   GET /api/templates
// @desc    Get available templates
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Template routes - to be implemented'
  });
});

module.exports = router;