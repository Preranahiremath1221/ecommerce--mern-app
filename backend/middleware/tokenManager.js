import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js';

class TokenManager {
  constructor() {
    this.accessTokenSecret = jwtConfig.accessTokenSecret;
    this.refreshTokenSecret = jwtConfig.refreshTokenSecret;
    this.accessTokenExpiry = jwtConfig.accessTokenExpiry;
    this.refreshTokenExpiry = jwtConfig.refreshTokenExpiry;
  }

  generateTokens(payload) {
    const accessToken = jwtConfig.generateToken(
      payload, 
      this.accessTokenSecret, 
      this.accessTokenExpiry
    );

    const refreshToken = jwtConfig.generateToken(
      { 
        userId: payload.userId, 
        email: payload.email, 
        type: 'refresh',
        isAdmin: payload.isAdmin || false 
      },
      this.refreshTokenSecret,
      this.refreshTokenExpiry
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      // Clean token before verification
      const cleanToken = this.cleanToken(token);
      return jwtConfig.verifyToken(cleanToken, this.accessTokenSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token) {
    try {
      const cleanToken = this.cleanToken(token);
      return jwtConfig.verifyToken(cleanToken, this.refreshTokenSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      
      // Generate new access token
      const newAccessToken = jwtConfig.generateToken(
        { 
          userId: decoded.userId, 
          email: decoded.email, 
          isAdmin: decoded.isAdmin || false 
        },
        this.accessTokenSecret,
        this.accessTokenExpiry
      );
      
      return newAccessToken;
    } catch (error) {
      throw new Error('Unable to refresh token');
    }
  }

  generateLongLivedToken(payload, expiry = '24h') {
    return jwtConfig.generateToken(payload, this.accessTokenSecret, expiry);
  }

  // Clean token by removing whitespace and invalid characters
  cleanToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
    
    // Remove Bearer prefix if present
    let cleanToken = token.trim();
    if (cleanToken.startsWith('Bearer ')) {
      cleanToken = cleanToken.slice(7);
    }
    
    // Remove any whitespace or invalid characters
    cleanToken = cleanToken.replace(/\s+/g, '');
    
    // Validate basic JWT format (header.payload.signature)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    return cleanToken;
  }
}

export default new TokenManager();
