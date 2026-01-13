import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import styles from './CartPage.module.css';

function CartPage() {
  // Set page layout
  usePageLayout({
    title: "Shopping Cart",
    breadcrumbs: ['Products', 'Shopping Cart']
  });

  return (
    <div className={styles.cartPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🛍️</div>
        <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
        <p className={styles.emptyDescription}>
          Add some products to your cart to get started with your shopping experience.
        </p>
        <div className={styles.comingSoon}>
          <span className={styles.badge}>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

export default CartPage;