import client from '../../../api/client.js';
import { PRODUCT, CATEGORY, PRODUCT_IMAGE } from '../../../api/endpoints.js';

// ==================== PRODUCT CRUD OPERATIONS ====================

export const createProductApi = async (productData) => {
  const response = await client.post(PRODUCT.CREATE, productData);
  return response;
};

export const getProductsApi = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc',
    name,
    minPrice,
    maxPrice,
    categoryIds
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  });

  if (name) queryParams.append('name', name);
  if (minPrice) queryParams.append('minPrice', minPrice.toString());
  if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach(id => queryParams.append('categoryIds', id.toString()));
  }

  const response = await client.get(`${PRODUCT.LIST}?${queryParams}`);
  return response;
};

export const getProductDetailApi = async (productId) => {
  const response = await client.get(PRODUCT.DETAIL(productId));
  return response;
};

export const updateProductApi = async (productId, productData) => {
  const response = await client.put(PRODUCT.UPDATE(productId), productData);
  return response;
};

export const updateProductStatusApi = async (productId, status) => {
  const response = await client.patch(PRODUCT.UPDATE_STATUS(productId), { status });
  return response;
};

export const assignCategoriesToProductApi = async (productId, categoryIds) => {
  const response = await client.put(PRODUCT.ASSIGN_CATEGORIES(productId), { categoryIds });
  return response;
};

// ==================== PRODUCT SEARCH & SUGGESTIONS ====================

export const searchProductsApi = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc',
    keyword,
    language,
    publishYear
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  });

  if (keyword) queryParams.append('keyword', keyword);
  if (language) queryParams.append('language', language);
  if (publishYear) queryParams.append('publishYear', publishYear.toString());

  const response = await client.get(`${PRODUCT.SEARCH}?${queryParams}`);
  return response;
};

export const getProductSuggestionsApi = async (keyword, limit = 10) => {
  const queryParams = new URLSearchParams({
    limit: limit.toString()
  });

  if (keyword) queryParams.append('keyword', keyword);

  const response = await client.get(`${PRODUCT.SUGGESTIONS}?${queryParams}`);
  return response;
};

// ==================== CATEGORY OPERATIONS ====================

export const getCategoriesApi = async (params = {}) => {
  const {
    page = 0,
    size = 100, // Get more categories for selection
    sortBy = 'name',
    sortDir = 'asc',
    name,
    parentId,
    includeInactive = false
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
    includeInactive: includeInactive.toString()
  });

  if (name) queryParams.append('name', name);
  if (parentId) queryParams.append('parentId', parentId.toString());

  const response = await client.get(`${CATEGORY.LIST}?${queryParams}`);
  return response;
};

export const getCategoryDetailApi = async (categoryId) => {
  const response = await client.get(CATEGORY.DETAIL(categoryId));
  return response;
};

// ==================== PRODUCT IMAGE OPERATIONS ====================

export const uploadProductImageApi = async (productId, file, isPrimary = false, sortOrder = null) => {
  const formData = new FormData();
  formData.append('productId', productId.toString());
  formData.append('file', file);
  formData.append('isPrimary', isPrimary.toString());
  if (sortOrder !== null) {
    formData.append('sortOrder', sortOrder.toString());
  }

  const response = await client.post(PRODUCT_IMAGE.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const getProductImagesApi = async (productId) => {
  const response = await client.get(`${PRODUCT_IMAGE.LIST}?productId=${productId}`);
  return response;
};

export const updateProductImageApi = async (imageId, updateData) => {
  const response = await client.put(PRODUCT_IMAGE.UPDATE(imageId), updateData);
  return response;
};

export const setPrimaryImageApi = async (imageId) => {
  const response = await client.patch(PRODUCT_IMAGE.SET_PRIMARY(imageId));
  return response;
};

export const deleteProductImageApi = async (imageId) => {
  const response = await client.delete(PRODUCT_IMAGE.DELETE(imageId));
  return response;
};

export const reorderProductImagesApi = async (productId, imageOrders) => {
  const response = await client.put(PRODUCT_IMAGE.REORDER, {
    productId,
    imageOrders
  });
  return response;
};