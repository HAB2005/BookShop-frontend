import { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../../features/product/services/productService.js';
import { useToastContext } from '../../app/providers.jsx';
import { useErrorBoundary } from './useErrorBoundary.js';

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

export const useProductsOptimized = (options = {}) => {
  const {
    includeImages = true,
    includeAllStatuses = false,
    autoLoad = true
  } = options;

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
  const { captureError } = useErrorBoundary();

  // Batch load images for multiple products to fix N+1 query issue
  const loadProductImages = useCallback(async (productList) => {
    if (!includeImages || !productList.length) {
      return productList;
    }

    try {
      // Create a map to store image promises
      const imagePromises = new Map();
      
      // Start all image requests concurrently
      productList.forEach(product => {
        if (product.productId) {
          imagePromises.set(
            product.productId, 
            productService.getProductImages(product.productId)
          );
        }
      });

      // Wait for all image requests to complete
      const imageResults = await Promise.allSettled(
        Array.from(imagePromises.values())
      );

      // Map results back to products
      const productIds = Array.from(imagePromises.keys());
      const productsWithImages = productList.map((product, index) => {
        const imageResult = imageResults[index];
        
        if (imageResult.status === 'fulfilled' && imageResult.value.success) {
          // Sort images using utility function
          const sortedImages = productService.sortImagesByPrimary(imageResult.value.data || []);
          
          return {
            ...product,
            images: sortedImages
          };
        } else {
          // Log warning but don't fail the entire operation
          if (imageResult.status === 'rejected') {
            console.warn(`Failed to fetch images for product ${product.productId}:`, imageResult.reason);
          }
          return {
            ...product,
            images: []
          };
        }
      });

      return productsWithImages;
    } catch (error) {
      console.error('Error in batch image loading:', error);
      // Return products without images rather than failing completely
      return productList.map(product => ({ ...product, images: [] }));
    }
  }, [includeImages]);

  // Load products with optimized image loading
  const loadProducts = useCallback(async (newFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getProducts(newFilters);
      
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
      captureError(err);
    } finally {
      setLoading(false);
    }
  }, [toast, captureError, loadProductImages]); // Remove filters dependency

  // Update filters with debouncing for search
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Reset to first page when filters change
    }));
  }, []); // Remove filters dependency

  // Debounced filter effect
  useEffect(() => {
    if (!autoLoad) return;

    const timeoutId = setTimeout(() => {
      loadProducts(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, autoLoad]); // Remove loadProducts dependency to prevent loop

  // Change page
  const changePage = useCallback((newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

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
    loadProducts(filters);
  }, [loadProducts, filters]);

  // Manual load for cases where autoLoad is false
  const manualLoad = useCallback((customFilters) => {
    loadProducts(customFilters || filters);
  }, [loadProducts, filters]);

  // Memoized computed values
  const hasProducts = useMemo(() => products.length > 0, [products.length]);
  const isEmpty = useMemo(() => !loading && products.length === 0, [loading, products.length]);
  const hasNextPage = useMemo(() => !pagination.last, [pagination.last]);
  const hasPrevPage = useMemo(() => !pagination.first, [pagination.first]);

  // Load products on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad) {
      // Set initial filters which will trigger the debounced effect above
      setFilters(DEFAULT_FILTERS);
    }
  }, [autoLoad]); // Only run when autoLoad changes

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
    loadProducts: manualLoad,
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

// Hook for single product
export const useProduct = (productId, options = {}) => {
  const { includeImages = true } = options;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toast = useToastContext();
  const { captureError } = useErrorBoundary();

  const fetchProduct = useCallback(async (id = productId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await productService.getProductDetail(id);
      
      if (result.success) {
        let productData = result.data;
        
        // Load images if requested
        if (includeImages) {
          const imagesResult = await productService.getProductImages(id);
          if (imagesResult.success) {
            // Sort images using utility function
            const sortedImages = productService.sortImagesByPrimary(imagesResult.data || []);
            
            productData = {
              ...productData,
              images: sortedImages
            };
          }
        }
        
        setProduct(productData);
      } else {
        const errorMessage = result.error || 'Failed to fetch product';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product';
      setError(errorMessage);
      toast.error(errorMessage);
      captureError(err);
    } finally {
      setLoading(false);
    }
  }, [productId, includeImages, toast, captureError]);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    fetchProduct,
    refetch: () => fetchProduct(productId),
    clearError: () => setError(null)
  };
};

export default useProductsOptimized;