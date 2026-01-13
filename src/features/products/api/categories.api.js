import client from '../../../api/client.js';
import { CATEGORY } from '../../../api/endpoints.js';

// Get all categories
export const getCategoriesApi = async (params = {}) => {
  const response = await client.get(CATEGORY.LIST, { params });
  return response.data;
};

// Get category by ID
export const getCategoryByIdApi = async (categoryId) => {
  const response = await client.get(CATEGORY.DETAIL(categoryId));
  return response.data;
};

// Get category by slug
export const getCategoryBySlugApi = async (slug) => {
  const response = await client.get(CATEGORY.BY_SLUG(slug));
  return response.data;
};

// Create new category
export const createCategoryApi = async (categoryData) => {
  const response = await client.post(CATEGORY.CREATE, categoryData);
  return response.data;
};

// Update category
export const updateCategoryApi = async (categoryId, categoryData) => {
  const response = await client.put(CATEGORY.UPDATE(categoryId), categoryData);
  return response.data;
};

// Update category status
export const updateCategoryStatusApi = async (categoryId, status) => {
  const response = await client.patch(CATEGORY.UPDATE_STATUS(categoryId), { status });
  return response.data;
};