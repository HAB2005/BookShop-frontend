import CartItem from './CartItem';
import styles from './CartItemList.module.css';

const CartItemList = ({
    items,
    onUpdateQuantity,
    onRemoveItem,
    loading = false
}) => {
    if (!items || items.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛒</div>
                <h3 className={styles.emptyTitle}>Giỏ hàng trống</h3>
                <p className={styles.emptyMessage}>
                    Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy thêm sản phẩm để tiếp tục mua sắm!
                </p>
            </div>
        );
    }

    return (
        <div className={styles.cartItemList}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Giỏ hàng của bạn ({items.length} sản phẩm)
                </h2>
            </div>

            <div className={styles.itemsContainer}>
                {items.map((item, index) => {
                    // Add safety check for item and cartItemId
                    if (!item || !item.cartItemId) {
                        console.warn('Invalid cart item at index', index, item);
                        return null;
                    }
                    
                    return (
                        <CartItem
                            key={item.cartItemId}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemoveItem}
                            loading={loading}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CartItemList;