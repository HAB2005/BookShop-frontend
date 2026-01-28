import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import styles from './CartIcon.module.css';

const CartIcon = ({
    showLabel = true,
    size = 'medium',
    className = ''
}) => {
    const navigate = useNavigate();
    const { totalItems, loadCart } = useCart();

    // Load cart data on mount
    useEffect(() => {
        loadCart();
    }, []); // Remove loadCart from dependency array

    const handleClick = () => {
        navigate('/cart');
    };

    const iconClasses = [
        styles.cartIcon,
        styles[size],
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={iconClasses}
            onClick={handleClick}
            title="Xem giỏ hàng"
        >
            <div className={styles.iconContainer}>
                <span className={styles.icon}>🛒</span>
                {totalItems > 0 && (
                    <span className={styles.badge}>
                        {totalItems > 99 ? '99+' : totalItems}
                    </span>
                )}
            </div>

            {showLabel && (
                <span className={styles.label}>
                    Giỏ hàng
                    {totalItems > 0 && (
                        <span className={styles.count}>({totalItems})</span>
                    )}
                </span>
            )}
        </button>
    );
};

export default CartIcon;