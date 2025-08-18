// Simple test script to verify authentication endpoints
import axios from 'axios';

const backendUrl = 'http://localhost:4000';

async function testAuthentication() {
    console.log('🧪 Testing Authentication Endpoints...\n');
    
    try {
        // Test 1: User Registration
        console.log('1. Testing User Registration...');
        const registerResponse = await axios.post(`${backendUrl}/api/user/register`, {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'TestPass123'
        });
        console.log('✅ Registration Response:', registerResponse.data);
        
        // Test 2: User Login
        console.log('\n2. Testing User Login...');
        const loginResponse = await axios.post(`${backendUrl}/api/user/login`, {
            email: 'testuser@example.com',
            password: 'TestPass123'
        });
        console.log('✅ Login Response:', loginResponse.data);
        
        if (loginResponse.data.success) {
            const token = loginResponse.data.accessToken;
            
            // Test 3: Protected Route Access
            console.log('\n3. Testing Protected Route...');
            const protectedResponse = await axios.post(`${backendUrl}/api/cart/get`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Protected Route Response:', protectedResponse.data);
            
            // Test 4: Token Refresh
            console.log('\n4. Testing Token Refresh...');
            const refreshResponse = await axios.post(`${backendUrl}/api/user/refresh-token`, {
                refreshToken: loginResponse.data.refreshToken
            });
            console.log('✅ Token Refresh Response:', refreshResponse.data);
            
            console.log('\n🎉 All authentication tests passed!');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAuthentication();
