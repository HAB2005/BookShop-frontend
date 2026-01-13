import {
  getAllUsersApi,
  createUserApi,
  getAdminUserDetailApi,
  updateUserStatusApi,
  adminUpdateUserProfileApi,
  resetUserPasswordApi
} from "../api/user.api.js";

// Admin Services
export const fetchUsersService = async ({ page, size, sortBy, sortDir, username, email, role, status }) => {
  const response = await getAllUsersApi({ page, size, sortBy, sortDir, username, email, role, status });
  const data = response.data;

  if (!data?.content) {
    throw new Error("Invalid user list response");
  }

  return {
    users: data.content,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.page,
    size: data.size,
    first: data.first,
    last: data.last,
    empty: data.empty
  };
};

export const createUserService = async (userData) => {
  try {
    const response = await createUserApi(userData);
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
          throw new Error(data?.message || "Invalid user data");
        }
      } else if (status === 409) {
        throw new Error("Username or email already exists");
      } else {
        throw new Error(data?.message || "Failed to create user");
      }
    }
    throw error;
  }
};

export const getUserDetailAdminService = async (userId) => {
  try {
    const response = await getAdminUserDetailApi(userId);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user details");
  }
};

export const resetUserPasswordService = async (userId) => {
  try {
    const response = await resetUserPasswordApi(userId);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(data?.message || "Failed to reset password");
      }
    }
    throw error;
  }
};

export const updateUserStatusService = async (userId, status) => {
  try {
    const response = await updateUserStatusApi(userId, status);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status: httpStatus, data } = error.response;

      if (httpStatus === 400) {
        throw new Error(data?.message || "Invalid status value");
      } else if (httpStatus === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(data?.message || "Failed to update user status");
      }
    }
    throw error;
  }
};

export const updateUserProfileAdminService = async (userId, profileData) => {
  try {
    const response = await adminUpdateUserProfileApi(userId, profileData);
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
      } else if (status === 404) {
        throw new Error("User not found");
      } else if (status === 409) {
        throw new Error("Email already exists");
      } else {
        throw new Error(data?.message || "Failed to update user profile");
      }
    }
    throw error;
  }
};