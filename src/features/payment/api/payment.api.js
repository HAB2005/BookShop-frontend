import client from '../../../api/client.js';
import { PAYMENT } from '../../../api/endpoints.js';

// ==================== PAYMENT OPERATIONS ====================

/**
 * Process payment for an order
 */
export const processPaymentApi = async (paymentData) => {
  const response = await client.post(PAYMENT.PROCESS, paymentData);
  return response;
};

/**
 * Get payment information for an order
 */
export const getPaymentByOrderApi = async (orderId) => {
  const response = await client.get(PAYMENT.BY_ORDER(orderId));
  return response;
};

/**
 * Get payment by ID
 */
export const getPaymentDetailApi = async (paymentId) => {
  const response = await client.get(PAYMENT.DETAIL(paymentId));
  return response;
};

/**
 * Cancel payment
 */
export const cancelPaymentApi = async (paymentId) => {
  const response = await client.post(PAYMENT.CANCEL(paymentId));
  return response;
};

// ==================== ADMIN PAYMENT OPERATIONS ====================

/**
 * Get all payments with pagination (Admin)
 */
export const getAllPaymentsApi = async (params = {}) => {
  const {
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDir = 'desc'
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  });

  const response = await client.get(`${PAYMENT.ADMIN.LIST}?${queryParams}`);
  return response;
};

/**
 * Get payments by status (Admin)
 */
export const getPaymentsByStatusApi = async (status) => {
  const response = await client.get(PAYMENT.ADMIN.BY_STATUS(status));
  return response;
};

/**
 * Get payment by ID (Admin)
 */
export const getPaymentByIdApi = async (paymentId) => {
  const response = await client.get(PAYMENT.ADMIN.DETAIL(paymentId));
  return response;
};

/**
 * Get payment by order ID (Admin)
 */
export const getPaymentByOrderIdApi = async (orderId) => {
  const response = await client.get(PAYMENT.ADMIN.BY_ORDER(orderId));
  return response;
};

/**
 * Cancel payment (Admin)
 */
export const cancelPaymentAdminApi = async (paymentId) => {
  const response = await client.post(PAYMENT.ADMIN.CANCEL(paymentId));
  return response;
};

/**
 * Get payment statistics (Admin)
 */
export const getPaymentStatisticsApi = async () => {
  const response = await client.get(PAYMENT.ADMIN.STATISTICS);
  return response;
};

// ==================== CONSTANTS ====================

export const PAYMENT_METHOD = {
  COD: 'COD',
  FAKE: 'FAKE',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  PAYPAL: 'PAYPAL'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.COD]: 'Cash on Delivery',
  [PAYMENT_METHOD.FAKE]: 'Fake Payment (Test)',
  [PAYMENT_METHOD.MOMO]: 'MoMo Wallet',
  [PAYMENT_METHOD.VNPAY]: 'VNPay',
  [PAYMENT_METHOD.PAYPAL]: 'PayPal'
};

export const PAYMENT_STATUS = {
  INIT: 'INIT',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.INIT]: 'Initialized',
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.SUCCESS]: 'Success',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.CANCELLED]: 'Cancelled'
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.INIT]: '#6b7280', // gray
  [PAYMENT_STATUS.PENDING]: '#fbbf24', // yellow
  [PAYMENT_STATUS.SUCCESS]: '#10b981', // green
  [PAYMENT_STATUS.FAILED]: '#ef4444', // red
  [PAYMENT_STATUS.CANCELLED]: '#6b7280' // gray
};