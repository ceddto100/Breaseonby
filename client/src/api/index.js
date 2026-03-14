import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('uncovered_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Videos
export const getVideos = (params) => API.get('/api/videos', { params });
export const getFeaturedVideos = () => API.get('/api/videos/featured');
export const getPopularVideos = () => API.get('/api/videos/popular');
export const getVideo = (id) => API.get(`/api/videos/${id}`);
export const createVideo = (data) => API.post('/api/videos', data);
export const updateVideo = (id, data) => API.put(`/api/videos/${id}`, data);
export const deleteVideo = (id) => API.delete(`/api/videos/${id}`);

// Admin
export const adminLogin = (credentials) => API.post('/api/admin/login', credentials);
export const getAdminStats = () => API.get('/api/admin/stats');

// Auth
export const getAuthUser = () => API.get('/api/auth/me');

// Subscribe (email-based)
export const subscribe = (email) => API.post('/api/subscribe', { email });

// Subscribers (user-based)
export const getSubscribers = () => API.get('/api/subscribers');
export const getSubscriberCount = () => API.get('/api/subscribers/count');
export const removeSubscriber = (id) => API.delete(`/api/subscribers/${id}`);
export const exportSubscribers = () =>
  API.get('/api/subscribers/export', { responseType: 'blob' });

// Settings
export const getSettings = () => API.get('/api/settings');
export const updateSettings = (data) => API.patch('/api/settings', data);

// Upload
export const uploadVideoFile = (formData, onProgress) =>
  API.post('/api/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  });

export const uploadThumbnail = (formData) =>
  API.post('/api/upload/thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default API;
