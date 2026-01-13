import { useAuth } from '../../../shared/hooks/useAuth';
import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import styles from './OrdersPage.module.css';

function OrdersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Set page layout
  usePageLayout({
    title: isAdmin ? "Order Management" : "My Orders",
    breadcrumbs: isAdmin ? ['Dashboard', 'Orders'] : ['Products', 'My Orders']
  });

  return (
    <div className={styles.ordersPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2 className={styles.emptyTitle}>
          {isAdmin ? "Order Management" : "My Orders"}
        </h2>
        <p className={styles.emptyDescription}>
          {isAdmin 
            ? "Order management features will be available here soon."
            : "Your order history will appear here once you make your first purchase."
          }
        </p>
        <div className={styles.comingSoon}>
          <span className={styles.badge}>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;