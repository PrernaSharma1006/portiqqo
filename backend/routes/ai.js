const express = require('express');
const router = express.Router();
const { handleAICommand } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

// POST /ai/command — takes { command, portfolioData } → returns updated portfolioData
router.post('/command', auth, handleAICommand);

module.exports = router;
