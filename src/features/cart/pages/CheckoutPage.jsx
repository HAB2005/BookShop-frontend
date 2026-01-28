import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../../../app/providers';
import { useCartSimple } from '../hooks/useCartSimple';
import { toast } from 'react-toastify';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { updateLayout } = useLayout();
  const { cart, loading, loadCart, isEmpty } = useCartSimple();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    updateLayout({
      title: 'Thanh toán',
      breadcrumbs: [
        { label: 'Trang chủ', path: '/' },
        { label: 'Giỏ hàng', path: '/cart' },
        { label: 'Thanh toán', path: '/checkout' }
      ]
    });

    loadCart();
  }, [updateLayout, loadCart]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && isEmpty) {
      toast.info('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      navigate('/cart');
    }
  }, [loading, isEmpty, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // TODO: Implement order creation API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast.success('Đặt hàng thành công!');
      navigate('/orders'); // Navigate to orders page
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!cart || isEmpty) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Thanh toán</h1>

        <div className={styles.checkoutContent}>
          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2 className={styles.sectionTitle}>Tóm tắt đơn hàng</h2>
            
            <div className={styles.orderItems}>
              {cart.items.map((item) => (
                <div key={item.cartItemId} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.productName}</h3>
                    <p className={styles.itemDetails}>
                      {formatPrice(item.unitPrice)} x {item.quantity}
                    </p>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.orderTotals}>
              <div className={styles.totalRow}>
                <span>Tạm tính:</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                <span>Tổng cộng:</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>Phương thức thanh toán</h2>
            
            <div className={styles.paymentMethods}>
              <label className={styles.paymentMethod}>
                <input type="radio" name="payment" value="cod" defaultChecked />
                <span className={styles.methodLabel}>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
                </span>
              </label>
              
              <label className={styles.paymentMethod}>
                <input type="radio" name="payment" value="bank" disabled />
                <span className={styles.methodLabel}>
                  <strong>Chuyển khoản ngân hàng</strong>
                  <small>Sắp có (Coming soon)</small>
                </span>
              </label>
              
              <label className={styles.paymentMethod}>
                <input type="radio" name="payment" value="card" disabled />
                <span className={styles.methodLabel}>
                  <strong>Thẻ tín dụng/ghi nợ</strong>
                  <small>Sắp có (Coming soon)</small>
                </span>
              </label>
            </div>

            <div className={styles.checkoutActions}>
              <button
                className={styles.backBtn}
                onClick={() => navigate('/cart')}
                disabled={isProcessing}
              >
                Quay lại giỏ hàng
              </button>
              
              <button
                className={styles.placeOrderBtn}
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;