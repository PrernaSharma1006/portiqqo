const express = require('express');
const router = express.Router();

// Placeholder for upload routes
// This will be implemented when we build the file upload functionality

// @route   POST /api/upload/image
// @desc    Upload image file
// @access  Private
router.post('/image', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload routes - to be implemented'
  });
});

module.exports = router;