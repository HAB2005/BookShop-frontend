import { useAuth } from '../../../shared/hooks/useAuth';
import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import { useProducts } from '../hooks/useProducts.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './ProductListPage.module.css';

function ProductListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const {
    products,
    loading,
    error,
    pagination,
    changePage,
    refreshProducts
  } = useProducts();

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
    <div className={styles.productPage}>
      {/* Error State */}
      {error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => refreshProducts()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!error && (
        <>
          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map(product => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onProductUpdated={handleProductUpdated}
                />
              ))}
            </div>
          ) : !loading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>No Products Available</h3>
              <p>Check back soon for new products</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.first || loading}
              >
                Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(
                    pagination.totalPages - 5,
                    pagination.page - 2
                  )) + i;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageNumber} ${
                        pageNum === pagination.page ? styles.active : ''
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.last || loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductListPage;