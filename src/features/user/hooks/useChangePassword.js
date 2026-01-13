import { useState } from "react";
import { changePasswordService } from "../services/userService";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await changePasswordService(passwordData);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError("");
    setSuccess(false);
  };

  return {
    changePassword,
    loading,
    error,
    success,
    resetState
  };
};