// Authentication utilities for multi-auth system

export const AUTH_TYPES = {
  EMAIL: 'email',
  GOOGLE: 'google',
  PHONE: 'phone',
};

export const saveAuthData = (authResponse) => {
  if (authResponse.token) {
    localStorage.setItem('token', authResponse.token);
  }

  const userData = {
    userId: authResponse.userId,
    username: authResponse.username,
    fullName: authResponse.fullName,
    role: authResponse.role,
  };

  localStorage.setItem('user', JSON.stringify(userData));
};

export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return null;
  }

  try {
    const user = JSON.parse(userStr);
    return { token, user };
  } catch (error) {
    console.error('Error parsing user data:', error);
    clearAuthData();
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const authData = getAuthData();
  return authData !== null;
};

export const getCurrentUser = () => {
  const authData = getAuthData();
  return authData?.user || null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const isCustomer = () => {
  const user = getCurrentUser();
  return user?.role === 'customer';
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Error handling helpers
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const isAccountExistsError = (error) => {
  const errorCode = error.response?.data?.error;
  return errorCode === 'ACCOUNT_EXISTS_OTHER_PROVIDER';
};

export const isInvalidCredentialsError = (error) => {
  const errorCode = error.response?.data?.error;
  return errorCode === 'INVALID_CREDENTIALS';
};

export const isOtpError = (error) => {
  const errorCode = error.response?.data?.error;
  return errorCode === 'INVALID_OTP' || errorCode === 'OTP_RATE_LIMIT_EXCEEDED';
};