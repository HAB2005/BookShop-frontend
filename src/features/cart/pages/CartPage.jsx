import { useEffect } from 'react';
import { useCartSimple } from '../hooks/useCartSimple';
import { useLayout } from '../../../app/providers';
import cartService from '../services/cartService.js';
import { toast } from 'react-toastify';
import CartItemList from '../components/CartItemList';
import CartSummary from '../components/CartSummary';
import ErrorBoundary from '../../../shared/components/ErrorBoundary';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { updateLayout } = useLayout();
  const {
    cart,
    items,
    loading,
    error,
    isEmpty,
    totalAmount,
    totalItems,
    loadCart
  } = useCartSimple();

  // Handle update quantity
  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      if (!cartItemId || !quantity) {
        toast.error('Thông tin không hợp lệ');
        return { success: false };
      }

      const result = await cartService.updateCartItem(cartItemId, { quantity });
      if (result.success) {
        await loadCart(); // Refresh cart
        toast.success('Cập nhật số lượng thành công');
        return { success: true };
      } else {
        toast.error(result.error || 'Không thể cập nhật số lượng');
        return { success: false };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Có lỗi xảy ra khi cập nhật số lượng');
      return { success: false };
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId) => {
    try {
      if (!cartItemId) {
        toast.error('Thông tin không hợp lệ');
        return;
      }

      const result = await cartService.removeFromCart(cartItemId);
      if (result.success) {
        await loadCart(); // Refresh cart
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        toast.error(result.error || 'Không thể xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    try {
      const result = await cartService.clearCart();
      if (result.success) {
        await loadCart(); // Refresh cart
        toast.success('Đã xóa toàn bộ giỏ hàng');
      } else {
        toast.error(result.error || 'Không thể xóa giỏ hàng');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Có lỗi xảy ra khi xóa giỏ hàng');
    }
  };

  // Update page layout
  useEffect(() => {
    updateLayout({
      title: 'Giỏ hàng',
      breadcrumbs: [
        { label: 'Trang chủ', path: '/' },
        { label: 'Giỏ hàng', path: '/cart' }
      ]
    });
  }, [updateLayout]);

  // Load cart data when component mounts (separate useEffect)
  useEffect(() => {
    loadCart();
  }, []); // Empty dependency array - only run once on mount

  // Handle loading state
  if (loading) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Có lỗi xảy ra</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={loadCart}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Giỏ hàng của bạn</h1>
          {!isEmpty && (
            <p className={styles.subtitle}>
              Bạn có {totalItems} sản phẩm với tổng giá trị {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(totalAmount)}
            </p>
          )}
        </div>

        <div className={styles.content}>
          <ErrorBoundary message="Có lỗi xảy ra khi hiển thị giỏ hàng. Vui lòng thử lại.">
            <div className={styles.cartItems}>
              <CartItemList
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                loading={loading}
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary message="Có lỗi xảy ra khi hiển thị tóm tắt đơn hàng. Vui lòng thử lại.">
            <div className={styles.cartSummary}>
              <CartSummary
                cart={cart}
                onClearCart={handleClearCart}
                loading={loading}
                actionLoading={loading}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default CartPage;