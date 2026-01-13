import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// List of endpoints that don't require authentication
const publicEndpoints = [
  '/auth/email/login',
  '/auth/email/register',
  '/auth/email/set-password',
  '/auth/google/login',
  '/auth/phone/send-otp',
  '/auth/phone/verify-otp',
];

client.interceptors.request.use((config) => {
  // Skip adding token for public endpoints
  if (publicEndpoints.some(endpoint => config.url === endpoint)) {
    return config;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle authentication errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/auth pages and not a login attempt
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath.startsWith('/auth');
      const isLoginAttempt = publicEndpoints.some(endpoint => 
        error.config?.url === endpoint
      );
      
      if (!isAuthPage && !isLoginAttempt) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
