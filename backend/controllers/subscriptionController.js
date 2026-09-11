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
    amount: 8100,       // ₹81/month
    currency: 'INR',
    interval: 'month',
    description: 'Portiqqo Premium - Monthly',
    durationDays: 30
  },
  yearly: {
    amount: 70000,      // ₹700/year
    currency: 'INR',
    interval: 'year',
    description: 'Portiqqo Premium - Yearly',
    durationDays: 365
  },
  pdf_export: {
    amount: 3000,       // ₹30/export
    currency: 'INR',
    description: 'Portiqqo Portfolio PDF Export - ₹30',
    durationDays: 0
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
      receipt: `rcpt_${userId.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
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

    if (plan === 'pdf_export') {
      if (subscription) {
        subscription.invoices.push(invoiceEntry);
        await subscription.save();
      }
      return res.status(200).json({
        success: true,
        message: 'PDF export payment verified successfully',
        paymentId: razorpay_payment_id
      });
    }

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
    const userId = req.user._id;
    const subscription = await Subscription.findOne({ user: userId });

    // Compute 7-day trial info based on user creation date
    const createdAt = req.user.createdAt ? new Date(req.user.createdAt) : new Date();
    const trialEnd = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const trialMsLeft = trialEnd.getTime() - now.getTime();
    const trialDaysLeft = Math.max(0, Math.ceil(trialMsLeft / (1000 * 60 * 60 * 24)));
    const isTrialExpired = trialDaysLeft <= 0;

    if (!subscription) {
      return res.status(200).json({
        success: true,
        subscription: {
          type: 'free',
          planId: 'free_trial',
          planName: isTrialExpired ? 'Free Trial Expired' : '7-Day Free Trial',
          status: isTrialExpired ? 'expired' : 'active',
          trialDaysLeft,
          trialEndsAt: trialEnd,
          portfolioLimit: 1
        }
      });
    }

    // Auto-expire if period ended
    if (subscription.type === 'premium' && subscription.currentPeriodEnd < new Date()) {
      subscription.type = 'free';
      subscription.status = 'inactive';
      if (subscription.usage) subscription.usage.portfolioLimit = 1;
      await subscription.save();
    }

    const isYearly = subscription.planId === 'yearly' || subscription.billing?.interval === 'year';
    const planName = subscription.type === 'premium'
      ? (isYearly ? 'Yearly Premium Plan (₹1,499/yr)' : 'Monthly Premium Plan (₹81/mo)')
      : (isTrialExpired ? 'Free Trial Expired' : '7-Day Free Trial');

    res.status(200).json({
      success: true,
      subscription: {
        type: subscription.type,
        planId: subscription.planId || (subscription.type === 'premium' ? (isYearly ? 'yearly' : 'monthly') : 'free_trial'),
        planName,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        trialDaysLeft,
        trialEndsAt: trialEnd,
        portfolioLimit: subscription.usage?.portfolioLimit || (subscription.type === 'premium' ? 999 : 1),
        billingInterval: subscription.billing?.interval || (isYearly ? 'year' : 'month'),
        billingAmount: subscription.billing?.amount || (isYearly ? 149900 : 8100)
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
};
