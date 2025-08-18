import jwt from 'jsonwebtoken';
import TokenManager from './tokenManager.js';

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.',
                error: 'NO_TOKEN',
                details: 'Authorization header is missing'
            });
        }

        // Handle both Bearer and direct token formats
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }

        // Clean and validate token
        try {
            token = TokenManager.cleanToken(token);
        } catch (cleanError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Please login again.',
                error: 'INVALID_TOKEN_FORMAT',
                details: cleanError.message
            });
        }

        // Verify token using TokenManager
        const decoded = TokenManager.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        let errorMessage = 'Invalid token format. Please login again.';
        let errorCode = 'INVALID_TOKEN';
        let details = error.message;
        
        if (error.message.includes('expired')) {
            errorMessage = 'Token has expired. Please login again.';
            errorCode = 'TOKEN_EXPIRED';
            details = error.message;
        } else if (error.message.includes('Invalid token')) {
            errorMessage = 'Invalid token format. Please login again.';
            errorCode = 'JWT_ERROR';
            details = error.message;
        }
        
        return res.status(401).json({ 
            success: false, 
            message: errorMessage,
            error: errorCode,
            details
        });
    }
};

export default authUser;
