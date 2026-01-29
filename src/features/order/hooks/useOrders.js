import { useState, useEffect } from 'react';
import {
  getUserOrdersApi,
  getOrderDetailApi,
  cancelOrderApi,
  ORDER_STATUS
} from '../api/order.api.js';
import { useToast } from '../../../shared/hooks/useToast.js';

export const useOrders = (initialParams = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });

  const toast = useToast();

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const mergedParams = { ...initialParams, ...params };
      const response = await getUserOrdersApi(mergedParams);

      // Backend returns SuccessResponse with data field
      const data = response.data.data;
      
      setOrders(data.content || []);
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (newPage) => {
    fetchOrders({ page: newPage });
  };

  const changeStatus = (status) => {
    fetchOrders({ status, page: 0 });
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    changePage,
    changeStatus,
    refreshOrders,
    isEmpty: orders.length === 0,
    hasNextPage: !pagination.last,
    hasPrevPage: !pagination.first
  };
};

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchOrderDetail = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getOrderDetailApi(orderId);

      // Backend returns SuccessResponse with data field
      setOrder(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch order details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const response = await cancelOrderApi(orderId);

      // Backend returns SuccessResponse with data field
      setOrder(response.data.data);
      toast.success(response.data.message || 'Order cancelled successfully');
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel order';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const canCancelOrder = (orderStatus) => {
    return orderStatus === ORDER_STATUS.PENDING;
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  return {
    order,
    loading,
    error,
    cancelOrder,
    canCancelOrder,
    refreshOrder: fetchOrderDetail
  };
};