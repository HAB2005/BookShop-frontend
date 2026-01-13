import client from '../../../api/client.js';
import { PRODUCT_IMAGE } from '../../../api/endpoints.js';

// Upload product image
export const uploadProductImageApi = async (productId, file, isPrimary = false, sortOrder = null) => {
  const formData = new FormData();
  formData.append('productId', productId);
  formData.append('file', file);
  formData.append('isPrimary', isPrimary);
  if (sortOrder !== null) {
    formData.append('sortOrder', sortOrder);
  }

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

// Get primary image
export const getPrimaryImageApi = async (productId) => {
  const response = await client.get(PRODUCT_IMAGE.PRIMARY, {
    params: { productId }
  });
  return response.data;
};

// Update image
export const updateProductImageApi = async (imageId, updateData) => {
  const response = await client.put(PRODUCT_IMAGE.UPDATE(imageId), updateData);
  return response.data;
};

// Set primary image
export const setPrimaryImageApi = async (imageId) => {
  const response = await client.patch(PRODUCT_IMAGE.SET_PRIMARY(imageId));
  return response.data;
};

// Reorder images
export const reorderImagesApi = async (productId, imageOrders) => {
  const response = await client.put(PRODUCT_IMAGE.REORDER, {
    productId,
    imageOrders
  });
  return response.data;
};

// Delete image
export const deleteProductImageApi = async (imageId) => {
  const response = await client.delete(PRODUCT_IMAGE.DELETE(imageId));
  return response.data;
};

// Delete all product images
export const deleteAllProductImagesApi = async (productId) => {
  const response = await client.delete(PRODUCT_IMAGE.DELETE_ALL, {
    params: { productId }
  });
  return response.data;
};