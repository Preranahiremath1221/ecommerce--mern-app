// Debug utility to check token format and environment variables
import jwt from 'jsonwebtoken'

const debugToken = (token) => {
    try {
        console.log('=== TOKEN DEBUG ===')
        console.log('Token received:', token)
        console.log('JWT_SECRET:', process.env.JWT_SECRET)
        
        // Check if token is valid JWT format
        const parts = token.split('.')
        if (parts.length !== 3) {
            console.log('ERROR: Not a valid JWT format')
            return false
        }
        
        // Try to decode header
        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
        console.log('Token header:', header)
        
        // Try to decode payload
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        console.log('Token payload:', payload)
        
        // Check expiry
        if (payload.exp) {
            const expiry = new Date(payload.exp * 1000)
            console.log('Token expires:', expiry)
            console.log('Current time:', new Date())
        }
        
        return true
    } catch (error) {
        console.log('Token debug error:', error.message)
        return false
    }
}

export default debugToken
