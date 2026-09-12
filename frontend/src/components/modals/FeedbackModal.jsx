import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    rating: 0,
    comment: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    if (!formData.profession.trim()) {
      toast.error('Please enter your profession')
      return
    }
    
    if (formData.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (!formData.comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      toast.success('Thank you for your feedback!')
      setFormData({ name: '', profession: '', rating: 0, comment: '' })
      onClose()
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-stone-900 via-pink-950/80 to-stone-900 dark:from-stone-950 dark:via-pink-950/90 dark:to-stone-950 text-white p-6 rounded-t-2xl border-b border-pink-500/20 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold mb-1 tracking-tight flex items-center gap-2 text-stone-100">
                    <Sparkles className="w-5 h-5 text-pink-400 fill-pink-400" />
                    Share Your Experience
                  </h2>
                  <p className="text-stone-300 text-sm font-medium">Help us improve by sharing your feedback</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-stone-300 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium"
                  maxLength={50}
                />
              </div>

              {/* Profession Input */}
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Your Profession *
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g., UI/UX Designer, Web Developer, Photographer"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium"
                  maxLength={50}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Rate Your Experience *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || formData.rating)
                            ? 'text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]'
                            : 'text-stone-300 dark:text-stone-700 hover:text-pink-300 dark:hover:text-pink-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <p className="text-sm text-pink-600 dark:text-pink-400 font-bold mt-2">
                    {formData.rating === 5 ? '🌟 Excellent!' : 
                     formData.rating === 4 ? '👍 Great!' : 
                     formData.rating === 3 ? '👌 Good!' : 
                     formData.rating === 2 ? '😐 Fair' : 
                     '😕 Needs Improvement'}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell us about your experience with Portiqqo..."
                  rows={4}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium"
                  maxLength={500}
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 font-medium">
                  {formData.comment.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-extrabold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3.5 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-extrabold rounded-xl shadow-lg shadow-pink-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FeedbackModal
