import { useState } from 'react';
import { useStock } from '../hooks/useStock.js';
import styles from '../styles/stock.module.css';

const StockUpdateModal = ({
    isOpen,
    onClose,
    productId,
    productName,
    currentStock,
    mode = 'add' // 'add', 'set', 'create'
}) => {
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(5);

    const { createStock, addStock, setStock, actionLoading } = useStock();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum) || quantityNum < 0) {
            return;
        }

        let result;
        switch (mode) {
            case 'create':
                result = await createStock(productId, quantityNum, lowStockThreshold);
                break;
            case 'add':
                result = await addStock(productId, quantityNum, reason);
                break;
            case 'set':
                result = await setStock(productId, quantityNum, reason);
                break;
            default:
                return;
        }

        if (result.success) {
            onClose();
            setQuantity('');
            setReason('');
            setLowStockThreshold(5);
        }
    };

    const getModalTitle = () => {
        switch (mode) {
            case 'create':
                return 'Create Stock';
            case 'add':
                return 'Add Stock (Restock)';
            case 'set':
                return 'Set Stock Quantity';
            default:
                return 'Update Stock';
        }
    };

    const getSubmitButtonText = () => {
        switch (mode) {
            case 'create':
                return 'Create Stock';
            case 'add':
                return 'Add Stock';
            case 'set':
                return 'Set Stock';
            default:
                return 'Update';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{getModalTitle()}</h3>
                    <button className={styles.modalClose} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.productInfoBox}>
                        <h4>{productName}</h4>
                        {currentStock && (
                            <p>Current Stock: <strong>{currentStock.availableQuantity}</strong> units</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="quantity">
                                {mode === 'add' ? 'Quantity to Add' :
                                    mode === 'set' ? 'New Stock Quantity' :
                                        'Initial Quantity'}
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="0"
                                required
                                placeholder="Enter quantity"
                            />
                        </div>

                        {mode === 'create' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="threshold">Low Stock Threshold</label>
                                <input
                                    type="number"
                                    id="threshold"
                                    value={lowStockThreshold}
                                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                                    min="0"
                                    placeholder="Enter threshold"
                                />
                            </div>
                        )}

                        {mode !== 'create' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="reason">Reason (Optional)</label>
                                <input
                                    type="text"
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Enter reason for stock change"
                                />
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                onClick={onClose}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : getSubmitButtonText()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StockUpdateModal;