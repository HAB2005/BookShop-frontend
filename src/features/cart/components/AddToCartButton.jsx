import { useState } from 'react';
import { useAddToCart } from '../hooks/useAddToCart';
import styles from './AddToCartButton.module.css';

const AddToCartButton = ({
    productId,
    productName,
    disabled = false,
    className = '',
    showQuantitySelector = true,
    defaultQuantity = 1,
    size = 'medium' // 'small', 'medium', 'large'
}) => {
    const [quantity, setQuantity] = useState(defaultQuantity);
    const { addToCart, loading } = useAddToCart();

    const handleAddToCart = async () => {
        if (!productId) {
            console.error('Product ID is required');
            return;
        }

        await addToCart(productId, quantity);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const buttonClasses = [
        styles.addToCartButton,
        styles[size],
        className,
        disabled && styles.disabled,
        loading && styles.loading
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.addToCartContainer}>
            {showQuantitySelector && (
                <div className={styles.quantitySelector}>
                    <label className={styles.quantityLabel}>Số lượng:</label>
                    <div className={styles.quantityControls}>
                        <button
                            type="button"
                            className={styles.quantityBtn}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1 || loading || disabled}
                        >
                            -
                        </button>

                        <input
                            type="number"
                            className={styles.quantityInput}
                            value={quantity}
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                handleQuantityChange(newQuantity);
                            }}
                            min="1"
                            max="99"
                            disabled={loading || disabled}
                        />

                        <button
                            type="button"
                            className={styles.quantityBtn}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= 99 || loading || disabled}
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            <button
                type="button"
                className={buttonClasses}
                onClick={handleAddToCart}
                disabled={disabled || loading}
                title={productName ? `Thêm ${productName} vào giỏ hàng` : 'Thêm vào giỏ hàng'}
            >
                {loading ? (
                    <>
                        <div className={styles.spinner}></div>
                        <span>Đang thêm...</span>
                    </>
                ) : (
                    <>
                        <span className={styles.icon}>🛒</span>
                        <span>Thêm vào giỏ hàng</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default AddToCartButton;