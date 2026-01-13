import client from '../../../api/client.js';
import { PRODUCT, PRODUCT_IMAGE } from '../../../api/endpoints.js';

// Get all products with filters
export const getProductsApi = async (params = {}) => {
  const response = await client.get(PRODUCT.LIST, { params });
  return response.data;
};

// Get all products including all statuses (for admin management)
export const getAllProductsApi = async (params = {}) => {
  const response = await client.get(PRODUCT.LIST, { 
    params: {
      ...params,
      includeAllStatuses: true // Backend should handle this parameter
    }
  });
  return response.data;
};

// Get product by ID
export const getProductByIdApi = async (productId) => {
  const response = await client.get(PRODUCT.DETAIL(productId));
  return response.data;
};

// Create new product
export const createProductApi = async (productData) => {
  const response = await client.post(PRODUCT.CREATE, productData);
  return response.data;
};

// Update product
export const updateProductApi = async (productId, productData) => {
  const response = await client.put(PRODUCT.UPDATE(productId), productData);
  return response.data;
};

// Update product status
export const updateProductStatusApi = async (productId, status) => {
  const response = await client.patch(PRODUCT.UPDATE_STATUS(productId), { status });
  return response.data;
};

// Assign categories to product
export const assignCategoriesToProductApi = async (productId, categoryIds) => {
  const response = await client.put(PRODUCT.ASSIGN_CATEGORIES(productId), { categoryIds });
  return response.data;
};

// Upload product image
export const uploadProductImageApi = async (productId, imageFile, isPrimary = false) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('productId', productId);
  formData.append('isPrimary', isPrimary);
  
  const response = await client.post(PRODUCT_IMAGE.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get product images
export const getProductImagesApi = async (productId) => {
  const response = await client.get(PRODUCT_IMAGE.LIST, {
    params: { productId }
  });
  return response.data;
};

// Set primary image
export const setPrimaryImageApi = async (imageId) => {
  const response = await client.patch(PRODUCT_IMAGE.SET_PRIMARY(imageId));
  return response.data;
};

// Delete product image
export const deleteProductImageApi = async (imageId) => {
  const response = await client.delete(PRODUCT_IMAGE.DELETE(imageId));
  return response.data;
};

// Search products
export const searchProductsApi = async (params = {}) => {
  const response = await client.get(PRODUCT.SEARCH, { params });
  return response.data;
};

// Get product suggestions
export const getProductSuggestionsApi = async (keyword, limit = 10) => {
  const response = await client.get(PRODUCT.SUGGESTIONS, { 
    params: { keyword, limit } 
  });
  return response.data;
};