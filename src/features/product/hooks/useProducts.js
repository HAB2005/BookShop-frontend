import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService.js';
import { useToastContext } from '../../../app/providers.jsx';

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

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load products
  const loadProducts = useCallback(async (newFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getProducts(newFilters);
      
      if (result.success) {
        // Fetch images for each product
        const productsWithImages = await Promise.all(
          result.data.map(async (product) => {
            try {
              const imagesResult = await productService.getProductImages(product.productId);
              return {
                ...product,
                images: imagesResult.success ? imagesResult.data : []
              };
            } catch (error) {
              console.warn(`Failed to fetch images for product ${product.productId}:`, error);
              return {
                ...product,
                images: []
              };
            }
          })
        );
        
        setProducts(productsWithImages);
        setPagination(result.pagination);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 0 // Reset to first page when filters change
    };
    setFilters(updatedFilters);
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

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []); // Only run once on mount

  // Refresh products (for after creating/updating)
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    // Data
    products,
    loading,
    error,
    filters,
    pagination,
    
    // Actions
    loadProducts,
    refreshProducts,
    updateFilters,
    changePage,
    resetFilters,
    searchProducts,
    filterByCategory,
    filterByPriceRange,
    sortProducts
  };
};