import { useLowStock } from '../hooks/useStock.js';
import StockBadge from './StockBadge.jsx';
import styles from '../styles/stock.module.css';

const LowStockAlert = ({ onProductClick }) => {
    const { lowStockItems, loading, error } = useLowStock();

    if (loading) {
        return (
            <div className={styles.lowStockAlert}>
                <div className={styles.alertHeader}>
                    <h4>⚠️ Low Stock Alert</h4>
                </div>
                <div className="alert-body">
                    <p>Loading low stock items...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.lowStockAlert} ${styles.alertError}`}>
                <div className={styles.alertHeader}>
                    <h4>❌ Error</h4>
                </div>
                <div className="alert-body">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!lowStockItems || lowStockItems.length === 0) {
        return (
            <div className={`${styles.lowStockAlert} ${styles.alertSuccess}`}>
                <div className={styles.alertHeader}>
                    <h4>✅ Stock Status</h4>
                </div>
                <div className="alert-body">
                    <p>All products have sufficient stock!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.lowStockAlert} ${styles.alertWarning}`}>
            <div className={styles.alertHeader}>
                <h4>⚠️ Low Stock Alert ({lowStockItems.length} items)</h4>
            </div>
            <div className="alert-body">
                <div className={styles.lowStockList}>
                    {lowStockItems.map((stock) => (
                        <div
                            key={stock.stockId}
                            className={styles.lowStockItem}
                            onClick={() => onProductClick && onProductClick(stock.productId)}
                        >
                            <div className={styles.itemInfo}>
                                <span className={styles.productName}>
                                    {stock.productName || `Product #${stock.productId}`}
                                </span>
                                <StockBadge stock={stock} size="small" />
                            </div>
                            <div className={styles.itemDetails}>
                                <span className="threshold">
                                    Threshold: {stock.lowStockThreshold}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LowStockAlert;