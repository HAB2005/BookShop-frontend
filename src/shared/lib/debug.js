// Debug utilities for authentication issues

export const debugAuthState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('=== AUTH DEBUG ===');
  console.log('Token:', token ? 'EXISTS' : 'NULL');
  console.log('User string:', userStr);
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('Parsed user:', user);
    } catch (error) {
      console.log('Error parsing user:', error);
    }
  }
  
  console.log('==================');
};

export const clearAuthDebug = () => {
  console.log('Clearing auth data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Auth data cleared');
};