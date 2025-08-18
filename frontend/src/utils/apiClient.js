import axios from 'axios';
import authManager from './authManager';
import { toast } from 'react-toastify';

class ApiClient {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        // Ensure baseURL doesn't end with a slash
        this.baseURL = this.baseURL.replace(/\/+$/, '');
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor to add auth token
        axios.interceptors.request.use(
            (config) => {
                const token = authManager.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await authManager.refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        authManager.logout();
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        try {
            const response = await axios.get(this.baseURL + url, config);
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async post(url, data = {}, config = {}) {
        try {
            const response = await axios.post(this.baseURL + url, data, config);
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async put(url, data = {}, config = {}) {
        try {
            const response = await axios.put(this.baseURL + url, data, config);
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await axios.delete(this.baseURL + url, config);
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    handleError(error) {
        if (error.response?.status === 401) {
            toast.error('Authentication failed. Please login again.');
        } else if (error.response?.status === 403) {
            toast.error('Access denied. Please login with proper credentials.');
        } else {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    }
}

const apiClient = new ApiClient();
export default apiClient;
