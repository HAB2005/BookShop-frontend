import { useState } from "react";
import {
  createUserService,
  getUserDetailAdminService,
  resetUserPasswordService,
  updateUserStatusService
} from "../services/userService";

export const useAdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (userData) => {
    setLoading(true);
    setError("");

    try {
      const newUser = await createUserService(userData);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async (userId) => {
    setLoading(true);
    setError("");

    try {
      const userDetail = await getUserDetailAdminService(userId);
      return userDetail;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (userId, passwordData) => {
    setLoading(true);
    setError("");

    try {
      const result = await resetUserPasswordService(userId, passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    setLoading(true);
    setError("");

    try {
      const result = await updateUserStatusService(userId, status);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    getUserDetail,
    resetUserPassword,
    updateUserStatus,
    loading,
    error
  };
};