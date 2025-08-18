export const validateTokenFormat = (token) => {
    if (!token || typeof token !== 'string') {
        return {
            valid: false,
            error: 'Token is missing or invalid type'
        };
    }
    
    // Clean the token
    let cleanToken = token.trim();
    
    // Remove Bearer prefix if accidentally included
    if (cleanToken.startsWith('Bearer ')) {
        cleanToken = cleanToken.replace('Bearer ', '');
    }
    
    // Remove quotes
    cleanToken = cleanToken.replace(/^["']|["']$/g, '');
    
    if (cleanToken.length < 10) {
        return {
            valid: false,
            error: 'Token appears to be malformed (too short)'
        };
    }
    
    // Check for common token format issues
    if (cleanToken.includes(' ') || cleanToken.includes('\n') || cleanToken.includes('\t')) {
        return {
            valid: false,
            error: 'Token contains invalid characters'
        };
    }
    
    return {
        valid: true,
        token: cleanToken,
        error: null
    };
};

export const getAuthHeaders = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    
    const validation = validateTokenFormat(token);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    
    return {
        'Authorization': `Bearer ${validation.token}`,
        'Content-Type': 'application/json'
    };
};

export const handleTokenError = (error, navigate) => {
    console.log('Token error details:', error.response?.data);
    
    if (error.response?.status === 401) {
        const errorCode = error.response?.data?.error;
        
        switch (errorCode) {
            case 'INVALID_TOKEN_FORMAT':
            case 'MALFORMED_TOKEN':
            case 'INVALID_TOKEN_CHARS':
                return {
                    type: 'FORMAT_ERROR',
                    message: 'Invalid token format. Please login again.',
                    action: () => navigate('/login')
                };
            
            case 'TOKEN_EXPIRED':
                return {
                    type: 'EXPIRED',
                    message: 'Session expired. Please login again.',
                    action: () => navigate('/login')
                };
                
            case 'NO_TOKEN':
                return {
                    type: 'NO_TOKEN',
                    message: 'Please login to continue.',
                    action: () => navigate('/login')
                };
                
            default:
                return {
                    type: 'UNAUTHORIZED',
                    message: error.response?.data?.message || 'Authentication failed. Please login again.',
                    action: () => navigate('/login')
                };
        }
    }
    
    return {
        type: 'UNKNOWN',
        message: error.response?.data?.message || 'Authentication error',
        action: null
    };
};

// New utility for safe token extraction
export const getSafeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const validation = validateTokenFormat(token);
    return validation.valid ? validation.token : null;
};
