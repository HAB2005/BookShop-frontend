import client from "../../../api/client.js";
import { AUTH } from "../../../api/endpoints.js";

// ==================== EMAIL/PASSWORD AUTHENTICATION ====================
export const emailLoginApi = ({ email, password }) => {
  return client.post(AUTH.EMAIL.LOGIN, { email, password });
};

export const emailRegisterApi = ({ email, password, fullName }) => {
  return client.post(AUTH.EMAIL.REGISTER, { email, password, fullName });
};

export const setPasswordApi = ({ email, password, confirmPassword }) => {
  return client.post(AUTH.EMAIL.SET_PASSWORD, { email, password, confirmPassword });
};

// ==================== GOOGLE OAUTH AUTHENTICATION ====================
export const googleLoginApi = ({ idToken }) => {
  return client.post(AUTH.GOOGLE.LOGIN, { idToken });
};

// ==================== PHONE OTP AUTHENTICATION ====================
export const sendPhoneOtpApi = ({ phone }) => {
  return client.post(AUTH.PHONE.SEND_OTP, { phone });
};

export const verifyPhoneOtpApi = ({ phone, code }) => {
  return client.post(AUTH.PHONE.VERIFY_OTP, { phone, code });
};

// ==================== COMMON ====================
export const logoutApi = () => {
  return client.post(AUTH.LOGOUT);
};

export const refreshTokenApi = (token) => {
  return client.post(AUTH.REFRESH, { token });
};

// ==================== HELPER FUNCTIONS ====================
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};