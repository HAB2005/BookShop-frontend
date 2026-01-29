import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { useOrders } from '../hooks/useOrders.js';
import OrderCard from '../components/OrderCard.jsx';
import OrderStatusFilter from '../components/OrderStatusFilter.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import Pagination from '../../../shared/ui/Pagination.jsx';
import styles from './OrderListPage.module.css';

function OrderListPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  const {
    orders,
    loading,
    error,
    pagination,
    changePage,
    changeStatus,
    refreshOrders,
    isEmpty
  } = useOrders();

  // Set page layout
  usePageLayout({
    title: "My Orders",
    breadcrumbs: ['Orders']
  });

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    changeStatus(status);
  };

  const handleOrderUpdated = () => {
    refreshOrders();
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  if (loading && orders.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load orders. Please try refreshing the page.">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>
            Track and manage your orders
          </p>
        </div>

        <OrderStatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={refreshOrders}
            >
              Try Again
            </button>
          </div>
        )}

        {isEmpty && !loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No orders found</h3>
            <p>
              {selectedStatus 
                ? `No orders with status "${selectedStatus}" found.`
                : "You haven't placed any orders yet."
              }
            </p>
            {!selectedStatus && (
              <button 
                className={styles.shopButton}
                onClick={() => window.location.href = '/products'}
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onOrderUpdated={handleOrderUpdated}
                />
              ))}
            </div>

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
          </>
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

export default OrderListPage;