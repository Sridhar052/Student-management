import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studenthub_token');
    // Only send Authorization header if token is a valid JWT (not local demo token)
    if (token && !token.startsWith('demo-')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const token = localStorage.getItem('studenthub_token');
    if (error.response && error.response.status === 401) {
      // Only clear session if user was using a real backend token
      if (token && !token.startsWith('demo-')) {
        localStorage.removeItem('studenthub_token');
        localStorage.removeItem('studenthub_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(
      error.response?.data?.message || error.message || 'An error occurred'
    );
  }
);

export default api;
