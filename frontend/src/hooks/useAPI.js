import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle expired tokens gracefully
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Only redirect to home if it's a 401 AND there's a stored token (i.e., session expired)
  if (error.response && error.response.status === 401) {
    const hasToken = localStorage.getItem('token');
    if (hasToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }
  return Promise.reject(error);
});

// --- API Endpoints ---
export const getDashboard = () => api.get('/api/dashboard');
export const getTopGenres = (limit = 10) => api.get(`/api/genres/top?limit=${limit}`);
export const searchTracks = (params) => {
  // Map frontend-friendly param names to what the backend actually expects
  const mapped = { ...params };
  if (mapped.limit !== undefined) {
    mapped.page_size = mapped.limit;
    delete mapped.limit;
  }
  if (mapped.sort_desc !== undefined) {
    mapped.sort_dir = mapped.sort_desc ? 'desc' : 'asc';
    delete mapped.sort_desc;
  }
  if (mapped.skip !== undefined) {
    mapped.page = Math.floor(mapped.skip / (mapped.page_size || 20)) + 1;
    delete mapped.skip;
  }
  return api.get('/api/tracks/search', { params: mapped });
};
export const predictPopularity = (features) => api.post('/api/predict', features);
export const getRecommendations = (trackId) => api.get(`/api/recommendations/${trackId}`);
export const getPopularityDistribution = () => api.get('/api/analytics/popularity-distribution');
export const getFeatureTrends = () => api.get('/api/analytics/feature-trends');
export const getTopTracks = () => api.get('/api/analytics/top-tracks');

export const login = (formData) => api.post('/api/auth/login', formData, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
export const register = (userData) => api.post('/api/auth/register', userData);

export default api;
