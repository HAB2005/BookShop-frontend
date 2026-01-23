import { useState, useCallback } from 'react';

export const useErrorBoundary = () => {
  const [error, setError] = useState(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error) => {
    console.error('Error captured by useErrorBoundary:', error);
    setError(error);
  }, []);

  // Throw error to trigger ErrorBoundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

export default useErrorBoundary;