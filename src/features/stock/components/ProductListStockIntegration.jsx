import { useEffect } from 'react';
import { useStock } from '../hooks/useStock.js';
import StockBadge from './StockBadge.jsx';
import styles from '../styles/stock.module.css';

/**
 * Component to integrate stock information into product lists
 * Shows stock badge for each product
 */
const ProductListStockIntegration = ({ products = [] }) => {
    const { stocks, getStocks, loading } = useStock();

    useEffect(() => {
        if (products.length > 0) {
            const productIds = products.map(p => p.productId || p.id);
            getStocks(productIds);
        }
    }, [products, getStocks]);

    if (loading && Object.keys(stocks).length === 0) {
        return <span className="stock-loading">Loading stock...</span>;
    }

    return (
        <div className={styles.productStockIntegration}>
            {products.map(product => {
                const productId = product.productId || product.id;
                const stock = stocks[productId];
                
                return (
                    <div key={productId} className={styles.productStockItem}>
                        <div className="product-basic-info">
                            <h4>{product.name}</h4>
                            <p className="product-price">${product.price}</p>
                        </div>
                        <div className={styles.productStockInfo}>
                            <StockBadge stock={stock} showQuantity={true} size="small" />
                            {stock && (
                                <div className="stock-details">
                                    <small>Threshold: {stock.lowStockThreshold}</small>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductListStockIntegration;