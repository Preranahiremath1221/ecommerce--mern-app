// Test 1: Clean token format
export const validateTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return {
      valid: false,
      error: 'Invalid token format - must have 3 parts separated by dots',
      action: 'login'
    };
  }

  // Clean the token
  let cleanToken = token.trim();

  // Split into parts
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      error: 'Invalid token format - must have 3 parts separated by dots',
      action: 'login'
    };
  }

  // Check each part is base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9\-_]+$/;
  for (const part of parts) {
    if (!base64UrlRegex.test(part) || part.length < 1) {
      return {
        valid: false,
        error: 'Invalid token encoding',
        action: 'login'
      };
    }
  }

  return {
    valid: true,
    token: cleanToken
  };
};

// Test 2: Validate JWT structure
export const validateJWTStructure = (token) => {
  try {
    const parts = token.split('.');
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

    // Check required JWT claims
    const requiredClaims = ['iat', 'exp'];
    for (const claim of requiredClaims) {
      if (!payload[claim]) {
        return {
          valid: false,
          error: `Missing required claim: ${claim}`,
          action: 'login'
        };
      }
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return {
        valid: false,
        error: 'Token expired',
        action: 'login'
      };
    }

    return {
      valid: true,
      header,
      payload
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JWT structure',
      action: 'login'
    };
  }
};

// Test 3: Test with sample tokens
const testTokens = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMzYwMH0.signature',
  'invalid.token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..',
  '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMzYwMH0.signature  '
];

console.log('Testing JWT token validation...');
testTokens.forEach((token, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log('Token:', token);
  
  const formatResult = validateTokenFormat(token);
  console.log('Format validation:', formatResult);
  
  if (formatResult.valid) {
    const structureResult = validateJWTStructure(formatResult.token);
    console.log('Structure validation:', structureResult);
  }
});

console.log('\nAll tests completed!');
