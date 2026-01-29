import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { getCartApi } from '../api/cart.api.js';
import { useCheckout } from '../../order/hooks/useCheckout.js';
import { PAYMENT_METHOD } from '../../payment/api/payment.api.js';
import PaymentMethodSelector from '../../payment/components/PaymentMethodSelector.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import PriceDisplay from '../../../shared/components/PriceDisplay.jsx';
import { useToast } from '../../../shared/hooks/useToast.js';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHOD.FAKE);
  const [paymentData, setPaymentData] = useState({});

  const {
    checkoutWithPayment,
    loading: checkoutLoading
  } = useCheckout();

  // Set page layout
  usePageLayout({
    title: "Checkout",
    breadcrumbs: ['Cart', 'Checkout']
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCartApi();
      
      // Backend returns SuccessResponse with data field
      const cartData = response.data.data;
      setCart(cartData);

      // Check if cart is empty
      if (!cartData.items || cartData.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load cart';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      const checkoutData = {
        paymentMethod: selectedPaymentMethod,
        ...paymentData
      };

      const result = await checkoutWithPayment(checkoutData);

      if (result) {
        // Navigate to order detail page
        navigate(`/orders/${result.orderId}`);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to Load Checkout</h2>
        <p>{error || 'Failed to load cart information.'}</p>
        <Button onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load checkout page.">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>
            Review your order and complete your purchase
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Order Summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>
              <div className={styles.orderItems}>
                {cart.items?.map((item) => (
                  <div key={item.cartItemId} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>
                        Product ID: {item.productId}
                      </h3>
                      <div className={styles.itemDetails}>
                        <span className={styles.quantity}>
                          Qty: {item.quantity}
                        </span>
                        <span className={styles.unitPrice}>
                          <PriceDisplay price={item.unitPrice} />
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemSubtotal}>
                      <PriceDisplay price={item.subtotal} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderTotal}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total Amount:</span>
                  <PriceDisplay
                    price={calculateTotal()}
                    className={styles.totalAmount}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPaymentDataChange={setPaymentData}
              />
            </div>
          </div>

          <div className={styles.sidebar}>
            {/* Checkout Summary */}
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Total</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Items ({cart.items?.length || 0}):</span>
                  <PriceDisplay price={calculateTotal()} />
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className={styles.summaryDivider}></div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryTotal}>Total:</span>
                  <PriceDisplay
                    price={calculateTotal()}
                    className={styles.summaryTotalAmount}
                  />
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className={styles.actionsCard}>
              <Button
                onClick={handleCheckout}
                loading={checkoutLoading}
                disabled={!selectedPaymentMethod}
                size="lg"
                className={styles.checkoutButton}
              >
                {checkoutLoading ? 'Processing...' : 'Complete Order'}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/cart')}
                className={styles.backButton}
              >
                Back to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default CheckoutPage;