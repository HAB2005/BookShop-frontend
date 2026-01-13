/**
 * Google Authentication Service
 * Handles Google OAuth integration and token management
 */

/**
 * Get user info from Google using access token
 * @param {string} accessToken - Google access token
 * @returns {Promise<Object>} User info from Google
 */
export const getGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info from Google');
    }
    
    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw error;
  }
};

/**
 * Verify Google ID token (for server-side verification)
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object>} Verified token payload
 */
export const verifyGoogleIdToken = async (idToken) => {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    
    if (!response.ok) {
      throw new Error('Invalid Google ID token');
    }
    
    const tokenInfo = await response.json();
    return tokenInfo;
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    throw error;
  }
};

/**
 * Create a mock ID token from user info for backend compatibility
 * In production, you should use proper Google Sign-In with ID token
 * @param {Object} userInfo - Google user info
 * @returns {string} Mock ID token
 */
export const createMockIdToken = (userInfo) => {
  // This is a temporary solution for development
  // In production, use Google Sign-In library that provides ID tokens directly
  const payload = {
    sub: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    email_verified: userInfo.verified_email,
    iss: 'https://accounts.google.com',
    aud: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000)
  };
  
  // Base64 encode the payload (this is just for development)
  return btoa(JSON.stringify(payload));
};