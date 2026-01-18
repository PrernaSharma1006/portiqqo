import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Information We Collect",
      content: [
        "Email address for account creation and authentication",
        "Portfolio content including text, images, and project details",
        "Payment information processed securely through Stripe",
        "Usage data to improve our services"
      ]
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our portfolio building service",
        "To process your subscription payments (₹81/month after 7-day trial)",
        "To send important updates about your account",
        "To improve our platform based on usage patterns"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Security",
      content: [
        "All data is encrypted in transit using SSL/TLS",
        "Passwords are hashed using industry-standard algorithms",
        "Payment processing is handled securely through Stripe",
        "Regular security audits and updates"
      ]
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request deletion of your account and data",
        "Export your portfolio content",
        "Opt-out of non-essential communications"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-20">
      <div className="container-width section-padding py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy matters to us. Here's how we protect and handle your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-start mb-6">
                <div className="text-purple-600 mr-4">{section.icon}</div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <ul className="space-y-3 ml-12">
                {section.content.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-600 mr-3">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4">Third-Party Services</h3>
          <p className="text-gray-700 mb-4">
            We use trusted third-party services to provide you with the best experience:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Stripe:</strong> For secure payment processing (PCI-DSS compliant)</li>
            <li><strong>Cloudinary:</strong> For image hosting and optimization</li>
            <li><strong>MongoDB Atlas:</strong> For secure database hosting</li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Questions about our privacy policy? Contact us at{' '}
            <a href="mailto:portfolio.builder659@gmail.com" className="text-purple-600 hover:underline">
              portfolio.builder659@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
