import { useState, useEffect } from 'react';
import {
  getCurrentUserProfileService,
  updateUserProfileService,
  changePasswordService
} from '../services/profileService';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    setError('');

    try {
      const userData = await getCurrentUserProfileService();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError('');

    try {
      const updatedUser = await updateUserProfileService(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError('');

    try {
      const result = await changePasswordService(passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    loadUser,
    updateUserProfile,
    changePassword
  };
};