import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { setAuthToken, getApiUrl } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

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
  const lastActivityRef = useRef(Date.now());

  const logout = useCallback((isAutoLogout = false) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastActivityTime');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);

    if (isAutoLogout) {
      toast('Logged out due to inactivity for your security.', { icon: '🔒', duration: 4000 });
    }
  }, []);

  const updateActivityTimestamp = useCallback(() => {
    const now = Date.now();
    // Throttle localStorage updates to once every 10 seconds
    if (now - lastActivityRef.current > 10000) {
      lastActivityRef.current = now;
      localStorage.setItem('lastActivityTime', now.toString());
    }
  }, []);

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const lastActiveStr = localStorage.getItem('lastActivityTime');

      // Check if user was inactive for longer than timeout before making API request
      if (token && lastActiveStr) {
        const lastActiveTime = parseInt(lastActiveStr, 10);
        if (Date.now() - lastActiveTime > INACTIVITY_TIMEOUT_MS) {
          logout(true);
          setIsLoading(false);
          return;
        }
      }

      if (token) {
        try {
          const response = await fetch(getApiUrl('/api/auth/me'), {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data?.user || data.data);
            setIsAuthenticated(true);
            setAuthToken(token);
            const now = Date.now();
            lastActivityRef.current = now;
            localStorage.setItem('lastActivityTime', now.toString());
          } else {
            logout(false);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          logout(false);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [logout]);

  // Listen for user interactions when logged in to track activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem('lastActivityTime', now.toString());

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      updateActivityTimestamp();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Periodically check if user has been inactive for > 30 mins
    const interval = setInterval(() => {
      const lastActiveStr = localStorage.getItem('lastActivityTime');
      const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : lastActivityRef.current;
      
      if (Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
        logout(true);
      }
    }, 15000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, updateActivityTimestamp, logout]);

  const login = async (email, password = null) => {
    try {
      setIsLoading(true);
      
      // If password is provided, use email/password login
      if (password) {
        const response = await fetch(getApiUrl('/api/auth/login-password'), {
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
        localStorage.setItem('lastActivityTime', Date.now().toString());
        setAuthToken(token);
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.data.user };
      } else {
        // OTP-based login
        const response = await fetch(getApiUrl('/api/auth/login'), {
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
        localStorage.setItem('lastActivityTime', Date.now().toString());
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

  const signup = async ({ email, password, firstName, lastName }) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      const token = data.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('lastActivityTime', Date.now().toString());
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

      const response = await fetch(getApiUrl('/api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data?.user || data.data);
        setIsAuthenticated(true);
        localStorage.setItem('lastActivityTime', Date.now().toString());
        return data.data?.user || data.data;
      } else {
        // Token is invalid
        logout(false);
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      logout(false);
      return null;
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/check-email'), {
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
      const response = await fetch(getApiUrl('/api/auth/profile'), {
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
      localStorage.setItem('lastActivityTime', Date.now().toString());
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
    localStorage.setItem('lastActivityTime', Date.now().toString());
    setAuthToken(token);
    const response = await fetch(getApiUrl('/api/auth/me'), {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    const userData = data.data?.user || data.data;
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/send-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send verification code');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  };

  const verifyOTP = async ({ email, otp, password, firstName, lastName }) => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, password, firstName, lastName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'OTP verification failed');
      }

      const token = data.data?.token || data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('lastActivityTime', Date.now().toString());
        if (data.data?.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        setAuthToken(token);
        setUser(data.data?.user || data.user);
        setIsAuthenticated(true);
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    sendOTP,
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