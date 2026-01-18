# Pricing Model Documentation

## Overview
The portfolio builder operates on a trial + subscription model to provide users risk-free access while ensuring sustainable revenue.

## Pricing Structure

### Trial Period
- **Duration**: 7 days
- **Access**: Full access to all features
- **Storage**: 15GB included
- **Credit Card**: Not required during trial
- **Features**:
  - 1 Portfolio Website
  - All Professional Templates
  - Custom Subdomain (user.portfoliobuilder.com)
  - Mobile Responsive Design
  - SSL Certificate
  - Basic Analytics
  - Email Support

### After Trial
- **Monthly Subscription**: ₹81/month (INR)
- **Billing**: Automatic monthly renewal via Stripe
- **All Features Continue**: Same as trial period
- **Cancellation**: Users can cancel anytime

## Implementation Details

### Database Schema Updates

#### User Model (`backend/models/User.js`)
```javascript
subscription: {
  type: ['trial', 'active', 'cancelled', 'expired'],
  trialStartDate: Date,
  trialEndDate: Date (7 days from signup),
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
}
```

#### Subscription Model (`backend/models/Subscription.js`)
```javascript
billing: {
  amount: 8100,  // ₹81.00 in paise
  currency: 'INR',
  interval: 'month'
}
```

## User Journey

### Day 0 - Signup
1. User signs up with email OTP
2. Trial automatically starts
3. `trialStartDate` = Current date
4. `trialEndDate` = Current date + 7 days
5. `subscription.type` = 'trial'
6. Full access to all features

### Day 1-6 - Trial Period
- User can create portfolio
- Upload content (up to 15GB)
- Access all templates
- Publish portfolio with custom subdomain
- No payment required

### Day 7 - Trial Ending
- Email notification: "Trial ending soon"
- Prompt to add payment method
- Continue using service until end of day 7

### Day 8 - Trial Expired (Future Implementation)
**Option 1: User Added Payment**
- Automatic charge of ₹81
- `subscription.type` = 'active'
- `currentPeriodStart` = Day 8
- `currentPeriodEnd` = Day 8 + 30 days
- Portfolio remains active

**Option 2: User Did Not Add Payment**
- `subscription.type` = 'expired'
- Portfolio becomes private (not accessible via subdomain)
- User can still login to dashboard
- Prompt to subscribe to reactivate

## Payment Integration (Future)

### Stripe Setup
1. **Currency**: INR (Indian Rupees)
2. **Amount**: 8100 paise (₹81.00)
3. **Interval**: Monthly recurring
4. **Payment Methods**: Cards, UPI, Net Banking, Wallets (via Stripe India)

### Stripe Webhook Events
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changes
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment
- `customer.subscription.deleted` - Cancelled subscription

### Payment Flow
```
1. User clicks "Subscribe" after trial
2. Redirect to Stripe Checkout (INR mode)
3. User completes payment
4. Webhook confirms payment
5. Update user.subscription.type = 'active'
6. Create Stripe customer & subscription IDs
7. Portfolio remains/becomes active
```

## Grace Period (Recommended)
- **3 days** grace period after failed payment
- Send reminder emails on Day 1, 2, 3
- If payment not received by Day 3, mark subscription as 'expired'
- Make portfolio private but don't delete data

## Cancellation Policy
- Users can cancel anytime
- Access continues until end of current billing period
- No refunds for partial months
- Data retained for 30 days after cancellation
- User can reactivate within 30 days without data loss

## Future Enhancements

### Annual Plan
- ₹810/year (equivalent to 10 months)
- Save 2 months
- Same features as monthly

### Storage Upgrades
- Additional 10GB: +₹20/month
- Additional 25GB: +₹40/month
- Additional 50GB: +₹70/month

### Multiple Portfolios
- 1 portfolio: ₹81/month (included)
- 2nd portfolio: +₹30/month
- 3rd portfolio: +₹30/month

## Revenue Calculation

### Conservative Estimates
- 1000 active subscribers × ₹81 = ₹81,000/month
- 2000 active subscribers × ₹81 = ₹1,62,000/month
- 5000 active subscribers × ₹81 = ₹4,05,000/month

### Churn Consideration
- Expected monthly churn: 5-10%
- Trial-to-paid conversion: 10-20% (industry average)
- With 1000 trials: 100-200 paid conversions

## Implementation Checklist

### Phase 1: Trial System (Current)
- [x] Update User model with trial dates
- [x] Update Subscription model with INR pricing
- [x] Update frontend pricing section
- [x] Update documentation

### Phase 2: Trial Logic (Next)
- [ ] Add trial expiry check middleware
- [ ] Create background job to check trial status daily
- [ ] Email notifications (trial ending, trial expired)
- [ ] Dashboard trial status indicator
- [ ] Portfolio access control based on subscription status

### Phase 3: Stripe Integration
- [ ] Setup Stripe account (India)
- [ ] Create Stripe product & pricing (₹81/month INR)
- [ ] Implement Stripe Checkout flow
- [ ] Setup webhook endpoints
- [ ] Test payment flow end-to-end
- [ ] Add payment method management UI
- [ ] Invoice generation & storage

### Phase 4: Polish
- [ ] Subscription management page
- [ ] Payment history
- [ ] Upgrade/downgrade flows
- [ ] Cancellation flow
- [ ] Reactivation flow
- [ ] Email templates for all subscription events

## Notes
- All amounts in paise (smallest currency unit) for Stripe
- INR 1 = 100 paise
- ₹81 = 8100 paise
- Stripe India supports UPI, cards, net banking, and wallets
- Consider implementing RazorPay as alternative for better UPI support
