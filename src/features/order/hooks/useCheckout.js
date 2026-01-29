import { useState } from 'react';
import { checkoutCartApi, checkoutWithPaymentApi } from '../api/order.api.js';
import { processPaymentApi } from '../../payment/api/payment.api.js';
import { useToast } from '../../../shared/hooks/useToast.js';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const checkoutCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutCartApi();

      // Backend returns SuccessResponse with data field
      toast.success(response.data.message || 'Order created successfully');
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to checkout';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkoutWithPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutWithPaymentApi(paymentData);

      // Backend returns SuccessResponse with data field
      const checkoutResult = response.data.data;

      // If payment is required and not COD, show appropriate message
      if (checkoutResult.paymentMethod !== 'COD') {
        toast.success(response.data.message || 'Order created and payment processed successfully');
      } else {
        toast.success(response.data.message || 'Order created successfully');
      }

      return checkoutResult;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to checkout with payment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await processPaymentApi(paymentData);

      // Backend returns SuccessResponse with data field
      toast.success(response.data.message || 'Payment processed successfully');
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to process payment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkoutCart,
    checkoutWithPayment,
    processPayment
  };
};