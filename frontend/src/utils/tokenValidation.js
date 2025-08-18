/**
 * Token validation and fixing utilities
 */

export const validateAndFixToken = (token) => {
  if (!token) return { valid: false, token: null };
  
  try {
    // Remove any "Bearer " prefix if present
    let cleanToken = token.replace(/^Bearer\s+/i, '');
    
    // Ensure token has 3 parts separated by dots
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return { valid: false, token: null };
    }
    
    // Validate base64 encoding
    try {
      atob(parts[0]); // header
      atob(parts[1]); // payload
      return { valid: true, token: cleanToken };
    } catch (e) {
      console.error('Token contains invalid base64');
      return { valid: false, token: null };
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, token: null };
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

export const getTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token payload:', error);
    return null;
  }
};
