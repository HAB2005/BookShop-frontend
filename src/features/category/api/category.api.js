import client from "../../../api/client.js";
import { CATEGORY } from "../../../api/endpoints.js";

// ==================== CATEGORY ENDPOINTS ====================
export const getCategoriesApi = (params) => {
  return client.get(CATEGORY.LIST, { params });
};

export const getCategoryDetailApi = (categoryId) => {
  return client.get(CATEGORY.DETAIL(categoryId));
};

export const getCategoryBySlugApi = (slug) => {
  return client.get(CATEGORY.BY_SLUG(slug));
};

export const createCategoryApi = (data) => {
  return client.post(CATEGORY.CREATE, data);
};

export const updateCategoryApi = (categoryId, data) => {
  return client.put(CATEGORY.UPDATE(categoryId), data);
};

export const updateCategoryStatusApi = (categoryId, data) => {
  return client.patch(CATEGORY.UPDATE_STATUS(categoryId), data);
};