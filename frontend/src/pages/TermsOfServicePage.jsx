import { motion } from 'framer-motion';
import { FileText, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Agreement to Terms",
      content: [
        "By accessing Portiqqo, you agree to be bound by these Terms of Service",
        "You must be at least 18 years old to use our service",
        "You are responsible for maintaining the security of your account",
        "One account per user - sharing accounts is prohibited"
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Subscription & Billing",
      content: [
        "7-day free trial available for new users",
        "After trial: ₹81/month subscription fee",
        "Automatic renewal unless cancelled before trial/billing period ends",
        "Refunds available within 7 days of payment (terms apply)",
        "You can cancel your subscription at any time from your account"
      ]
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "User Content & Ownership",
      content: [
        "You retain all rights to your portfolio content",
        "You grant us license to host and display your content",
        "You are responsible for ensuring your content doesn't violate any laws",
        "We may remove content that violates our policies",
        "Export your content anytime before account deletion"
      ]
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Prohibited Activities",
      content: [
        "Using the service for any illegal purposes",
        "Uploading malicious code or viruses",
        "Attempting to access other users' accounts",
        "Excessive use that impacts service performance",
        "Reselling or distributing our service without permission"
      ]
    }
  ];

  const additionalTerms = [
    {
      title: "Service Availability",
      points: [
        "We strive for 99.9% uptime but cannot guarantee uninterrupted service",
        "Scheduled maintenance will be announced in advance when possible",
        "We are not liable for any losses due to service interruptions"
      ]
    },
    {
      title: "Modifications to Service",
      points: [
        "We may modify or discontinue features with notice",
        "Pricing changes will be communicated 30 days in advance",
        "Continued use after changes constitutes acceptance"
      ]
    },
    {
      title: "Termination",
      points: [
        "We may terminate accounts for Terms of Service violations",
        "You can delete your account at any time",
        "Upon termination, your data will be deleted within 30 days",
        "No refunds for partial months after cancellation"
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using Portiqqo
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Main Sections */}
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

        {/* Additional Terms */}
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          {additionalTerms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">{term.title}</h3>
              <ul className="space-y-2">
                {term.points.map((point, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-purple-600 mr-3">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4">Limitation of Liability</h3>
          <p className="text-gray-700 mb-4">
            Portiqqo is provided "as is" without warranties of any kind. We are not liable for:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>• Loss of data or content</li>
            <li>• Damages from service interruptions</li>
            <li>• Third-party actions or content</li>
            <li>• Any indirect or consequential damages</li>
          </ul>
          <p className="text-gray-700">
            Our total liability shall not exceed the amount you paid us in the last 12 months.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Questions about our Terms of Service? Contact us at{' '}
            <a href="mailto:portfolio.builder659@gmail.com" className="text-purple-600 hover:underline">
              portfolio.builder659@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
