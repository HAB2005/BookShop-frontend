import { useNavigate } from 'react-router-dom';
import styles from './CartSummary.module.css';

const CartSummary = ({
    cart,
    onClearCart,
    loading = false,
    actionLoading = false
}) => {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0 ₫';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleClearCart = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            await onClearCart();
        }
    };

    const handleCheckout = () => {
        // Navigate to checkout page (to be implemented)
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className={styles.emptySummary}>
                <div className={styles.emptyActions}>
                    <button
                        className={styles.continueBtn}
                        onClick={handleContinueShopping}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cartSummary}>
            <div className={styles.header}>
                <h3 className={styles.title}>Tóm tắt đơn hàng</h3>
            </div>

            <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                    <span className={styles.label}>Số lượng sản phẩm:</span>
                    <span className={styles.value}>{cart.totalItems || 0}</span>
                </div>

                <div className={styles.summaryRow}>
                    <span className={styles.label}>Tạm tính:</span>
                    <span className={styles.value}>{formatPrice(cart.totalAmount || 0)}</span>
                </div>

                <div className={styles.summaryRow}>
                    <span className={styles.label}>Phí vận chuyển:</span>
                    <span className={styles.value}>Miễn phí</span>
                </div>

                <div className={styles.divider}></div>

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span className={styles.label}>Tổng cộng:</span>
                    <span className={styles.totalValue}>{formatPrice(cart.totalAmount || 0)}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.checkoutBtn}
                    onClick={handleCheckout}
                    disabled={loading || actionLoading}
                >
                    {actionLoading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>

                <button
                    className={styles.continueBtn}
                    onClick={handleContinueShopping}
                    disabled={loading || actionLoading}
                >
                    Tiếp tục mua sắm
                </button>

                <button
                    className={styles.clearBtn}
                    onClick={handleClearCart}
                    disabled={loading || actionLoading}
                >
                    Xóa toàn bộ giỏ hàng
                </button>
            </div>

            {(loading || actionLoading) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
        </div>
    );
};

export default CartSummary;