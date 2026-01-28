import { useStockStatistics } from '../hooks/useStock.js';
import styles from '../styles/stock.module.css';

const StockStatistics = () => {
    const { statistics, loading, error, loadStatistics } = useStockStatistics();

    if (loading) {
        return (
            <div className={styles.stockStatistics}>
                <div className={styles.statisticsHeader}>
                    <h3>📊 Stock Statistics</h3>
                </div>
                <div className="statistics-body">
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.stockStatistics}>
                <div className={styles.statisticsHeader}>
                    <h3>📊 Stock Statistics</h3>
                    <button
                        className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                        onClick={loadStatistics}
                    >
                        Retry
                    </button>
                </div>
                <div className="statistics-body">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    return (
        <div className={styles.stockStatistics}>
            <div className={styles.statisticsHeader}>
                <h3>📊 Stock Statistics</h3>
                <button
                    className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                    onClick={loadStatistics}
                >
                    Refresh
                </button>
            </div>

            <div className="statistics-body">
                <div className={styles.statisticsGrid}>
                    <div className={`${styles.statCard} ${styles.statCardPrimary}`}>
                        <div className={styles.statIcon}>📦</div>
                        <div className="stat-content">
                            <div className={styles.statValue}>{statistics.totalStockQuantity}</div>
                            <div className={styles.statLabel}>Total Stock Quantity</div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardSuccess}`}>
                        <div className={styles.statIcon}>✅</div>
                        <div className="stat-content">
                            <div className={styles.statValue}>{statistics.productsInStock}</div>
                            <div className={styles.statLabel}>Products In Stock</div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardWarning}`}>
                        <div className={styles.statIcon}>⚠️</div>
                        <div className="stat-content">
                            <div className={styles.statValue}>{statistics.lowStockProducts}</div>
                            <div className={styles.statLabel}>Low Stock Products</div>
                        </div>
                    </div>
                </div>

                <div className={styles.statisticsSummary}>
                    <p>
                        <strong>Stock Health:</strong> {' '}
                        {statistics.lowStockProducts === 0 ? (
                            <span className={styles.statusGood}>Excellent</span>
                        ) : statistics.lowStockProducts <= 5 ? (
                            <span className={styles.statusWarning}>Good</span>
                        ) : (
                            <span className={styles.statusDanger}>Needs Attention</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StockStatistics;