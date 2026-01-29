import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../api/order.api.js';
import styles from './OrderStatusFilter.module.css';

function OrderStatusFilter({ selectedStatus, onStatusChange }) {
  const statusOptions = [
    { value: '', label: 'All Orders' },
    ...Object.entries(ORDER_STATUS).map(([key, value]) => ({
      value,
      label: ORDER_STATUS_LABELS[value]
    }))
  ];

  return (
    <div className={styles.filterContainer}>
      <label className={styles.filterLabel}>Filter by Status:</label>
      <select
        className={styles.filterSelect}
        value={selectedStatus || ''}
        onChange={(e) => onStatusChange(e.target.value || null)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OrderStatusFilter;