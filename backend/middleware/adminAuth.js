import jwt from 'jsonwebtoken'
import TokenManager from './tokenManager.js'

const adminAuth = async (req,res,next) => {
    try {
        // Handle both formats: "Bearer <token>" and just "<token>"
        let token = req.headers.token || req.headers.authorization;
        
        if (!token) {
            console.log("No token provided in headers");
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        // Remove "Bearer " prefix if present
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        
        console.log("Token received:", token.substring(0, 20) + "...");
        
        try {
            // Try to verify the token
            const token_decode = TokenManager.verifyAccessToken(token);
            console.log("Token decoded successfully:", token_decode);
            
            if (!token_decode.isAdmin){
                console.log("Token is not admin");
                return res.json({success:false,message:"Not Authorized Login Again"})
            }
            
            // Add user info to request for downstream use
            req.user = token_decode;
            next()
            
        } catch (error) {
            console.log("Token verification failed:", error.message);
            
            if (error.message === 'Token expired') {
                return res.json({
                    success: false, 
                    message: "Token expired - please use refresh token endpoint",
                    code: "TOKEN_EXPIRED"
                })
            }
            
            return res.json({
                success: false, 
                message: "Invalid token - please login again",
                code: "INVALID_TOKEN"
            })
        }
        
    } catch (error) {
        console.log("Token verification error:", error);
        res.json({success:false,message:error.message})
    }
}

export default adminAuth
