import { useState } from 'react';
import { updateProductStatusApi } from '../api/products.api.js';
import styles from './StatusSelector.module.css';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'green' },
  { value: 'INACTIVE', label: 'Inactive', color: 'orange' },
  { value: 'DELETED', label: 'Deleted', color: 'red' }
];

function StatusSelector({ productId, currentStatus, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    try {
      setUpdating(true);
      await updateProductStatusApi(productId, newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update product status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentStatusOption = () => {
    return STATUS_OPTIONS.find(option => option.value === currentStatus) || STATUS_OPTIONS[0];
  };

  return (
    <div className={styles.statusSelector}>
      <div className={styles.header}>
        <label className={styles.label}>Status</label>
        {updating && <span className={styles.updating}>Updating...</span>}
      </div>
      
      <div className={styles.statusOptions}>
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={updating || option.value === currentStatus}
            className={`${styles.statusButton} ${styles[option.color]} ${
              option.value === currentStatus ? styles.active : ''
            }`}
          >
            <span className={styles.statusDot}></span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusSelector;