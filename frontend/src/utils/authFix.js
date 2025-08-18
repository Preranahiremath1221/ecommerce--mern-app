// Enhanced authentication manager to fix collection page issues
import axios from 'axios';
import { fixTokenFormat, validateAndFixToken } from './tokenFix';

class AuthFixManager {
    constructor() {
        this.backendUrl = 'http://localhost:4000';
        this.isInitialized = false;
        this.setupEnhancedInterceptors();
    }

    // Enhanced token storage with better error handling
    storeToken(token) {
        try {
            const validation = validateAndFixToken(token);
            if (validation.valid) {
                localStorage.setItem('token', validation.token);
                localStorage.setItem('token_timestamp', Date.now().toString());
                return validation.token;
            }
            return null;
        } catch (error) {
            console.error('Token storage error:', error);
            return null;
        }
    }

    // Get token with validation
    getToken() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const validation = validateAndFixToken(token);
            if (!validation.valid) {
                console.warn('Invalid token detected, clearing...');
                this.clearAuth();
                return null;
            }
            return validation.token;
        } catch (error) {
            console.error('Token retrieval error:', error);
            return null;
        }
    }

    // Enhanced interceptors for better error handling
    setupEnhancedInterceptors() {
        // Request interceptor
        axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor with better error handling
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Check if it's a token expiration
                    if (error.response.data?.error === 'TOKEN_EXPIRED') {
                        try {
                            const newToken = await this.refreshToken();
                            if (newToken) {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                return axios(originalRequest);
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                            this.clearAuth();
                        }
                    } else {
                        // Other 401 errors - clear auth
                        this.clearAuth();
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Enhanced refresh token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return null;

        try {
            const response = await axios.post(`${this.backendUrl}/api/user/refresh-token`, {
                refreshToken: fixTokenFormat(refreshToken)
            });

            if (response.data.success) {
                const newToken = response.data.accessToken;
                this.storeToken(newToken);
                return newToken;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }

    // Check if user is authenticated with enhanced validation
    async isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const response = await axios.post(`${this.backendUrl}/api/user/validate-token`, {
                token
            });
            return response.data.success;
        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    }

    // Clear authentication
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token_timestamp');
    }

    // Initialize authentication on app load
    async initializeAuth() {
        if (this.isInitialized) return;

        const token = this.getToken();
        if (token) {
            const isValid = await this.isAuthenticated();
            if (!isValid) {
                this.clearAuth();
            }
        }
        this.isInitialized = true;
    }
}

// Create singleton instance
const authFixManager = new AuthFixManager();
export default authFixManager;
