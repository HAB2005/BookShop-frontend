import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './ProductListPage.module.css';

function ProductListPage() {
  const navigate = useNavigate();
  const { products, loading, error, pagination, fetchProducts } = useProducts();
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
    name: '',
    minPrice: '',
    maxPrice: ''
  });

  // Set page layout
  usePageLayout({
    title: "Product Management",
    breadcrumbs: ['Dashboard', 'Products']
  });

  // Fetch products on mount and when filters change
  useEffect(() => {
    const params = { ...filters };
    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    fetchProducts(params);
  }, [filters]);

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

  const handleUpdateProduct = (productId) => {
    navigate(`/products/update/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: styles.statusActive,
      INACTIVE: styles.statusInactive,
      DELETED: styles.statusDeleted
    };

    return (
      <span className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.productListPage}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productListPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Product Management</h1>
          <p className={styles.subtitle}>
            Manage your product catalog and inventory
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className={styles.addButton}
        >
          <span className={styles.addIcon}>+</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className={styles.filterInput}
              min="0"
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Max Price</label>
            <input
              type="number"
              placeholder="1000000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className={styles.filterInput}
              min="0"
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => {
                const [sortBy, sortDir] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortDir', sortDir);
              }}
              className={styles.filterSelect}
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
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>{error}</p>
          <button
            onClick={() => fetchProducts(filters)}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td className={styles.productName}>{product.name}</td>
                <td className={styles.productPrice}>
                  {formatPrice(product.price)}
                </td>
                <td>{getStatusBadge(product.status)}</td>
                <td className={styles.categories}>
                  {product.categories?.length > 0 ? (
                    <div className={styles.categoryTags}>
                      {product.categories.slice(0, 2).map((category) => (
                        <span key={category.categoryId} className={styles.categoryTag}>
                          {category.name}
                        </span>
                      ))}
                      {product.categories.length > 2 && (
                        <span className={styles.categoryMore}>
                          +{product.categories.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className={styles.noCategories}>No categories</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleUpdateProduct(product.productId)}
                      className={styles.editButton}
                      title="Edit Product"
                    >
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No Products Found</h3>
            <p>No products match your current filters.</p>
            <button
              onClick={handleAddProduct}
              className={styles.addButton}
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.first}
            className={styles.pageButton}
          >
            Previous
          </button>

          <div className={styles.pageInfo}>
            Page {pagination.page + 1} of {pagination.totalPages}
            <span className={styles.totalItems}>
              ({pagination.totalElements} total items)
            </span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.last}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {loading && products.length > 0 && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default ProductListPage;