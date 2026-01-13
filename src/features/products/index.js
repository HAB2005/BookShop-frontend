// Export all products feature components and pages
export { default as ProductListPage } from './pages/ProductListPage.jsx';
export { default as EditProductListPage } from './pages/EditProductListPage.jsx';
export { default as UpdateProductPage } from './pages/UpdateProductPage.jsx';

// Export hooks
export { useProducts, useProduct } from './hooks/useProducts.js';

// Export API functions
export * from './api/products.api.js';