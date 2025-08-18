// Centralized authentication manager to fix 401 errors
import axios from 'axios';
import { fixTokenFormat, validateAndFixToken, checkTokenHealth } from './tokenFix';

class AuthManager {
    constructor() {
        this.backendUrl = 'http://localhost:4000';
        this.setupInterceptors();
    }

    // Get clean token
    getToken() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const validation = validateAndFixToken(token);
        if (!validation.valid) {
            console.warn('Token validation failed:', validation.error);
            this.logout();
            return null;
        }
        return validation.token;
    }

    // Setup axios interceptors
    setupInterceptors() {
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

        // Response interceptor for token refresh
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await this.refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        this.logout();
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Refresh token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return null;

        try {
            const response = await axios.post(`${this.backendUrl}/api/user/refresh-token`, {
                refreshToken: fixTokenFormat(refreshToken)
            });

            if (response.data.success) {
                const newToken = response.data.accessToken;
                localStorage.setItem('token', newToken);
                return newToken;
            }
        } catch (error) {
            console.error('Refresh token failed:', error);
            return null;
        }
    }

    // Login
    async login(email, password) {
        try {
            const response = await axios.post(`${this.backendUrl}/api/user/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token, refreshToken } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                return { success: true, token };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }

    // Check if user is authenticated
    async isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        return await checkTokenHealth(this.backendUrl, token);
    }
}

// Create singleton instance
const authManager = new AuthManager();
export default authManager;
