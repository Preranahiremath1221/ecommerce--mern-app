import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Store tokens
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Get access token
  getAccessToken() {
    return this.accessToken;
  }

  // Get refresh token
  getRefreshToken() {
    return this.refreshToken;
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Check if token is expired
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  // Check if user is authenticated (has valid tokens)
  isAuthenticated() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      return false;
    }
    
    // Check if access token is expired
    if (this.isTokenExpired(accessToken)) {
      // If refresh token is also expired, user needs to login again
      if (this.isTokenExpired(refreshToken)) {
        this.clearTokens();
        return false;
      }
    }
    
    return true;
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/api/user/refresh-token`, {
        refreshToken
      });

      const { accessToken } = response.data;
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);
      
      return accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Setup axios interceptor for automatic token refresh
  setupAxiosInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isTokenExpired(this.getAccessToken())) {
            try {
              const newAccessToken = await this.refreshAccessToken();
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export default new TokenManager();
