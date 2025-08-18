import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js';

/**
 * Utility to generate test tokens for development/testing
 */
class TokenGenerator {
  constructor() {
    this.accessTokenSecret = jwtConfig.accessTokenSecret;
    this.refreshTokenSecret = jwtConfig.refreshTokenSecret;
  }

  /**
   * Generate a valid access token with specified payload and expiry
   */
  generateAccessToken(payload, expiry = '2h') {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: expiry,
      algorithm: 'HS256'
    });
  }

  /**
   * Generate a valid refresh token with specified payload and expiry
   */
  generateRefreshToken(payload, expiry = '7d') {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: expiry,
      algorithm: 'HS256'
    });
  }

  /**
   * Generate test tokens for development/testing
   */
  generateTestTokens() {
    const now = Math.floor(Date.now() / 1000);
    const future = now + (24 * 60 * 60); // 24 hours from now
    
    const testUser = {
      userId: 'test-user-123',
      email: 'test@example.com',
      isAdmin: false,
      iat: now,
      exp: future
    };

    const adminUser = {
      userId: 'admin-user-456',
      email: 'admin@example.com',
      isAdmin: true,
      iat: now,
      exp: future
    };

    const expiredUser = {
      userId: 'expired-user-789',
      email: 'expired@example.com',
      isAdmin: false,
      iat: 1600000000, // 2020
      exp: 1600003600   // 2020
    };

    return {
      validAccessToken: this.generateAccessToken(testUser),
      validAdminToken: this.generateAccessToken(adminUser),
      validRefreshToken: this.generateRefreshToken({
        userId: testUser.userId,
        email: testUser.email,
        type: 'refresh'
      }),
      expiredAccessToken: this.generateAccessToken(expiredUser, '-1h'),
      malformedToken: 'invalid.token.format',
      emptyToken: ''
    };
  }

  /**
   * Generate tokens for specific test scenarios
   */
  generateScenarioTokens() {
    const now = Math.floor(Date.now() / 1000);
    
    return {
      // Valid tokens
      userToken: this.generateAccessToken({
        userId: 'user-123',
        email: 'user@example.com',
        isAdmin: false,
        iat: now,
        exp: now + (2 * 60 * 60) // 2 hours
      }),
      
      adminToken: this.generateAccessToken({
        userId: 'admin-456',
        email: 'admin@example.com',
        isAdmin: true,
        iat: now,
        exp: now + (2 * 60 * 60) // 2 hours
      }),
      
      refreshToken: this.generateRefreshToken({
        userId: 'user-123',
        email: 'user@example.com',
        type: 'refresh',
        iat: now,
        exp: now + (7 * 24 * 60 * 60) // 7 days
      }),
      
      // Special cases
      nearExpiryToken: this.generateAccessToken({
        userId: 'user-123',
        email: 'user@example.com',
        isAdmin: false,
        iat: now,
        exp: now + 300 // 5 minutes
      }),
      
      expiredToken: this.generateAccessToken({
        userId: 'user-123',
        email: 'user@example.com',
        isAdmin: false,
        iat: now - 3600,
        exp: now - 1800 // 30 minutes ago
      })
    };
  }
}

export default new TokenGenerator();
