import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { useOrderDetail } from '../hooks/useOrders.js';
import { usePayment } from '../../payment/hooks/usePayment.js';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../api/order.api.js';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../payment/api/payment.api.js';
import { Button } from '../../../shared/ui/button.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal.jsx';
import PriceDisplay from '../../../shared/components/PriceDisplay.jsx';
import styles from './OrderDetailPage.module.css';

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [payment, setPayment] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentLoaded, setPaymentLoaded] = useState(false); // Track if we've attempted to load payment

  const {
    order,
    loading,
    error,
    cancelOrder,
    canCancelOrder,
    refreshOrder
  } = useOrderDetail(parseInt(orderId));

  const { getPaymentByOrder } = usePayment();

  // Set page layout
  usePageLayout({
    title: `Order #${orderId}`,
    breadcrumbs: ['Orders', `Order #${orderId}`]
  });

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await cancelOrder();
      setShowCancelModal(false);
      refreshOrder();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setCancelling(false);
    }
  };

  // Auto-load payment info when order is loaded
  useEffect(() => {
    if (order?.orderId && !paymentLoaded && !loadingPayment) {
      handleLoadPayment();
    }
  }, [order?.orderId, paymentLoaded, loadingPayment]);

  const handleLoadPayment = async () => {
    if (!order?.orderId || paymentLoaded) return;
    
    try {
      setLoadingPayment(true);
      const paymentData = await getPaymentByOrder(order.orderId);
      
      if (paymentData) {
        setPayment(paymentData);
      } else {
        // No payment found for this order
        setPayment(null);
      }
    } catch (error) {
      // Error is handled by the hook
      setPayment(null);
    } finally {
      setLoadingPayment(false);
      setPaymentLoaded(true); // Mark as loaded regardless of success/failure
    }
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || '#6b7280';
  };

  const getPaymentStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.errorContainer}>
        <h2>Order Not Found</h2>
        <p>{error || 'The requested order could not be found.'}</p>
        <Button onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load order details.">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Order #{order.orderId}</h1>
            <p className={styles.orderDate}>
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>
          <div 
            className={styles.orderStatus}
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Order Items */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Items</h2>
              <div className={styles.itemsList}>
                {order.details?.map((item) => (
                  <div key={item.orderDetailId} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>
                        {item.productName || `Product ID: ${item.productId}`}
                      </h3>
                      <div className={styles.itemDetails}>
                        <span className={styles.quantity}>
                          Quantity: {item.quantity}
                        </span>
                        <span className={styles.unitPrice}>
                          Unit Price: <PriceDisplay price={item.unitPrice} />
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemSubtotal}>
                      <PriceDisplay price={item.subtotal} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment Information</h2>
              
              {loadingPayment ? (
                <div className={styles.loadingPayment}>
                  <LoadingSpinner />
                  <p>Loading payment information...</p>
                </div>
              ) : payment ? (
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentRow}>
                    <span>Payment ID:</span>
                    <span>#{payment.paymentId}</span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Method:</span>
                    <span>{PAYMENT_METHOD_LABELS[payment.method]}</span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Status:</span>
                    <span 
                      className={styles.paymentStatus}
                      style={{ backgroundColor: getPaymentStatusColor(payment.status) }}
                    >
                      {PAYMENT_STATUS_LABELS[payment.status]}
                    </span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Amount:</span>
                    <span><PriceDisplay price={payment.amount} /></span>
                  </div>
                  {payment.transactionRef && (
                    <div className={styles.paymentRow}>
                      <span>Transaction Ref:</span>
                      <span>{payment.transactionRef}</span>
                    </div>
                  )}
                  <div className={styles.paymentRow}>
                    <span>Created:</span>
                    <span>{formatDate(payment.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <p className={styles.noPayment}>
                  No payment record found for this order.
                </p>
              )}
            </div>
          </div>

          <div className={styles.sidebar}>
            {/* Order Summary */}
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Total Amount:</span>
                <PriceDisplay 
                  price={order.totalAmount} 
                  className={styles.totalAmount}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionsCard}>
              <h3 className={styles.actionsTitle}>Actions</h3>
              <div className={styles.actionButtons}>
                <Button
                  variant="outline"
                  onClick={() => navigate('/orders')}
                  fullWidth
                >
                  Back to Orders
                </Button>
                
                {canCancelOrder(order.status) && (
                  <Button
                    variant="danger"
                    onClick={() => setShowCancelModal(true)}
                    fullWidth
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
          title="Cancel Order"
          message={`Are you sure you want to cancel order #${order.orderId}? This action cannot be undone.`}
          confirmText="Cancel Order"
          confirmVariant="danger"
          loading={cancelling}
        />
      </div>
    </ErrorBoundary>
  );
}

export default OrderDetailPage;