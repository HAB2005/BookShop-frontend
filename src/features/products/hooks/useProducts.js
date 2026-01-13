import { useState, useEffect } from 'react';
import { 
  getProductsApi, 
  getAllProductsApi,
  getProductByIdApi, 
  createProductApi, 
  updateProductApi,
  updateProductStatusApi,
  assignCategoriesToProductApi 
} from '../api/products.api.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });

  const fetchProducts = async (params = {}, includeAllStatuses = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = includeAllStatuses 
        ? await getAllProductsApi(params)
        : await getProductsApi(params);
      setProducts(response.content || []);
      setPagination({
        page: response.page || 0,
        size: response.size || 10,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        first: response.first || true,
        last: response.last || true
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async (params = {}) => {
    return fetchProducts(params, true);
  };

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await createProductApi(productData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      const response = await updateProductApi(productId, productData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, status) => {
    try {
      setLoading(true);
      await updateProductStatusApi(productId, status);
      // Refresh products list
      await fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignCategories = async (productId, categoryIds) => {
    try {
      setLoading(true);
      await assignCategoriesToProductApi(productId, categoryIds);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product categories';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchAllProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
    assignCategories,
    clearError: () => setError(null)
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (id = productId) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getProductByIdApi(id);
      setProduct(response);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    fetchProduct,
    refetch: () => fetchProduct(productId),
    clearError: () => setError(null)
  };
};