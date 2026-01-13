import client from "../../../api/client.js";
import { USER } from "../../../api/endpoints.js";

// ==================== PROFILE ENDPOINTS ====================
export const getUserProfileApi = () => {
  return client.get(USER.PROFILE);
};

export const getUserProfileByIdApi = (userId) => {
  return client.get(USER.PROFILE_BY_ID(userId));
};

export const updateUserProfileApi = (data) => {
  return client.put(USER.UPDATE_PROFILE, data);
};

export const changePasswordApi = (data) => {
  return client.put(USER.CHANGE_PASSWORD, data);
};