import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import TokenManager from "../middleware/tokenManager.js";

const createTokens = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET || 'fallback-secret-key')
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    // 3. Generate tokens using TokenManager
        const payload = { userId: user._id, email: user.email, isAdmin: false };
        const { accessToken, refreshToken } = TokenManager.generateTokens(payload);
        
        res.json({ 
            success: true, 
            accessToken, 
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Generate tokens using TokenManager
        const payload = { userId: user._id, email: user.email };
        const { accessToken, refreshToken } = TokenManager.generateTokens(payload);
        
        res.json({ 
            success: true, 
            accessToken, 
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin credentials are configured
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Admin credentials not configured" });
        }

        // Validate credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const payload = { userId: 'admin', email, isAdmin: true };
            const { accessToken, refreshToken } = TokenManager.generateTokens(payload);
            
            res.json({ 
                success: true, 
                accessToken, 
                refreshToken, 
                message: "Admin login successful",
                user: {
                    email,
                    isAdmin: true
                }
            });
        } else {
            return res.json({ success: false, message: "Admin not found" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.json({ success: false, message: "Refresh token is required" });
        }

        // Verify refresh token and generate new access token
        const decoded = TokenManager.verifyRefreshToken(refreshToken);
        const newAccessToken = TokenManager.refreshAccessToken(refreshToken);

        res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, refreshToken };
