import { useAuth } from '../../../shared/hooks/useAuth';
import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import { useProductsSimple } from '../../../shared/hooks/useProductsSimple.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import styles from './CustomerProductListPage.module.css';

function CustomerProductListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    products,
    loading,
    error,
    pagination,
    changePage,
    refreshProducts,
    isEmpty,
    hasNextPage,
    hasPrevPage
  } = useProductsSimple({
    includeImages: true
  });

  // Set page layout
  usePageLayout({
    title: "Products",
    breadcrumbs: isAdmin ? ['Dashboard', 'Products'] : ['Products']
  });

  const handleProductUpdated = () => {
    // Refresh products list to show updated data
    refreshProducts();
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load products. Please try refreshing the page.">
      <div className={styles.productPage}>
        {/* Error State */}
        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Failed to load products</h3>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={refreshProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No products found</h3>
            <p>There are no products available at the moment.</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onProductUpdated={handleProductUpdated}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!hasPrevPage || loading}
                >
                  Previous
                </button>

                <span className={styles.pageInfo}>
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>

                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!hasNextPage || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading overlay for pagination */}
        {loading && products.length > 0 && (
          <div className={styles.loadingOverlay}>
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default CustomerProductListPage;