import stockService from '../services/stockService.js';
import styles from '../styles/stock.module.css';

const StockBadge = ({ stock, showQuantity = true, size = 'medium' }) => {
    if (!stock) {
        return (
            <span className={`${styles.stockBadge} ${styles[`stockBadge${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${styles.stockBadgeGray}`}>
                No Stock Info
            </span>
        );
    }

    const status = stockService.formatStockStatus(stock);
    const color = stockService.getStockStatusColor(stock);
    const quantity = stock.availableQuantity || 0;

    return (
        <span className={`${styles.stockBadge} ${styles[`stockBadge${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${styles[`stockBadge${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
            {status}
            {showQuantity && ` (${quantity})`}
        </span>
    );
};

export default StockBadge;