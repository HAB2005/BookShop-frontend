import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { getAllOrdersApi, getOrderStatisticsApi, ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../api/order.api.js';
import { Button } from '../../../shared/ui/button.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import Pagination from '../../../shared/ui/Pagination.jsx';
import PriceDisplay from '../../../shared/components/PriceDisplay.jsx';
import { useToast } from '../../../shared/hooks/useToast.js';
import styles from './AdminOrderListPage.module.css';

function AdminOrderListPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
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
  
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
    startDate: '',
    endDate: ''
  });

  // Set page layout
  usePageLayout({
    title: "Order Management",
    breadcrumbs: ['Admin', 'Orders']
  });

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...filters, ...params };
      const response = await getAllOrdersApi(mergedParams);
      
      if (response.data?.success) {
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
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getOrderStatisticsApi();
      if (response.data?.success) {
        setStatistics(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    fetchOrders({ ...newFilters, page: 0 });
  };

  const handlePageChange = (newPage) => {
    fetchOrders({ page: newPage });
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load order management page.">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Order Management</h1>
          <p className={styles.subtitle}>
            Manage and track all customer orders
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className={styles.statisticsGrid}>
            <div className={styles.statCard}>
              <h3>Pending Orders</h3>
              <p className={styles.statNumber}>{statistics.pendingCount}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Processing Orders</h3>
              <p className={styles.statNumber}>{statistics.processingCount}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Completed Orders</h3>
              <p className={styles.statNumber}>{statistics.completedCount}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Revenue</h3>
              <p className={styles.statNumber}>
                <PriceDisplay price={statistics.totalRevenue} />
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={value} value={value}>
                    {ORDER_STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>User ID:</label>
              <input
                type="number"
                placeholder="Enter user ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label>Start Date:</label>
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label>End Date:</label>
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => fetchOrders()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Table */}
        <div className={styles.tableContainer}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{order.userId}</td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td>
                    <PriceDisplay price={order.totalAmount} />
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/orders/${order.orderId}`, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <p>No orders found matching the current filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={!pagination.last}
              hasPrevPage={!pagination.first}
            />
          </div>
        )}

        {loading && orders.length > 0 && (
          <div className={styles.loadingOverlay}>
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default AdminOrderListPage;