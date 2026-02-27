import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user || data.data);
            setIsAuthenticated(true);
            setAuthToken(token);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setAuthToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password = null) => {
    try {
      setIsLoading(true);
      
      // If password is provided, use email/password login
      if (password) {
        const response = await fetch('/api/auth/login-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store token and user data
        const token = data.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', data.data.refreshToken || '');
        setAuthToken(token);
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.data.user };
      } else {
        // OTP-based login (existing functionality)
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        const token = data.token;
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const signup = async ({ email, password, firstName, lastName }) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      const token = data.data.token;
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current user info
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setIsAuthenticated(true);
        return data.data;
      } else {
        // Token is invalid
        logout();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      logout();
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  };

  const requestOTP = async (email) => {
    return sendOTP(email); // Alias for backward compatibility
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check email');
      }
      
      return { exists: data.exists };
    } catch (error) {
      console.error('Email check error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    const userData = data.data?.user || data.data;
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    sendOTP,
    requestOTP,
    verifyOTP,
    checkEmailExists,
    updateProfile,
    getCurrentUser,
    loginWithToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;