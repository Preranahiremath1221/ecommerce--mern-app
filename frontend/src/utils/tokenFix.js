// Enhanced token format fix utility with comprehensive validation
import axios from 'axios';

export const fixTokenFormat = (token) => {
    if (!token) return null;
    
    // Remove any extra spaces, newlines, or tabs
    let cleanToken = token.trim();
    
    // Remove any "Bearer" prefix if accidentally stored
    if (cleanToken.startsWith('Bearer ')) {
        cleanToken = cleanToken.replace('Bearer ', '');
    }
    
    // Remove any quotes that might have been added
    cleanToken = cleanToken.replace(/^["']|["']$/g, '');
    
    return cleanToken;
};

export const validateAndFixToken = (token) => {
    if (!token) {
        return {
            valid: false,
            error: 'No token provided',
            action: 'login'
        };
    }
    
    const cleanToken = fixTokenFormat(token);
    
    if (!cleanToken || cleanToken.length < 10) {
        return {
            valid: false,
            error: 'Token appears to be malformed',
            action: 'login'
        };
    }
    
    // Check for invalid characters
    if (cleanToken.includes(' ') || cleanToken.includes('\n') || cleanToken.includes('\t')) {
        return {
            valid: false,
            error: 'Token contains invalid characters',
            action: 'login'
        };
    }
    
    // Additional JWT format validation
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
        return {
            valid: false,
            error: 'Invalid JWT format',
            action: 'login'
        };
    }
    
    // Validate base64 encoding for each part
    try {
        parts.forEach(part => {
            atob(part.replace(/-/g, '+').replace(/_/g, '/'));
        });
    } catch (e) {
        return {
            valid: false,
            error: 'Invalid base64 encoding in token',
            action: 'login'
        };
    }
    
    return {
        valid: true,
        token: cleanToken,
        error: null
    };
};

export const getCleanAuthHeaders = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    
    const validation = validateAndFixToken(token);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    
    return {
        'Authorization': `Bearer ${validation.token}`,
        'Content-Type': 'application/json'
    };
};

// Enhanced token storage with validation
export const storeTokenSafely = (token) => {
    const validation = validateAndFixToken(token);
    if (validation.valid) {
        localStorage.setItem('token', validation.token);
        return validation.token;
    }
    return null;
};

// Safe logout that clears all tokens
export const safeLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    // Clear any cached tokens in memory
    return true;
};

// Check token health before making requests
export const checkTokenHealth = async (backendUrl, token) => {
    if (!token) return false;
    
    try {
        const cleanToken = fixTokenFormat(token);
        const response = await axios.post(`${backendUrl}/api/user/validate-token`, {
            token: cleanToken
        });
        return response.data.success;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};
