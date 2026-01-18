// Utility function to trigger feedback modal after portfolio save
export const triggerFeedbackModal = () => {
  localStorage.setItem('showFeedbackModal', 'true')
}

// Check if user has already given feedback
export const hasGivenFeedback = () => {
  return localStorage.getItem('userFeedbackGiven') === 'true'
}

// Mark feedback as given
export const markFeedbackGiven = () => {
  localStorage.setItem('userFeedbackGiven', 'true')
}
