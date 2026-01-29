import { useState, useEffect } from 'react';
import {
  getPaymentByOrderApi,
  getPaymentDetailApi,
  cancelPaymentApi,
  PAYMENT_STATUS
} from '../api/payment.api.js';
import { useToast } from '../../../shared/hooks/useToast.js';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const getPaymentByOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPaymentByOrderApi(orderId);

      // Backend returns SuccessResponse with data field, no success field
      return response.data.data; // Can be null if no payment found
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment information';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDetail = async (paymentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPaymentDetailApi(paymentId);

      // Backend returns SuccessResponse with data field, no success field
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment details';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelPayment = async (paymentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cancelPaymentApi(paymentId);

      // Backend returns SuccessResponse with data field, no success field
      showToast('Payment cancelled successfully', 'success');
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel payment';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const canCancelPayment = (paymentStatus) => {
    return paymentStatus === PAYMENT_STATUS.PENDING || paymentStatus === PAYMENT_STATUS.INIT;
  };

  return {
    loading,
    error,
    getPaymentByOrder,
    getPaymentDetail,
    cancelPayment,
    canCancelPayment
  };
};

export const usePaymentDetail = (paymentId) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchPaymentDetail = async () => {
    if (!paymentId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getPaymentDetailApi(paymentId);

      // Backend returns SuccessResponse with data field, no success field
      setPayment(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment details';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetail();
  }, [paymentId]);

  return {
    payment,
    loading,
    error,
    refreshPayment: fetchPaymentDetail
  };
};