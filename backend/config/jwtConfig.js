import jwt from 'jsonwebtoken';

const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET || 'your-access-secret-key',
  refreshTokenSecret: process.env.REFRESH_SECRET || 'your-refresh-secret-key',
  accessTokenExpiry: '2h',
  refreshTokenExpiry: '7d',

  generateToken(payload, secret, expiry) {
    return jwt.sign(payload, secret, {
      expiresIn: expiry,
      algorithm: 'HS256'
    });
  },

  verifyToken(token, secret) {
    return jwt.verify(token, secret, {
      algorithms: ['HS256']
    });
  }
};

export default jwtConfig;
