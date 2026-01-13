import client from "../../../api/client.js";
import { USER } from "../../../api/endpoints.js";

// ==================== ADMIN USER MANAGEMENT ENDPOINTS ====================
export const getAllUsersApi = (params) => {
  return client.get(USER.ADMIN.LIST, { params });
};

export const createUserApi = (data) => {
  return client.post(USER.ADMIN.CREATE, data);
};

export const getAdminUserDetailApi = (userId) => {
  return client.get(USER.ADMIN.DETAIL(userId));
};

export const updateUserStatusApi = (userId, status) => {
  return client.put(USER.ADMIN.UPDATE_STATUS(userId), null, { 
    params: { status } 
  });
};

export const adminUpdateUserProfileApi = (userId, data) => {
  return client.put(USER.ADMIN.UPDATE_PROFILE(userId), data);
};

export const resetUserPasswordApi = (userId) => {
  return client.put(USER.ADMIN.RESET_PASSWORD(userId));
};