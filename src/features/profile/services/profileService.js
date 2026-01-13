import { 
  getUserProfileApi,
  updateUserProfileApi,
  changePasswordApi
} from "../api/profile.api.js";

export const getCurrentUserProfileService = async () => {
  try {
    const response = await getUserProfileApi();
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please login again.");
    }
    throw new Error("Failed to fetch user profile");
  }
};

export const updateUserProfileService = async (profileData) => {
  try {
    const response = await updateUserProfileApi(profileData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        if (data?.validationErrors && data.validationErrors.length > 0) {
          const validationMessages = data.validationErrors.map(err => 
            `${err.field}: ${err.message}`
          );
          throw new Error(validationMessages.join('. '));
        } else {
          throw new Error(data?.message || "Invalid profile data");
        }
      } else if (status === 409) {
        throw new Error("Email already exists");
      } else {
        throw new Error(data?.message || "Failed to update profile");
      }
    }
    throw error;
  }
};

export const changePasswordService = async (passwordData) => {
  try {
    const response = await changePasswordApi(passwordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        if (data?.validationErrors && data.validationErrors.length > 0) {
          const validationMessages = data.validationErrors.map(err => 
            `${err.field}: ${err.message}`
          );
          throw new Error(validationMessages.join('. '));
        } else if (data?.errorCode === "INVALID_CURRENT_PASSWORD") {
          throw new Error("Current password is incorrect");
        } else if (data?.errorCode === "PASSWORD_MISMATCH") {
          throw new Error("New password and confirm password do not match");
        } else if (data?.errorCode === "SAME_PASSWORD") {
          throw new Error("New password must be different from current password");
        } else {
          throw new Error(data?.message || "Invalid password data");
        }
      } else {
        throw new Error(data?.message || "Failed to change password");
      }
    }
    throw error;
  }
};