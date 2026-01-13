import { useState, useCallback } from 'react';
import {
  getCategoriesApi,
  getCategoryDetailApi,
  getCategoryBySlugApi,
  createCategoryApi,
  updateCategoryApi,
  updateCategoryStatusApi
} from '../api/category.api.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories with filters
  const fetchCategories = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCategoriesApi(filters);
      setCategories(response.data.content || []);
      return {
        success: true,
        data: response.data.content,
        pagination: {
          page: response.data.page,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last
        }
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category detail
  const getCategoryDetail = useCallback(async (categoryId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCategoryDetailApi(categoryId);
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category details';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category by slug
  const getCategoryBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCategoryBySlugApi(slug);
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createCategoryApi(categoryData);

      // Add new category to local state
      setCategories(prev => [...prev, response.data]);

      return {
        success: true,
        data: response.data,
        message: 'Category created successfully'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (categoryId, categoryData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateCategoryApi(categoryId, categoryData);

      // Update category in local state
      setCategories(prev =>
        prev.map(cat =>
          cat.categoryId === categoryId ? response.data : cat
        )
      );

      return {
        success: true,
        data: response.data,
        message: 'Category updated successfully'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update category status
  const updateCategoryStatus = useCallback(async (categoryId, statusData) => {
    setLoading(true);
    setError(null);

    try {
      await updateCategoryStatusApi(categoryId, statusData);

      // Update category status in local state
      setCategories(prev =>
        prev.map(cat =>
          cat.categoryId === categoryId
            ? { ...cat, status: statusData.status }
            : cat
        )
      );

      return {
        success: true,
        message: 'Category status updated successfully'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update category status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh categories (re-fetch with current filters)
  const refreshCategories = useCallback(async () => {
    return await fetchCategories({ includeInactive: true, size: 100 });
  }, [fetchCategories]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setCategories([]);
    setLoading(false);
    setError(null);
  }, []);

  // Utility functions
  const getCategoryById = useCallback((categoryId) => {
    return categories.find(cat => cat.categoryId === categoryId);
  }, [categories]);

  const getCategoryBySlugLocal = useCallback((slug) => {
    return categories.find(cat => cat.slug === slug);
  }, [categories]);

  const getRootCategories = useCallback(() => {
    return categories.filter(cat => !cat.parentId);
  }, [categories]);

  const getChildCategories = useCallback((parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(cat => cat.status === 'ACTIVE');
  }, [categories]);

  const getCategoryTree = useCallback(() => {
    const categoryMap = new Map();
    const rootCategories = [];

    // Create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.categoryId, {
        ...category,
        children: []
      });
    });

    // Build parent-child relationships
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.categoryId);

      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId);
        parent.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [categories]);

  const getCategoryPath = useCallback((categoryId) => {
    const path = [];
    let currentCategory = getCategoryById(categoryId);

    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId
        ? getCategoryById(currentCategory.parentId)
        : null;
    }

    return path;
  }, [categories, getCategoryById]);

  const getCategoryStats = useCallback(() => {
    return {
      total: categories.length,
      active: categories.filter(cat => cat.status === 'ACTIVE').length,
      inactive: categories.filter(cat => cat.status === 'INACTIVE').length,
      root: categories.filter(cat => !cat.parentId).length
    };
  }, [categories]);

  return {
    // State
    categories,
    loading,
    error,

    // Actions
    fetchCategories,
    getCategoryDetail,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    refreshCategories,
    clearError,
    resetState,

    // Utilities
    getCategoryById,
    getCategoryBySlugLocal,
    getRootCategories,
    getChildCategories,
    getActiveCategories,
    getCategoryTree,
    getCategoryPath,
    getCategoryStats
  };
}