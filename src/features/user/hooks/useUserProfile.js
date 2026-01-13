import { useState, useEffect } from "react";
import {
  getCurrentUserProfileService,
  getUserProfileByIdService,
  updateUserProfileService
} from "../services/userService";

export const useUserProfile = (userId = null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      let profileData;
      if (userId) {
        profileData = await getUserProfileByIdService(userId);
      } else {
        profileData = await getCurrentUserProfileService();
      }
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError("");

    try {
      const updatedProfile = await updateUserProfileService(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile
  };
};