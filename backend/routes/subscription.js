const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createOrder, verifyPayment, getSubscription } = require('../controllers/subscriptionController');

// @route   GET /api/subscriptions/me
router.get('/me', auth, getSubscription);

// @route   POST /api/subscriptions/create-order
router.post('/create-order', auth, createOrder);

// @route   POST /api/subscriptions/verify-payment
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;