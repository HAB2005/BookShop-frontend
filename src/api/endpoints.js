const AUTH = {
  EMAIL: {
    LOGIN: "/auth/email/login",
    REGISTER: "/auth/email/register",
    SET_PASSWORD: "/auth/email/set-password",
  },
  GOOGLE: {
    LOGIN: "/auth/google/login",
  },
  PHONE: {
    SEND_OTP: "/auth/phone/send-otp",
    VERIFY_OTP: "/auth/phone/verify-otp",
  },
  LOGOUT: "/auth/logout",
};

const USER = {
  // User profile endpoints
  PROFILE: "/user/profile",
  PROFILE_BY_ID: (id) => `/user/profile/${id}`,
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/change-password",

  // Admin user management endpoints
  ADMIN: {
    LIST: "/admin/users",
    CREATE: "/admin/users",
    DETAIL: (id) => `/admin/users/${id}`,
    UPDATE_STATUS: (id) => `/admin/users/${id}/status`,
    UPDATE_PROFILE: (id) => `/admin/users/${id}/profile`,
    RESET_PASSWORD: (id) => `/admin/users/${id}/reset-password`,
  }
};

const PRODUCT = {
  LIST: "/products",
  DETAIL: (id) => `/products/${id}`,
  CREATE: "/products",
  UPDATE: (id) => `/products/${id}`,
  UPDATE_STATUS: (id) => `/products/${id}/status`,
  SEARCH: "/products/search",
  SUGGESTIONS: "/products/suggestions",
  ASSIGN_CATEGORIES: (id) => `/products/${id}/categories`,
};

const CATEGORY = {
  LIST: "/categories",
  DETAIL: (id) => `/categories/${id}`,
  BY_SLUG: (slug) => `/categories/slug/${slug}`,
  CREATE: "/categories",
  UPDATE: (id) => `/categories/${id}`,
  UPDATE_STATUS: (id) => `/categories/${id}/status`,
};

const PRODUCT_IMAGE = {
  UPLOAD: "/product-images",
  LIST: "/product-images",
  PRIMARY: "/product-images/primary",
  DETAIL: (id) => `/product-images/${id}`,
  STATS: "/product-images/stats",
  UPDATE: (id) => `/product-images/${id}`,
  SET_PRIMARY: (id) => `/product-images/${id}/primary`,
  DELETE: (id) => `/product-images/${id}`,
  REORDER: "/product-images/reorder",
  DELETE_ALL: "/product-images",
};

const FILE = {
  SERVE: (productId, filename) => `/files/products/${productId}/${filename}`,
  DOWNLOAD: (productId, filename) => `/files/products/${productId}/${filename}/download`,
  INFO: (productId, filename) => `/files/products/${productId}/${filename}/info`,
};

export { AUTH, USER, PRODUCT, CATEGORY, PRODUCT_IMAGE, FILE };