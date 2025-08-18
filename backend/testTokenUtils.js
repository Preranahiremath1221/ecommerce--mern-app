/**
 * Backend test utilities for JWT token testing
 * Run with: node testTokenUtils.js
 */

import jwt from 'jsonwebtoken';
import jwtConfig from './config/jwtConfig.js';
import TokenDebugger from './debug/tokenDebugger.js';

// Test configuration
const { accessTokenSecret, refreshTokenSecret } = jwtConfig;

// Test tokens - these are example tokens for testing
const testAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDM2MDB9.dGhpcyBpcyBhIHRlc3QgdG9rZW4';
const testRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAzNjAwfQ.dGhpcyBpcyBhIHRlc3QgcmVmcmVzaCB0b2tlbg';

/**
 * Generate a valid test token
 */
export function generateTestToken(payload = {}, type = 'access') {
  const secret = type === 'refresh' ? refreshTokenSecret : accessTokenSecret;
  const expiresIn = type === 'refresh' ? '7d' : '1h';
  
  const defaultPayload = {
    userId: '123456',
    email: 'test@example.com',
    isAdmin: false,
    iat: Math.floor(Date.now() / 1000)
    // Remove exp from default payload since we're using expiresIn option
  };
  
  return jwt.sign({ ...defaultPayload, ...payload }, secret, { expiresIn });
}

/**
 * Test token validation
 */
export function testTokenValidation() {
  console.log('=== Token Validation Tests ===\n');
  
  // Test 1: Valid token
  const validToken = generateTestToken();
  console.log('1. Valid token:', TokenDebugger.analyzeToken(validToken));
  
  // Test 2: Expired token
  const expiredToken = jwt.sign(
    { userId: '123', exp: Math.floor(Date.now() / 1000) - 3600 },
    accessTokenSecret
  );
  console.log('2. Expired token:', TokenDebugger.analyzeToken(expiredToken));
  
  // Test 3: Invalid format
  console.log('3. Invalid format:', TokenDebugger.analyzeToken('invalid.token.format'));
  
  // Test 4: Wrong signature
  const wrongSigToken = jwt.sign({ userId: '123' }, 'wrong-secret');
  console.log('4. Wrong signature:', TokenDebugger.analyzeToken(wrongSigToken));
}

/**
 * Test token generation for different scenarios
 */
export function testTokenGeneration() {
  console.log('=== Token Generation Tests ===\n');
  
  // Test 1: Regular user token
  const userToken = generateTestToken({ userId: 'user123', email: 'user@test.com', isAdmin: false });
  console.log('1. User token:', TokenDebugger.analyzeToken(userToken));
  
  // Test 2: Admin token
  const adminToken = generateTestToken({ userId: 'admin123', email: 'admin@test.com', isAdmin: true });
  console.log('2. Admin token:', TokenDebugger.analyzeToken(adminToken));
  
  // Test 3: Refresh token
  const refreshToken = generateTestToken({ userId: 'user123' }, 'refresh');
  console.log('3. Refresh token:', TokenDebugger.analyzeToken(refreshToken, 'refresh'));
}

/**
 * Test token introspection
 */
export function testTokenIntrospection() {
  console.log('=== Token Introspection Tests ===\n');
  
  const token = generateTestToken({ userId: 'test123', email: 'test@test.com' });
  const introspection = TokenDebugger.introspectToken(token);
  console.log('Token introspection:', introspection);
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('Starting comprehensive token tests...\n');
  
  testTokenValidation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  testTokenGeneration();
  console.log('\n' + '='.repeat(50) + '\n');
  
  testTokenIntrospection();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('All tests completed!');
}

/**
 * Export for use in other modules
 */
export default {
  generateTestToken,
  testTokenValidation,
  testTokenGeneration,
  testTokenIntrospection,
  runAllTests
};



// Run automatically when executed directly with Node
// Always run tests when executed directly
console.log("Running all token utility tests...\n");
runAllTests();

