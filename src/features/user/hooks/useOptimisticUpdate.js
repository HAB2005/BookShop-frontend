import { useState, useCallback } from 'react';

export const useOptimisticUpdate = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const setError = useCallback((key, hasError) => {
    setErrorStates(prev => ({
      ...prev,
      [key]: hasError
    }));
  }, []);

  const clearError = useCallback((key) => {
    setErrorStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const optimisticUpdate = useCallback(async (
    key,
    optimisticUpdateFn,
    apiCallFn,
    revertFn
  ) => {
    setLoading(key, true);
    setError(key, false);

    // Apply optimistic update
    optimisticUpdateFn();

    try {
      // Make API call
      await apiCallFn();
    } catch (error) {
      // Revert on error
      revertFn();
      setError(key, true);

      // Auto-clear error after 3 seconds
      setTimeout(() => clearError(key), 3000);

      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading, setError, clearError]);

  const isLoading = useCallback((key) => loadingStates[key] || false, [loadingStates]);
  const hasError = useCallback((key) => errorStates[key] || false, [errorStates]);

  return {
    optimisticUpdate,
    isLoading,
    hasError,
    setLoading,
    setError,
    clearError
  };
};