import client from "../../../api/client.js";
import { PRODUCT_IMAGE } from "../../../api/endpoints.js";

// ==================== PRODUCT IMAGE ENDPOINTS ====================
export const uploadProductImageApi = (formData) => {
  return client.post(PRODUCT_IMAGE.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProductImagesApi = (params) => {
  return client.get(PRODUCT_IMAGE.LIST, { params });
};

export const getPrimaryImageApi = (params) => {
  return client.get(PRODUCT_IMAGE.PRIMARY, { params });
};

export const getImageByIdApi = (imageId) => {
  return client.get(PRODUCT_IMAGE.DETAIL(imageId));
};

export const getImageStatsApi = (params) => {
  return client.get(PRODUCT_IMAGE.STATS, { params });
};

export const updateImageApi = (imageId, data) => {
  return client.put(PRODUCT_IMAGE.UPDATE(imageId), data);
};

export const setPrimaryImageApi = (imageId) => {
  return client.patch(PRODUCT_IMAGE.SET_PRIMARY(imageId));
};

export const deleteImageApi = (imageId) => {
  return client.delete(PRODUCT_IMAGE.DELETE(imageId));
};

export const reorderImagesApi = (data) => {
  return client.put(PRODUCT_IMAGE.REORDER, data);
};

export const deleteAllProductImagesApi = (params) => {
  return client.delete(PRODUCT_IMAGE.DELETE_ALL, { params });
};