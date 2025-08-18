import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js';

/**
 * Enhanced debugging utility for JWT token issues
 */
class TokenDebugger {
  constructor() {
    this.accessTokenSecret = jwtConfig.accessTokenSecret;
    this.refreshTokenSecret = jwtConfig.refreshTokenSecret;
  }

  /**
   * Comprehensive token analysis with detailed debugging information
   */
  analyzeToken(token, tokenType = 'access') {
    const analysis = {
      token: token,
      isValid: false,
      errors: [],
      warnings: [],
      details: {},
      recommendations: []
    };

    if (!token || typeof token !== 'string') {
      analysis.errors.push('No token provided or invalid type');
      return analysis;
    }

    // Clean token
    let cleanToken = token.trim();
    if (cleanToken.startsWith('Bearer ')) {
      cleanToken = cleanToken.slice(7);
    }
    cleanToken = cleanToken.replace(/\s+/g, '');

    // Basic format check
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      analysis.errors.push('Invalid token format - must have 3 parts separated by dots');
      return analysis;
    }

    // Base64url validation
    const base64UrlRegex = /^[A-Za-z0-9\-_]+$/;
    for (const part of parts) {
      if (!base64UrlRegex.test(part) || part.length < 1) {
        analysis.errors.push('Invalid base64url encoding in token parts');
        return analysis;
      }
    }

    try {
      // Decode header and payload
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

      analysis.details = {
        header,
        payload,
        signature: parts[2],
        tokenLength: cleanToken.length,
        partsLength: parts.map(p => p.length)
      };

      // Check token type
      if (header.alg !== 'HS256') {
        analysis.warnings.push('Token uses non-standard algorithm');
      }

      // Check required claims
      const now = Math.floor(Date.now() / 1000);
      const requiredClaims = ['iat', 'exp'];
      for (const claim of requiredClaims) {
        if (!payload[claim]) {
          analysis.errors.push(`Missing required claim: ${claim}`);
        }
      }

      // Check expiration
      if (payload.exp) {
        const timeLeft = payload.exp - now;
        if (timeLeft < 0) {
          analysis.errors.push(`Token expired ${Math.abs(timeLeft)} seconds ago`);
        } else if (timeLeft < 300) { // 5 minutes
          analysis.warnings.push(`Token expires in ${timeLeft} seconds`);
        } else {
          analysis.details.timeLeft = timeLeft;
        }
      }

      // Check issued at time
      if (payload.iat && payload.iat > now + 60) {
        analysis.warnings.push('Token issued in the future');
      }

      // Check issuer
      if (payload.iss) {
        analysis.details.issuer = payload.iss;
      }

      // Check audience
      if (payload.aud) {
        analysis.details.audience = payload.aud;
      }

      // Check subject
      if (payload.sub) {
        analysis.details.subject = payload.sub;
      }

      // Verify signature
      try {
        const secret = tokenType === 'refresh' ? this.refreshTokenSecret : this.accessTokenSecret;
        jwt.verify(cleanToken, secret);
        analysis.isValid = true;
      } catch (verifyError) {
        if (verifyError.name === 'TokenExpiredError') {
          analysis.errors.push('Token signature verification failed - expired');
        } else if (verifyError.name === 'JsonWebTokenError') {
          analysis.errors.push('Token signature verification failed - invalid signature');
        } else {
          analysis.errors.push(`Token verification error: ${verifyError.message}`);
        }
      }

      // Generate recommendations
      if (analysis.warnings.length > 0) {
        analysis.recommendations.push('Consider token refresh');
      }

      if (analysis.errors.length === 0 && analysis.warnings.length === 0) {
        analysis.recommendations.push('Token is healthy');
      }

    } catch (error) {
      analysis.errors.push(`Token parsing error: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Check token health and provide recommendations
   */
  checkTokenHealth(token, tokenType = 'access') {
    const analysis = this.analyzeToken(token, tokenType);
    
    const healthReport = {
      healthy: analysis.isValid && analysis.errors.length === 0,
      score: 100,
      issues: [],
      recommendations: analysis.recommendations
    };

    // Calculate health score
    healthReport.score -= analysis.errors.length * 25;
    healthReport.score -= analysis.warnings.length * 10;
    healthReport.score = Math.max(0, healthReport.score);

    // Categorize issues
    analysis.errors.forEach(error => {
      healthReport.issues.push({ type: 'error', message: error });
    });

    analysis.warnings.forEach(warning => {
      healthReport.issues.push({ type: 'warning', message: warning });
    });

    return healthReport;
  }

  /**
   * Generate debugging report for multiple tokens
   */
  generateReport(tokens, tokenType = 'access') {
    const report = {
      timestamp: new Date().toISOString(),
      tokens: [],
      summary: {
        total: tokens.length,
        valid: 0,
        invalid: 0,
        warnings: 0
      }
    };

    tokens.forEach(token => {
      const analysis = this.analyzeToken(token, tokenType);
      report.tokens.push(analysis);
      
      if (analysis.isValid) {
        report.summary.valid++;
      } else {
        report.summary.invalid++;
      }
      
      report.summary.warnings += analysis.warnings.length;
    });

    return report;
  }

  /**
   * Token introspection endpoint data
   */
  introspectToken(token, tokenType = 'access') {
    const analysis = this.analyzeToken(token, tokenType);
    
    if (!analysis.isValid) {
      return {
        active: false,
        error: analysis.errors[0] || 'Invalid token'
      };
    }

    return {
      active: true,
      exp: analysis.details.payload.exp,
      iat: analysis.details.payload.iat,
      iss: analysis.details.payload.iss,
      aud: analysis.details.payload.aud,
      sub: analysis.details.payload.sub,
      userId: analysis.details.payload.userId,
      email: analysis.details.payload.email,
      isAdmin: analysis.details.payload.isAdmin,
      scope: analysis.details.payload.scope || 'user'
    };
  }
}

export default new TokenDebugger();
