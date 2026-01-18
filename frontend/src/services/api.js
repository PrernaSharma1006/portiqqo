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
          setAuthToken(null)
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            toast.error('Your session has expired. Please log in again.')
            window.location.href = '/login'
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

export default api