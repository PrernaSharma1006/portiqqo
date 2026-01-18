import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('Authentication error:', error);
        navigate('/auth?error=' + encodeURIComponent(error));
        return;
      }

      if (!token) {
        console.error('No token received');
        navigate('/auth?error=no_token');
        return;
      }

      // Basic token format validation
      if (token.length < 10 || !token.includes('.')) {
        console.error('Invalid token format');
        localStorage.removeItem('authToken');
        navigate('/auth?error=invalid_token');
        return;
      }

      try {
        // Store the token
        localStorage.setItem('authToken', token);

        // Fetch user data
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Validate user data
          if (!userData.data || !userData.data.email) {
            throw new Error('Invalid user data received');
          }
          
          setUser(userData.data);
          setIsAuthenticated(true);

          // Check if there's a redirect path stored
          const redirectPath = localStorage.getItem('redirectAfterAuth');
          if (redirectPath) {
            localStorage.removeItem('redirectAfterAuth');
            // Validate redirect path (prevent open redirect)
            if (redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
              navigate(redirectPath);
            } else {
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Callback error:', error);
        localStorage.removeItem('authToken');
        navigate('/auth?error=authentication_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication</p>
      </motion.div>
    </div>
  );
}
