import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/auth.js';
import TokenManager from '../middleware/tokenManager.js';
import { loginUser, registerUser, adminLogin, refreshToken } from '../controllers/userController.js';

const router = express.Router();

// User login
router.post('/login', loginUser);

// Admin login
router.post('/admin', adminLogin);

// User registration
router.post('/register', registerUser);

// Refresh token
router.post('/refresh-token', refreshToken);

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Enhanced validate token endpoint with better error handling
router.post('/validate-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required',
        error: 'MISSING_TOKEN'
      });
    }

    // Clean and validate token format
    let cleanToken = token.trim();
    
    // Remove Bearer prefix if present
    if (cleanToken.startsWith('Bearer ')) {
      cleanToken = cleanToken.slice(7);
    }
    
    // Remove quotes and whitespace
    cleanToken = cleanToken.replace(/^["']|["']$/g, '').trim();
    
    if (!cleanToken || cleanToken.length < 10) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format',
        error: 'INVALID_FORMAT'
      });
    }

    // Verify token using TokenManager for consistency
    const decoded = TokenManager.verifyAccessToken(cleanToken);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({ 
      success: true, 
      valid: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
    } else if (error.message.includes('Invalid token') || error.message.includes('Invalid token format')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Token validation failed',
      error: 'VALIDATION_ERROR'
    });
  }
});

export default router;
