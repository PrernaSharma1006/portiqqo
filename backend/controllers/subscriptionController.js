const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Lazy-initialize so missing keys are caught at call time, not at server start
const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured on the server (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing from .env)');
  }
  return new Razorpay({ key_id, key_secret });
};

// Pricing plans (amount in paise: 1 INR = 100 paise)
const PLANS = {
  monthly: {
    amount: 19900,      // ₹199/month
    currency: 'INR',
    interval: 'month',
    description: 'Portiqqo Premium - Monthly',
    durationDays: 30
  },
  yearly: {
    amount: 149900,     // ₹1499/year
    currency: 'INR',
    interval: 'year',
    description: 'Portiqqo Premium - Yearly',
    durationDays: 365
  }
};

// @desc    Create Razorpay order
// @route   POST /api/subscriptions/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { plan = 'monthly' } = req.body;
    const userId = req.user._id;

    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const selectedPlan = PLANS[plan];

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        plan,
        description: selectedPlan.description
      }
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
        description: selectedPlan.description
      },
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    const msg = error?.error?.description || error?.message || 'Failed to create payment order';
    res.status(500).json({ success: false, message: msg });
  }
};

// @desc    Verify payment and activate subscription
// @route   POST /api/subscriptions/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan = 'monthly' } = req.body;
    const userId = req.user._id;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const selectedPlan = PLANS[plan] || PLANS.monthly;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);

    // Find or create subscription
    let subscription = await Subscription.findOne({ user: userId });

    const invoiceEntry = {
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      status: 'paid',
      paidAt: now
    };

    if (subscription) {
      subscription.type = 'premium';
      subscription.status = 'active';
      subscription.razorpayPaymentId = razorpay_payment_id;
      subscription.planId = plan;
      subscription.currentPeriodStart = now;
      subscription.currentPeriodEnd = periodEnd;
      subscription.cancelAtPeriodEnd = false;
      subscription.usage.portfolioLimit = 999;
      subscription.features.customDomain = true;
      subscription.features.advancedAnalytics = true;
      subscription.features.prioritySupport = true;
      subscription.billing.amount = selectedPlan.amount;
      subscription.billing.interval = selectedPlan.interval;
      subscription.invoices.push(invoiceEntry);
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: userId,
        type: 'premium',
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        planId: plan,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        usage: { portfolioLimit: 999, portfoliosCreated: 0 },
        features: { customDomain: true, advancedAnalytics: true, prioritySupport: true },
        billing: { amount: selectedPlan.amount, currency: selectedPlan.currency, interval: selectedPlan.interval },
        invoices: [invoiceEntry]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified! Premium activated.',
      subscription: {
        type: subscription.type,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        portfolioLimit: subscription.usage.portfolioLimit
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/me
// @access  Private
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        subscription: {
          type: 'free',
          status: 'active',
          portfolioLimit: 1
        }
      });
    }

    // Auto-expire if period ended
    if (subscription.type === 'premium' && subscription.currentPeriodEnd < new Date()) {
      subscription.type = 'free';
      subscription.status = 'inactive';
      subscription.usage.portfolioLimit = 1;
      await subscription.save();
    }

    res.status(200).json({
      success: true,
      subscription: {
        type: subscription.type,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        portfolioLimit: subscription.usage.portfolioLimit,
        daysRemaining: subscription.daysRemaining
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
};
