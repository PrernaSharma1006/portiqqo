import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Check, Zap, Crown, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { getApiUrl } from '../services/api'

const MONTHLY_AMOUNT = 81
const YEARLY_AMOUNT = 700

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const planParam = searchParams.get('plan')
    return planParam === 'yearly' ? 'yearly' : 'monthly'
  })
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (isAuthenticated || token) fetchSubscription()
  }, [isAuthenticated])

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return
      const res = await fetch(getApiUrl('/api/subscriptions/me'), {
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

  const handleUpgrade = async (planToUpgrade = billingCycle) => {
    const token = localStorage.getItem('authToken')
    if (!isAuthenticated && !token) {
      localStorage.setItem('redirectAfterAuth', `/pricing?plan=${planToUpgrade}`)
      navigate('/auth')
      return
    }

    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Failed to load payment gateway'); setLoading(false); return }

      const token = localStorage.getItem('authToken')
      const res = await fetch(getApiUrl('/api/subscriptions/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: planToUpgrade })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      if (data.isDemo) {
        const verifyRes = await fetch(getApiUrl('/api/subscriptions/verify-payment'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            razorpay_order_id: data.order.id,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'demo_sig',
            plan: planToUpgrade
          })
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          toast.success('🎉 Premium activated! Welcome to Portiqqo Premium.')
          await fetchSubscription()
          setTimeout(() => navigate('/dashboard'), 1500)
        } else {
          toast.error(verifyData.message || 'Payment verification failed.')
        }
        setLoading(false)
        return
      }

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
        theme: { color: '#ec4899' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(getApiUrl('/api/subscriptions/verify-payment'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planToUpgrade
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
    <div className="min-h-screen bg-gradient-to-b from-[#f9f6f0] via-[#fdfbf7] to-[#f9f6f0] dark:from-[#141210] dark:via-stone-900 dark:to-[#141210] text-stone-900 dark:text-stone-100 transition-colors">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg text-stone-500 dark:text-stone-400">Start for free. Upgrade when you need more.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-[#f5ebe0] dark:bg-stone-800 rounded-full p-1 mt-6 border border-[#e6ccb2] dark:border-stone-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
            >
              Yearly <span className="text-pink-600 dark:text-pink-400 font-semibold ml-1">Save 28%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">

          {/* Free Plan */}
          <div className="bg-[#fdfbf7] dark:bg-stone-900 rounded-2xl shadow-md border border-[#e6ccb2] dark:border-stone-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-stone-500 dark:text-stone-400" />
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Free</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">₹0</span>
              <span className="text-stone-400 dark:text-stone-500 ml-1">/ forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-stone-600 dark:text-stone-300 text-sm">
                  <Check className="w-4 h-4 text-pink-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
              className="w-full py-3 rounded-xl border-2 border-[#e6ccb2] dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold hover:border-[#d4a574] dark:hover:border-stone-600 hover:bg-[#f5ebe0] dark:hover:bg-stone-800 transition-all"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-[#1c1917] via-stone-900 to-[#141210] rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden border border-pink-500/20">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 bg-[#f472b6] text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-md shadow-pink-500/20 z-10">
              POPULAR
            </div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Crown className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-bold text-stone-100">Premium</h2>
            </div>
            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold text-stone-100">
                ₹{billingCycle === 'monthly' ? MONTHLY_AMOUNT : YEARLY_AMOUNT}
              </span>
              <span className="text-stone-400 ml-1">
                / {billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
              {billingCycle === 'yearly' && (
                <p className="text-pink-400 text-sm mt-1 font-medium">That's just ₹{Math.round(YEARLY_AMOUNT / 12)}/month</p>
              )}
            </div>
            <ul className="space-y-3 mb-8 relative z-10">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-stone-300 text-sm">
                  <Check className="w-4 h-4 text-pink-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-stone-800/60 border border-pink-500/30 text-stone-100 font-semibold text-center relative z-10">
                ✓ Active until {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN')}
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-extrabold hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 relative z-10"
              >
                {loading ? 'Processing...' : `Upgrade to Premium`}
              </button>
            )}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-stone-400 dark:text-stone-500 text-sm mt-8">
          Secure payments via Razorpay · Cancel anytime · Instant activation
        </p>
      </div>
    </div>
  )
}
