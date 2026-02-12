import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let authToken = null

export const setAuthToken = (token) => {
  authToken = token
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('authToken', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('authToken')
  }
}

// Initialize token from localStorage
const storedToken = localStorage.getItem('authToken')
if (storedToken) {
  setAuthToken(storedToken)
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      const { status, data } = response

      // Handle different error status codes
      switch (status) {
        case 401:
          // Unauthorized - token invalid or expired
          const currentPath = window.location.pathname
          const isAuthPage = currentPath === '/login' || currentPath === '/register'
          const isDashboard = currentPath.includes('/dashboard') || currentPath.includes('/editor')
          
          // Only redirect if we're on a protected page, not on auth pages
          if (!isAuthPage && isDashboard) {
            setAuthToken(null)
            toast.error('Your session has expired. Please log in again.')
            // Use a slight delay to allow any modals to close
            setTimeout(() => {
              window.location.href = '/login'
            }, 500)
          } else if (!isAuthPage) {
            toast.error('Authentication required. Please log in.')
          }
          break

        case 403:
          // Forbidden
          toast.error(data?.error || 'You do not have permission to perform this action.')
          break

        case 404:
          // Not found
          toast.error(data?.error || 'The requested resource was not found.')
          break

        case 409:
          // Conflict
          toast.error(data?.error || 'A conflict occurred with the current state.')
          break

        case 422:
          // Validation error
          toast.error(data?.error || 'Please check your input and try again.')
          break

        case 429:
          // Too many requests
          toast.error(data?.error || 'Too many requests. Please try again later.')
          break

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error('A server error occurred. Please try again later.')
          break

        default:
          // Other errors
          toast.error(data?.error || 'An unexpected error occurred.')
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      toast.error('Request timed out. Please check your connection and try again.')
    } else if (error.message === 'Network Error') {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other errors
      toast.error('An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

// API methods
export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
}

// Portfolio API methods
export const portfolioAPI = {
  // Save portfolio (create or update)
  save: (portfolioData) => api.post('/portfolios/save', portfolioData),
  
  // Publish portfolio (make it publicly accessible)
  publish: (portfolioId, profession) => api.post('/portfolios/publish', { portfolioId, profession }),
  
  // Get all user's portfolios
  getMyPortfolios: () => api.get('/portfolios/my-portfolios'),
  
  // Get single portfolio by ID
  getById: (id) => api.get(`/portfolios/${id}`),
  
  // Get public portfolio by subdomain
  getPublic: (subdomain) => api.get(`/portfolios/public/${subdomain}`),
  
  // Delete portfolio
  delete: (id) => api.delete(`/portfolios/${id}`)
}

export default api