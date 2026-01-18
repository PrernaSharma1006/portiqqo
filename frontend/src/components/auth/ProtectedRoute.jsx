import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
// import { authService } from '../../services/apiService'

function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // TODO: Verify token by trying to get user profile
        // await authService.getProfile()
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        // Clear invalid token
        localStorage.removeItem('authToken')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute