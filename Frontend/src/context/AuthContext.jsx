// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function with logging
  const login = async (email, password) => {
    console.log(`[LOGIN ATTEMPT] Initiating login for email: ${email}`);
    
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/employees/login', // Matches your backend URL
        { email, password },
        { withCredentials: true }
      );

      const userData = {
        employeeId: response.data.data.employeeId,
        roleName: response.data.data.roleName,
        permissions: response.data.data.permissions,
      };

      console.log(`[LOGIN SUCCESS] User logged in:`, {
        employeeId: userData.employeeId,
        roleName: userData.roleName,
        permissions: userData.permissions,
      });

      setUser(userData);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Login failed';
      const statusCode = err.response?.status || 'Unknown';
      
      console.error(`[LOGIN FAILED] Email: ${email}, Error: ${errorMessage}, Status: ${statusCode}`, {
        error: err.message,
        response: err.response?.data,
      });

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Rest of the AuthContext (checkAuth, logout, hasPermission, etc.) remains unchanged
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/me', { withCredentials: true });
      setUser({
        employeeId: response.data.employeeId,
        roleName: response.data.roleName,
        permissions: response.data.permissions,
      });
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      setError('Failed to authenticate');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
    }
  };

  const hasPermission = (requiredPermissions) => {
    if (!user || !user.permissions) return false;
    return requiredPermissions.every((perm) => user.permissions.includes(perm));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};