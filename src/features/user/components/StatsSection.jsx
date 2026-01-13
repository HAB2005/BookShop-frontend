import { memo, useMemo } from 'react';
import styles from '../pages/UserPage.module.css';

function StatsSection({ users, pagination }) {
  // Memoize expensive calculations
  const statsData = useMemo(() => {
    if (!users || users.length === 0) {
      return {
        total: pagination?.totalElements || 0,
        admins: 0,
        customers: 0,
        active: 0
      };
    }

    return {
      total: pagination?.totalElements || 0,
      admins: users.filter(u => u.role === 'admin').length,
      customers: users.filter(u => u.role === 'customer').length,
      active: users.filter(u => u.status === 'active').length
    };
  }, [users, pagination?.totalElements]);

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>👥</div>
        <div className={styles.statContent}>
          <h3 className={styles.statNumber}>{statsData.total}</h3>
          <p className={styles.statLabel}>Total Users</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>👑</div>
        <div className={styles.statContent}>
          <h3 className={styles.statNumber}>{statsData.admins}</h3>
          <p className={styles.statLabel}>Administrators</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>👤</div>
        <div className={styles.statContent}>
          <h3 className={styles.statNumber}>{statsData.customers}</h3>
          <p className={styles.statLabel}>Customers</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>✅</div>
        <div className={styles.statContent}>
          <h3 className={styles.statNumber}>{statsData.active}</h3>
          <p className={styles.statLabel}>Active Users</p>
        </div>
      </div>
    </div>
  );
}

// Memo with custom comparison
export default memo(StatsSection, (prevProps, nextProps) => {
  // Only re-render if users array or totalElements actually changed
  return (
    prevProps.users === nextProps.users &&
    prevProps.pagination?.totalElements === nextProps.pagination?.totalElements
  );
});