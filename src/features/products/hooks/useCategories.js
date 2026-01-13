import { useState, useEffect } from 'react';
import { getCategoriesApi } from '../api/categories.api.js';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesApi();
      
      // Ensure response is an array
      const categoriesData = Array.isArray(response) ? response : [];
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMessage);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to flatten categories for easier use in forms
  const getFlatCategories = () => {
    const flattenCategories = (cats, level = 0) => {
      let result = [];
      // Check if cats is an array before using forEach
      if (Array.isArray(cats) && cats.length > 0) {
        cats.forEach(cat => {
          if (cat && cat.name) { // Ensure cat object has required properties
            result.push({
              ...cat,
              level,
              displayName: '  '.repeat(level) + cat.name
            });
            if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
              result = result.concat(flattenCategories(cat.children, level + 1));
            }
          }
        });
      }
      return result;
    };
    
    // Ensure categories is an array before processing
    if (!Array.isArray(categories)) {
      return [];
    }
    
    return flattenCategories(categories);
  };

  return {
    categories,
    flatCategories: getFlatCategories(),
    loading,
    error,
    fetchCategories,
    refetch: fetchCategories,
    clearError: () => setError(null)
  };
};