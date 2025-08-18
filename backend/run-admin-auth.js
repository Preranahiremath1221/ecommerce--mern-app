// Run adminAuth with actual token
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Create a valid admin token
const adminEmail = 'admin@forever.com';
const adminPassword = 'qwerty123';
const token = jwt.sign(adminEmail + adminPassword, process.env.JWT_SECRET || 'default_secret');

console.log('=== AdminAuth Token Test ===');
console.log('Admin Email:', adminEmail);
console.log('Admin Token:', token);
console.log('');

// Test the adminAuth middleware
const testAdminAuth = () => {
    const adminAuth = async (token) => {
        try {
            if (!token) {
                return { success: false, message: "Not Authorized Login Again" };
            }
            
            const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
            const expected = adminEmail + adminPassword;
            
            if (token_decode === expected) {
                return { success: true, message: "Admin authenticated successfully" };
            } else {
                return { success: false, message: "Not Authorized Login Again" };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Test with valid token
    console.log('Testing with valid admin token...');
    const result = adminAuth(token);
    console.log('Result:', result);
    
    // Test with invalid token
    console.log('\nTesting with invalid token...');
    const invalidResult = adminAuth('invalid_token_here');
    console.log('Result:', invalidResult);
    
    return token;
};

const validToken = testAdminAuth();
console.log('\n=== Token Ready for API Testing ===');
console.log('Use this token in your API calls:');
console.log('Token:', validToken);
