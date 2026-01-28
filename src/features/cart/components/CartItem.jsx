import { useState } from 'react';
import styles from './CartItem.module.css';

const CartItem = ({
    item,
    onUpdateQuantity,
    onRemove,
    loading = false
}) => {
    // Add safety checks
    if (!item) {
        return null;
    }

    const [quantity, setQuantity] = useState(item.quantity || 1);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;

        setIsUpdating(true);
        setQuantity(newQuantity);

        const result = await onUpdateQuantity(item.cartItemId, newQuantity);

        if (!result || !result.success) {
            // Revert quantity on error
            setQuantity(item.quantity || 1);
        }

        setIsUpdating(false);
    };

    const handleRemove = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            await onRemove(item.cartItemId);
        }
    };

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0 ₫';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className={styles.cartItem}>
            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{item.productName || 'Unknown Product'}</h3>
                <p className={styles.unitPrice}>
                    Đơn giá: {formatPrice(item.unitPrice)}
                </p>
            </div>

            <div className={styles.quantityControls}>
                <button
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isUpdating || loading}
                >
                    -
                </button>

                <input
                    type="number"
                    className={styles.quantityInput}
                    value={quantity}
                    onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        if (newQuantity >= 1 && newQuantity <= 99) {
                            handleQuantityChange(newQuantity);
                        }
                    }}
                    min="1"
                    max="99"
                    disabled={isUpdating || loading}
                />

                <button
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99 || isUpdating || loading}
                >
                    +
                </button>
            </div>

            <div className={styles.subtotal}>
                <p className={styles.subtotalAmount}>
                    {formatPrice(item.subtotal)}
                </p>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.removeBtn}
                    onClick={handleRemove}
                    disabled={loading}
                    title="Xóa khỏi giỏ hàng"
                >
                    🗑️
                </button>
            </div>

            {(isUpdating || loading) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
        </div>
    );
};

export default CartItem;