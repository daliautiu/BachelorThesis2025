// 13. Services/api.js - API service to communicate with the backend
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.2:8080/api'; // For Android emulator
// const API_URL = 'http://localhost:8080/api'; // For iOS simulator

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Set 30 seconds timeout (in milliseconds)
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

// User services
export const userService = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
};

// Game services
export const gameService = {
  getGames: () => api.get('/games'),
  getGameDetails: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => api.post('/games', gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
};

// Assignment services
export const assignmentService = {
  getGameAssignments: () => api.get('/assignments'),
  createAssignment: (assignmentData) => api.post('/assignments', assignmentData),
  acceptAssignment: (id) => api.put(`/assignments/${id}/accept`),
  declineAssignment: (id) => api.put(`/assignments/${id}/decline`),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
};

// Availability services
export const refereeService = {
  getAvailability: () => api.get('/availability'),
  updateAvailability: (data) => api.put('/availability', data),
  getRefereeAvailability: (startDate, endDate) => 
    api.get(`/availability/referees?startDate=${startDate}&endDate=${endDate}`),
};

// Notification services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  createNotification: (notificationData) => api.post('/notifications', notificationData),
};

// Test connectivity
export const testApi = async () => {
  try {
    const response = await api.get('/test');
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;