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
  ADMIN: {
    LIST: "/admin/categories",
    CREATE: "/admin/categories",
    UPDATE: (id) => `/admin/categories/${id}`,
    UPDATE_STATUS: (id) => `/admin/categories/${id}/status`,
  }
};

const CART = {
  GET: "/cart",
  ADD_ITEM: "/cart/items",
  UPDATE_ITEM: (id) => `/cart/items/${id}`,
  REMOVE_ITEM: (id) => `/cart/items/${id}`,
  CLEAR: "/cart",
};

const ORDER = {
  LIST: "/orders",
  DETAIL: (id) => `/orders/${id}`,
  CREATE: "/orders",
  CANCEL: (id) => `/orders/${id}/cancel`,
  CHECKOUT: "/orders/checkout",
  CHECKOUT_WITH_PAYMENT: "/orders/checkout-with-payment",

  // Admin endpoints
  ADMIN: {
    LIST: "/admin/orders",
    DETAIL: (id) => `/admin/orders/${id}`,
    UPDATE_STATUS: (id) => `/admin/orders/${id}/status`,
    STATISTICS: "/admin/orders/statistics",
  }
};

const PAYMENT = {
  PROCESS: "/payments/process",
  BY_ORDER: (orderId) => `/payments/order/${orderId}`,
  DETAIL: (id) => `/payments/${id}`,
  CANCEL: (id) => `/payments/${id}/cancel`,

  // Admin endpoints
  ADMIN: {
    LIST: "/admin/payments",
    BY_STATUS: (status) => `/admin/payments/status/${status}`,
    DETAIL: (id) => `/admin/payments/${id}`,
    BY_ORDER: (orderId) => `/admin/payments/order/${orderId}`,
    CANCEL: (id) => `/admin/payments/${id}/cancel`,
    STATISTICS: "/admin/payments/statistics",
  }
};

const PRODUCT_IMAGE = {
  LIST: "/product-images",
  PRIMARY: "/product-images/primary",
  STATS: "/product-images/stats",
  UPLOAD: "/product-images",
  UPDATE: (imageId) => `/product-images/${imageId}`,
  DELETE: (imageId) => `/product-images/${imageId}`,
  DELETE_ALL: "/product-images",
  SET_PRIMARY: (imageId) => `/product-images/${imageId}/primary`,
  REORDER: "/product-images/reorder",
};

const STOCK = {
  LIST: "/admin/stock",
  GET_BY_PRODUCT: (productId) => `/admin/stock/product/${productId}`,
  GET_BY_PRODUCTS: "/admin/stock/products",
  CREATE: (productId) => `/admin/stock/product/${productId}`,
  CREATE_FROM_REQUEST: "/admin/stock",
  ADD: (productId) => `/admin/stock/product/${productId}/add`,
  SET: (productId) => `/admin/stock/product/${productId}`,
  UPDATE: (stockId) => `/admin/stock/${stockId}`,
  HISTORY: (stockId) => `/admin/stock/${stockId}/history`,
  LOW_STOCK: "/admin/stock/low-stock",
  STATISTICS: "/admin/stock/statistics",

  // Admin endpoints
  ADMIN: {
    LIST: "/admin/stock",
    CREATE: "/admin/stock",
    UPDATE: (stockId) => `/admin/stock/${stockId}`,
    HISTORY: (stockId) => `/admin/stock/${stockId}/history`,
    LOW_STOCK: "/admin/stock/low-stock",
  }
};

export { AUTH, USER, PRODUCT, CATEGORY, CART, ORDER, PAYMENT, PRODUCT_IMAGE, STOCK };