import client from "../../../api/client.js";
import { FILE } from "../../../api/endpoints.js";

// ==================== FILE SERVING ENDPOINTS ====================
export const getFileUrlApi = (productId, filename) => {
  return FILE.SERVE(productId, filename);
};

export const getDownloadUrlApi = (productId, filename) => {
  return FILE.DOWNLOAD(productId, filename);
};

export const getFileInfoApi = (productId, filename) => {
  return client.get(FILE.INFO(productId, filename));
};

// Helper function to get full file URL
export const getFullFileUrl = (productId, filename) => {
  const baseUrl = client.defaults.baseURL || '';
  return `${baseUrl}${FILE.SERVE(productId, filename)}`;
};

// Helper function to get full download URL
export const getFullDownloadUrl = (productId, filename) => {
  const baseUrl = client.defaults.baseURL || '';
  return `${baseUrl}${FILE.DOWNLOAD(productId, filename)}`;
};