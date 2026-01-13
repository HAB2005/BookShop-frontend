import { useState, useEffect } from 'react';
import {
  emailLoginApi,
  emailRegisterApi,
  googleLoginApi,
  sendPhoneOtpApi,
  verifyPhoneOtpApi,
  setPasswordApi,
  logoutApi
} from '../../features/auth/api/auth.api.js';
import {
  saveAuthData,
  getAuthData,
  clearAuthData,
  isAuthenticated,
  getCurrentUser,
  getErrorMessage,
  isAccountExistsError
} from '../lib/auth.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed authentication state based on user state
  const isAuthenticatedState = user !== null;

  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (response) => {
    saveAuthData(response.data);
    setUser(response.data);
    setError(null);
    return response.data;
  };

  const handleAuthError = (error) => {
    const errorMessage = getErrorMessage(error);
    setError(errorMessage);
    throw error;
  };

  // ==================== EMAIL/PASSWORD AUTHENTICATION ====================
  const emailLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailLoginApi({ email, password });
      return handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const emailRegister = async ({ email, password, fullName }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailRegisterApi({ email, password, fullName });
      return handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const setPassword = async ({ email, password, confirmPassword }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await setPasswordApi({ email, password, confirmPassword });
      return handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== GOOGLE OAUTH AUTHENTICATION ====================
  const googleLogin = async ({ idToken }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await googleLoginApi({ idToken });
      return handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== PHONE OTP AUTHENTICATION ====================
  const sendPhoneOtp = async ({ phone }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sendPhoneOtpApi({ phone });
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async ({ phone, code }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await verifyPhoneOtpApi({ phone, code });
      return handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== COMMON ====================
  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Role checking methods for ProtectedRoute compatibility
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticatedState,

    // Role checking methods
    hasRole,
    hasAnyRole,

    // Multi-auth methods
    emailLogin,
    emailRegister,
    setPassword,
    googleLogin,
    sendPhoneOtp,
    verifyPhoneOtp,

    // Common
    logout,
    clearError,

    // Utilities
    isAccountExistsError: (error) => isAccountExistsError(error),
  };
};