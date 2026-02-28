import { motion } from 'framer-motion';
import { HelpCircle, Mail, MessageCircle, BookOpen } from 'lucide-react';

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Getting Started",
      description: "Learn the basics of creating your portfolio",
      topics: [
        "How to create an account",
        "Choosing the right template",
        "Customizing your portfolio",
        "Publishing your portfolio"
      ]
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Account & Billing",
      description: "Manage your subscription and payments",
      topics: [
        "Understanding the 7-day free trial",
        "How billing works (₹199/month)",
        "Canceling your subscription",
        "Payment methods accepted"
      ]
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Common Issues",
      description: "Solutions to frequently encountered problems",
      topics: [
        "Can't log in to my account",
        "Portfolio not saving properly",
        "Image upload issues",
        "Changing portfolio template"
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
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of Portiqqo
          </p>
        </motion.div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-purple-600 mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <ul className="space-y-3">
                {category.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span className="text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white"
        >
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to assist you. Reach out anytime!
          </p>
          <a
            href="mailto:portfolio.builder659@gmail.com"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </motion.div>

        {/* FAQ Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            For immediate assistance, email us at{' '}
            <a href="mailto:portfolio.builder659@gmail.com" className="text-purple-600 hover:underline">
              portfolio.builder659@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
