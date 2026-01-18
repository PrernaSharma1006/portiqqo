import { apiRequest, setAuthToken } from './api'

// Authentication API service
export const authService = {
  // Check if email is available
  checkEmail: async (email) => {
    const response = await apiRequest.post('/auth/check-email', { email })
    return response.data
  },

  // Send OTP for login or registration
  sendOTP: async (email, isRegistration = false, firstName = '', lastName = '') => {
    const response = await apiRequest.post('/auth/send-otp', {
      email,
      isRegistration,
      firstName,
      lastName
    })
    return response.data
  },

  // Verify OTP and complete authentication
  verifyOTP: async (email, otp) => {
    const response = await apiRequest.post('/auth/verify-otp', { email, otp })
    const { data } = response.data
    
    // Set auth token
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return response.data
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await apiRequest.post('/auth/refresh-token', { refreshToken })
    const { data } = response.data
    
    // Update auth token
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return response.data
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      // Always clear local auth data
      setAuthToken(null)
      localStorage.removeItem('refreshToken')
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiRequest.get('/auth/me')
    return response.data
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiRequest.put('/auth/profile', profileData)
    return response.data
  }
}

// User service
export const userService = {
  // Get user statistics (admin only)
  getStats: async () => {
    const response = await apiRequest.get('/users/stats')
    return response.data
  }
}

// Portfolio service
export const portfolioService = {
  // Get user portfolios
  getPortfolios: async () => {
    const response = await apiRequest.get('/portfolios')
    return response.data
  },

  // Create new portfolio
  createPortfolio: async (portfolioData) => {
    const response = await apiRequest.post('/portfolios', portfolioData)
    return response.data
  },

  // Get portfolio by ID
  getPortfolio: async (id) => {
    const response = await apiRequest.get(`/portfolios/${id}`)
    return response.data
  },

  // Update portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await apiRequest.put(`/portfolios/${id}`, portfolioData)
    return response.data
  },

  // Delete portfolio
  deletePortfolio: async (id) => {
    const response = await apiRequest.delete(`/portfolios/${id}`)
    return response.data
  },

  // Publish/unpublish portfolio
  togglePublish: async (id, isPublished) => {
    const response = await apiRequest.patch(`/portfolios/${id}/publish`, { isPublished })
    return response.data
  },

  // Check subdomain availability
  checkSubdomain: async (subdomain) => {
    const response = await apiRequest.post('/portfolios/check-subdomain', { subdomain })
    return response.data
  }
}

// Template service
export const templateService = {
  // Get all templates
  getTemplates: async (profession = null) => {
    const params = profession ? `?profession=${profession}` : ''
    const response = await apiRequest.get(`/templates${params}`)
    return response.data
  },

  // Get template by ID
  getTemplate: async (id) => {
    const response = await apiRequest.get(`/templates/${id}`)
    return response.data
  },

  // Get templates by profession
  getTemplatesByProfession: async (profession) => {
    const response = await apiRequest.get(`/templates/profession/${profession}`)
    return response.data
  },

  // Search templates
  searchTemplates: async (query, profession = null) => {
    const params = new URLSearchParams({ query })
    if (profession) params.append('profession', profession)
    
    const response = await apiRequest.get(`/templates/search?${params}`)
    return response.data
  }
}

// Subscription service
export const subscriptionService = {
  // Get current subscription
  getSubscription: async () => {
    const response = await apiRequest.get('/subscriptions')
    return response.data
  },

  // Upgrade subscription
  upgradeSubscription: async (priceId) => {
    const response = await apiRequest.post('/subscriptions/upgrade', { priceId })
    return response.data
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await apiRequest.post('/subscriptions/cancel')
    return response.data
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodId) => {
    const response = await apiRequest.put('/subscriptions/payment-method', { paymentMethodId })
    return response.data
  },

  // Get billing history
  getBillingHistory: async () => {
    const response = await apiRequest.get('/subscriptions/billing-history')
    return response.data
  }
}

// Upload service
export const uploadService = {
  // Upload image
  uploadImage: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    const response = await apiRequest.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        // You can emit progress events here if needed
        console.log(`Upload Progress: ${percentCompleted}%`)
      }
    })
    
    return response.data
  },

  // Upload video
  uploadVideo: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('folder', folder)

    const response = await apiRequest.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload Progress: ${percentCompleted}%`)
      }
    })
    
    return response.data
  },

  // Upload PDF
  uploadPDF: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('pdf', file)
    formData.append('folder', folder)

    const response = await apiRequest.post('/upload/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload Progress: ${percentCompleted}%`)
      }
    })
    
    return response.data
  },

  // Delete uploaded file
  deleteFile: async (publicId) => {
    const response = await apiRequest.delete('/upload/file', {
      data: { publicId }
    })
    return response.data
  }
}