import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import styles from './FavoritesPage.module.css';

function FavoritesPage() {
  // Set page layout
  usePageLayout({
    title: "My Favorites",
    breadcrumbs: ['Products', 'Favorites']
  });

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>❤️</div>
        <h2 className={styles.emptyTitle}>No Favorites Yet</h2>
        <p className={styles.emptyDescription}>
          Start adding products to your favorites to keep track of items you love.
        </p>
        <div className={styles.comingSoon}>
          <span className={styles.badge}>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;