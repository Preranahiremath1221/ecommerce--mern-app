// Fixed test script to verify authentication endpoints
import axios from 'axios';

const backendUrl = 'http://localhost:4000';

async function testLogin() {
    console.log('🧪 Testing Login and Token Validation...\n');
    
    try {
        // Test 1: User Login
        console.log('1. Testing User Login...');
        const loginResponse = await axios.post(`${backendUrl}/api/user/login`, {
            email: 'testuser@example.com',
            password: 'TestPass123'
        });
        
        if (loginResponse.data.success) {
            const token = loginResponse.data.accessToken;
            console.log('✅ Login successful! Token received:', token.substring(0, 50) + '...');
            
            // Test 2: Verify token format
            console.log('\n2. Testing token format...');
            console.log('Token format check:', token.split('.').length === 3 ? '✅ Valid JWT format' : '❌ Invalid JWT format');
            
            // Test 3: Test with correct Authorization header
            console.log('\n3. Testing protected route with Bearer token...');
            const protectedResponse = await axios.post(`${backendUrl}/api/cart/get`, {}, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Protected route response:', protectedResponse.data);
            
            console.log('\n🎉 Login successful! You are now authenticated.');
            console.log('Your access token:', token);
            
        } else {
            console.log('❌ Login failed:', loginResponse.data.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.data?.error === 'INVALID_TOKEN') {
            console.log('💡 Suggestion: Try logging in again to get a fresh token');
        }
    }
}

testLogin();
