import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../api/order.api.js';
import { useOrderDetail } from '../hooks/useOrders.js';
import { Button } from '../../../shared/ui/button.jsx';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal.jsx';
import PriceDisplay from '../../../shared/components/PriceDisplay.jsx';
import styles from './OrderCard.module.css';

function OrderCard({ order, onOrderUpdated }) {
  const navigate = useNavigate();
  const { cancelOrder, canCancelOrder } = useOrderDetail(order.orderId);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleViewDetails = () => {
    navigate(`/orders/${order.orderId}`);
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await cancelOrder();
      setShowCancelModal(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setCancelling(false);
    }
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

  return (
    <>
      <div className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h3 className={styles.orderId}>Order #{order.orderId}</h3>
            <p className={styles.orderDate}>{formatDate(order.orderDate)}</p>
          </div>
          <div
            className={styles.orderStatus}
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </div>
        </div>

        <div className={styles.orderContent}>
          <div className={styles.orderAmount}>
            <span className={styles.amountLabel}>Total Amount:</span>
            <PriceDisplay
              price={order.totalAmount}
              className={styles.amountValue}
            />
          </div>

          {order.itemCount && (
            <div className={styles.itemCount}>
              {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className={styles.orderActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>

          {canCancelOrder(order.status) && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Order
            </Button>
          )}
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
    </>
  );
}

export default OrderCard;