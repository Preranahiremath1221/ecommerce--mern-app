import axios from 'axios';
import { validateAndFixToken, fixTokenFormat } from './tokenFix';

// Create a new axios instance for API calls
const api = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            const cleanToken = fixTokenFormat(token);
            if (cleanToken) {
                config.headers.Authorization = `Bearer ${cleanToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:4000/api/user/refresh-token', {
                        refreshToken: fixTokenFormat(refreshToken)
                    });
                    
                    if (response.data.success) {
                        const newToken = response.data.accessToken;
                        localStorage.setItem('token', newToken);
                        
                        // Retry original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }

            // If refresh fails, logout
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
