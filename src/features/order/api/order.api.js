import client from '../../../api/client.js';
import { ORDER } from '../../../api/endpoints.js';

// ==================== ORDER OPERATIONS ====================

/**
 * Create new order
 */
export const createOrderApi = async (orderData) => {
  const response = await client.post(ORDER.CREATE, orderData);
  return response;
};

/**
 * Get user's orders with pagination and optional status filter
 */
export const getUserOrdersApi = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    status
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (status) {
    queryParams.append('status', status);
  }

  const response = await client.get(`${ORDER.LIST}?${queryParams}`);
  return response;
};

/**
 * Get specific order by ID
 */
export const getOrderDetailApi = async (orderId) => {
  const response = await client.get(ORDER.DETAIL(orderId));
  return response;
};

/**
 * Cancel order
 */
export const cancelOrderApi = async (orderId) => {
  const response = await client.put(ORDER.CANCEL(orderId));
  return response;
};

/**
 * Checkout cart - create order from cart items
 */
export const checkoutCartApi = async () => {
  const response = await client.post(ORDER.CHECKOUT);
  return response;
};

/**
 * Checkout cart with specific payment method
 */
export const checkoutWithPaymentApi = async (paymentData) => {
  const response = await client.post(ORDER.CHECKOUT_WITH_PAYMENT, paymentData);
  return response;
};

// ==================== ADMIN ORDER OPERATIONS ====================

/**
 * Get all orders with filters and pagination (Admin)
 */
export const getAllOrdersApi = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    status,
    userId,
    startDate,
    endDate
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (status) queryParams.append('status', status);
  if (userId) queryParams.append('userId', userId.toString());
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await client.get(`${ORDER.ADMIN.LIST}?${queryParams}`);
  return response;
};

/**
 * Get specific order by ID (Admin)
 */
export const getOrderByIdApi = async (orderId) => {
  const response = await client.get(ORDER.ADMIN.DETAIL(orderId));
  return response;
};

/**
 * Update order status (Admin)
 */
export const updateOrderStatusApi = async (orderId, statusData) => {
  const response = await client.put(ORDER.ADMIN.UPDATE_STATUS(orderId), statusData);
  return response;
};

/**
 * Get order statistics (Admin)
 */
export const getOrderStatisticsApi = async () => {
  const response = await client.get(ORDER.ADMIN.STATISTICS);
  return response;
};

// ==================== CONSTANTS ====================

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#fbbf24', // yellow
  [ORDER_STATUS.PROCESSING]: '#3b82f6', // blue
  [ORDER_STATUS.SHIPPED]: '#8b5cf6', // purple
  [ORDER_STATUS.DELIVERED]: '#10b981', // green
  [ORDER_STATUS.CANCELLED]: '#ef4444' // red
};