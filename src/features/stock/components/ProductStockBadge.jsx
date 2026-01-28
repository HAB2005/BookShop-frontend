import { useEffect } from 'react';
import { useStock } from '../hooks/useStock.js';
import StockBadge from './StockBadge.jsx';
import styles from '../styles/stock.module.css';

const ProductStockBadge = ({ productId, showQuantity = false, size = 'small' }) => {
    const { stocks, getStock, loading } = useStock();

    useEffect(() => {
        if (productId && !stocks[productId]) {
            getStock(productId);
        }
    }, [productId, stocks, getStock]);

    const stock = stocks[productId];

    if (loading && !stock) {
        return (
            <span className={`${styles.stockBadge} ${styles[`stockBadge${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${styles.stockBadgeGray}`}>
                Loading...
            </span>
        );
    }

    return <StockBadge stock={stock} showQuantity={showQuantity} size={size} />;
};

export default ProductStockBadge;