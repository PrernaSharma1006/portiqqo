import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Check, Zap, Crown, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const MONTHLY_AMOUNT = 81
const YEARLY_AMOUNT = 1499

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (isAuthenticated) fetchSubscription()
  }, [isAuthenticated])

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/subscriptions/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setSubscription(data.subscription)
    } catch (_) {}
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterAuth', '/pricing')
      navigate('/auth')
      return
    }

    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Failed to load payment gateway'); setLoading(false); return }

      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/subscriptions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: billingCycle })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Portiqqo',
        description: data.order.description,
        order_id: data.order.id,
        prefill: {
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
          email: user?.email || ''
        },
        theme: { color: '#7c3aed' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/subscriptions/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: billingCycle
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              toast.success('🎉 Premium activated! Welcome to Portiqqo Premium.')
              await fetchSubscription()
              setTimeout(() => navigate('/dashboard'), 1500)
            } else {
              toast.error('Payment verification failed. Contact support.')
            }
          } catch {
            toast.error('Verification error. Contact support.')
          }
          setLoading(false)
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      rzp.open()
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const isPremium = subscription?.type === 'premium' && subscription?.status === 'active'

  const freeFeatures = [
    '1 portfolio',
    'Custom subdomain (name.portiqqo.me)',
    'All template types',
    'Section visibility controls',
    'Basic analytics',
  ]

  const premiumFeatures = [
    'Unlimited portfolios',
    'Custom subdomain',
    'All template types',
    'Section visibility controls',
    'Advanced analytics',
    'Priority support',
    'Custom domain support',
    'Remove Portiqqo branding',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-500">Start for free. Upgrade when you need more.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Yearly <span className="text-green-600 font-semibold ml-1">Billed annually</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-bold text-gray-800">Free</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">₹0</span>
              <span className="text-gray-400 ml-1">/ forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-colors"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-300" />
              <h2 className="text-xl font-bold">Premium</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                ₹{billingCycle === 'monthly' ? MONTHLY_AMOUNT : YEARLY_AMOUNT}
              </span>
              <span className="text-purple-200 ml-1">
                / {billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
              {billingCycle === 'yearly' && (
                <p className="text-purple-200 text-sm mt-1">That's just ₹{Math.round(YEARLY_AMOUNT / 12)}/month</p>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-purple-100 text-sm">
                  <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-white/20 text-white font-semibold text-center">
                ✓ Active until {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN')}
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-purple-700 font-bold hover:bg-purple-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Upgrade to Premium`}
              </button>
            )}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Secure payments via Razorpay · Cancel anytime · Instant activation
        </p>
      </div>
    </div>
  )
}
