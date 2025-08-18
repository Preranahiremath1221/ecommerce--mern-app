import express from 'express';
import TokenManager from '../middleware/tokenManager.js';
import TokenDebugger from '../debug/tokenDebugger.js';

const router = express.Router();

/**
 * POST /api/token/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        error: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Validate refresh token format
    const formatValidation = TokenManager.cleanToken(refreshToken);
    
    // Generate new access token
    const newAccessToken = TokenManager.refreshAccessToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });

  } catch (error) {
    let statusCode = 401;
    let errorCode = 'REFRESH_FAILED';

    if (error.message.includes('expired')) {
      statusCode = 401;
      errorCode = 'REFRESH_TOKEN_EXPIRED';
    } else if (error.message.includes('Invalid')) {
      statusCode = 401;
      errorCode = 'INVALID_REFRESH_TOKEN';
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
      error: errorCode
    });
  }
});

/**
 * POST /api/token/introspect
 * Introspect token details (for debugging)
 */
router.post('/introspect', async (req, res) => {
  try {
    const { token, tokenType = 'access' } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
        error: 'MISSING_TOKEN'
      });
    }

    const introspection = TokenDebugger.introspectToken(token, tokenType);
    
    res.json({
      success: true,
      data: introspection
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: 'INTROSPECTION_FAILED'
    });
  }
});

/**
 * POST /api/token/validate
 * Validate token health
 */
router.post('/validate', async (req, res) => {
  try {
    const { token, tokenType = 'access' } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
        error: 'MISSING_TOKEN'
      });
    }

    const healthReport = TokenDebugger.checkTokenHealth(token, tokenType);
    
    res.json({
      success: true,
      data: healthReport
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: 'VALIDATION_FAILED'
    });
  }
});

/**
 * POST /api/token/debug
 * Comprehensive token debugging
 */
router.post('/debug', async (req, res) => {
  try {
    const { token, tokenType = 'access' } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
        error: 'MISSING_TOKEN'
      });
    }

    const analysis = TokenDebugger.analyzeToken(token, tokenType);
    
    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: 'DEBUG_FAILED'
    });
  }
});

export default router;
