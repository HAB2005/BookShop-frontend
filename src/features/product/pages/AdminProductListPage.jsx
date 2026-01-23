import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsSimple } from '../../../shared/hooks/useProductsSimple.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import styles from './AdminProductListPage.module.css';

function AdminProductListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
    name: '',
    minPrice: '',
    maxPrice: ''
  });

  const {
    products,
    loading,
    error,
    pagination,
    updateFilters,
    isEmpty,
    hasNextPage,
    hasPrevPage
  } = useProductsSimple({
    includeImages: false // Admin list doesn't need images for performance
  });

  // Set page layout
  usePageLayout({
    title: "Product Management",
    breadcrumbs: ['Dashboard', 'Products']
  });

  // Load products when filters change
  useEffect(() => {
    const params = { ...filters };
    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    updateFilters(params);
  }, [filters, updateFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleUpdateProduct = (productId) => {
    navigate(`/products/update/${productId}`);
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
    <ErrorBoundary message="Failed to load product management. Please try refreshing the page.">
      <div className={styles.adminProductPage}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1>Product Management</h1>
          <button
            className={styles.addButton}
            onClick={() => navigate('/products/add')}
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className={styles.priceInput}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className={styles.priceInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => {
                const [sortBy, sortDir] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortDir', sortDir);
              }}
              className={styles.sortSelect}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Failed to load products</h3>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => updateFilters(filters)}
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
            <p>No products match your current filters.</p>
            <button
              className={styles.addButton}
              onClick={() => navigate('/products/add')}
            >
              Add First Product
            </button>
          </div>
        )}

        {/* Products Table */}
        {products.length > 0 && (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td className={styles.productName}>
                        {product.name}
                        {product.description && (
                          <div className={styles.productDescription}>
                            {product.description.substring(0, 100)}...
                          </div>
                        )}
                      </td>
                      <td className={styles.price}>
                        ${product.price?.toLocaleString()}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[product.status?.toLowerCase()]}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className={styles.date}>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditProduct(product.productId)}
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.updateButton}
                          onClick={() => handleUpdateProduct(product.productId)}
                          title="Update Product"
                        >
                          🔄
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  ({pagination.totalElements} total)
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

        {/* Loading overlay */}
        {loading && products.length > 0 && (
          <div className={styles.loadingOverlay}>
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default AdminProductListPage;