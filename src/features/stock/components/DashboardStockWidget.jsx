import { useLowStock, useStockStatistics } from '../hooks/useStock.js';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/stock.module.css';

const DashboardStockWidget = () => {
    const { lowStockItems, loading: lowStockLoading } = useLowStock();
    const { statistics, loading: statsLoading } = useStockStatistics();
    const navigate = useNavigate();

    if (statsLoading && lowStockLoading) {
        return (
            <div className={styles.dashboardWidget}>
                <div className={styles.widgetHeader}>
                    <h3>📦 Stock Overview</h3>
                </div>
                <div className="widget-body">
                    <p>Loading stock information...</p>
                </div>
            </div>
        );
    }

    const handleViewStock = () => {
        navigate('/stock');
    };

    const handleViewLowStock = () => {
        navigate('/stock?filter=low-stock');
    };

    return (
        <div className={styles.stockWidget}>
            <div className={styles.widgetHeader}>
                <h3>📦 Stock Overview</h3>
                <button 
                    className={styles.widgetActionBtn}
                    onClick={handleViewStock}
                    title="View Stock Management"
                >
                    →
                </button>
            </div>
            
            <div className="widget-body">
                {statistics && (
                    <div className={styles.stockStatsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{statistics.totalStockQuantity}</div>
                            <div className={styles.statLabel}>Total Stock</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{statistics.productsInStock}</div>
                            <div className={styles.statLabel}>Products In Stock</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statValue} ${styles.statWarning}`}>{statistics.lowStockProducts}</div>
                            <div className={styles.statLabel}>Low Stock Items</div>
                        </div>
                    </div>
                )}

                {lowStockItems && lowStockItems.length > 0 && (
                    <div className={styles.lowStockSection}>
                        <div className={styles.sectionHeader}>
                            <h4>⚠️ Low Stock Alert</h4>
                            <button 
                                className={styles.viewAllBtn}
                                onClick={handleViewLowStock}
                            >
                                View All
                            </button>
                        </div>
                        <div className={styles.lowStockItems}>
                            {lowStockItems.slice(0, 3).map((stock) => (
                                <div key={stock.stockId} className={styles.lowStockItemMini}>
                                    <div className={styles.itemName}>
                                        {stock.productName || `Product #${stock.productId}`}
                                    </div>
                                    <div className={styles.itemStock}>
                                        <span className={styles.stockQuantity}>{stock.availableQuantity}</span>
                                        <span className={styles.stockThreshold}>/{stock.lowStockThreshold}</span>
                                    </div>
                                </div>
                            ))}
                            {lowStockItems.length > 3 && (
                                <div className={styles.moreItems}>
                                    +{lowStockItems.length - 3} more items
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(!lowStockItems || lowStockItems.length === 0) && statistics && (
                    <div className={styles.noIssues}>
                        <div className={styles.successIcon}>✅</div>
                        <p>All products have sufficient stock!</p>
                    </div>
                )}
            </div>

            <div className={styles.widgetFooter}>
                <button 
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                    onClick={handleViewStock}
                >
                    Manage Stock
                </button>
            </div>
        </div>
    );
};

export default DashboardStockWidget;