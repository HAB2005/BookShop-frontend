import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { getGoogleUserInfo, createMockIdToken } from '../services/googleAuth.service.js';
import { logger } from '../../../shared/lib/logger.js';

/**
 * Custom hook for Google authentication
 * Handles the flow from Google access token to backend authentication
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle Google login with access token
   * @param {string} accessToken - Google access token from OAuth
   * @returns {Promise<Object>} Authentication response
   */
  const handleGoogleLogin = async (accessToken) => {
    try {
      setLoading(true);
      setError(null);

      // Send access token directly to backend
      // Backend will handle getting user info from Google
      const authResponse = await googleLogin({ idToken: accessToken });

      // Navigate based on user role after successful login
      if (authResponse && authResponse.role) {
        if (authResponse.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/products'); // or wherever customers should go
        }
      } else {
        // Default navigation if no role specified
        navigate('/dashboard');
      }

      return authResponse;
    } catch (error) {
      // Only log actual errors, not successful operations
      if (error.response?.status !== 200) {
        logger.error('Google authentication failed:', error);
      }
      setError(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google login with proper ID token (recommended approach)
   * @param {string} idToken - Google ID token
   * @returns {Promise<Object>} Authentication response
   */
  const handleGoogleLoginWithIdToken = async (idToken) => {
    try {
      setLoading(true);
      setError(null);

      const authResponse = await googleLogin({ idToken });
      return authResponse;
    } catch (error) {
      console.error('Google ID token authentication failed:', error);
      setError(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    handleGoogleLogin,
    handleGoogleLoginWithIdToken,
    loading,
    error,
    clearError
  };
};