import { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../../features/product/services/productService.js';
import { useToastContext } from '../../app/providers.jsx';

const DEFAULT_FILTERS = {
  page: 0,
  size: 12,
  sortBy: 'createdAt',
  sortDir: 'desc',
  name: '',
  minPrice: '',
  maxPrice: '',
  categoryIds: []
};

export const useProductsSimple = (options = {}) => {
  const { includeImages = true } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });
  
  const toast = useToastContext();

  // Batch load images for multiple products to fix N+1 query issue
  const loadProductImages = useCallback(async (productList) => {
    if (!includeImages || !productList.length) {
      return productList;
    }

    try {
      // Start all image requests concurrently
      const imagePromises = productList.map(product => 
        productService.getProductImages(product.productId)
          .then(result => ({
            productId: product.productId,
            images: result.success ? result.data : []
          }))
          .catch(error => {
            console.warn(`Failed to fetch images for product ${product.productId}:`, error);
            return { productId: product.productId, images: [] };
          })
      );

      // Wait for all image requests to complete
      const imageResults = await Promise.all(imagePromises);
      
      // Create a map for quick lookup
      const imageMap = new Map();
      imageResults.forEach(result => {
        // Sort images using utility function
        const sortedImages = productService.sortImagesByPrimary(result.images);
        imageMap.set(result.productId, sortedImages);
      });

      // Add images to products
      return productList.map(product => ({
        ...product,
        images: imageMap.get(product.productId) || []
      }));
    } catch (error) {
      console.error('Error in batch image loading:', error);
      // Return products without images rather than failing completely
      return productList.map(product => ({ ...product, images: [] }));
    }
  }, [includeImages]);

  // Load products
  const loadProducts = useCallback(async (customFilters) => {
    const filtersToUse = customFilters || filters;
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getProducts(filtersToUse);
      
      if (result.success) {
        // Batch load images for all products
        const productsWithImages = await loadProductImages(result.data);
        
        setProducts(productsWithImages);
        setPagination(result.pagination);
      } else {
        const errorMessage = result.error || 'Failed to load products';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, toast, loadProductImages]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 0 // Reset to first page when filters change
    };
    setFilters(updatedFilters);
    // Load products with new filters
    loadProducts(updatedFilters);
  }, [filters, loadProducts]);

  // Change page
  const changePage = useCallback((newPage) => {
    const updatedFilters = {
      ...filters,
      page: newPage
    };
    setFilters(updatedFilters);
    loadProducts(updatedFilters);
  }, [filters, loadProducts]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadProducts(DEFAULT_FILTERS);
  }, [loadProducts]);

  // Search products
  const searchProducts = useCallback((searchTerm) => {
    updateFilters({ name: searchTerm });
  }, [updateFilters]);

  // Filter by category
  const filterByCategory = useCallback((categoryIds) => {
    updateFilters({ categoryIds });
  }, [updateFilters]);

  // Filter by price range
  const filterByPriceRange = useCallback((minPrice, maxPrice) => {
    updateFilters({ minPrice, maxPrice });
  }, [updateFilters]);

  // Sort products
  const sortProducts = useCallback((sortBy, sortDir = 'asc') => {
    updateFilters({ sortBy, sortDir });
  }, [updateFilters]);

  // Refresh products (for after creating/updating)
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Memoized computed values
  const hasProducts = useMemo(() => products.length > 0, [products.length]);
  const isEmpty = useMemo(() => !loading && products.length === 0, [loading, products.length]);
  const hasNextPage = useMemo(() => !pagination.last, [pagination.last]);
  const hasPrevPage = useMemo(() => !pagination.first, [pagination.first]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []); // Only run once on mount

  return {
    // Data
    products,
    loading,
    error,
    filters,
    pagination,
    
    // Computed values
    hasProducts,
    isEmpty,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    loadProducts,
    refreshProducts,
    updateFilters,
    changePage,
    resetFilters,
    searchProducts,
    filterByCategory,
    filterByPriceRange,
    sortProducts,
    
    // Utilities
    clearError: () => setError(null)
  };
};

export default useProductsSimple;