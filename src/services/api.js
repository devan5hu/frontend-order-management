import axios from 'axios';
import AuthService from '../utils/authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = `application/json`
  config.headers['Content-Type'] = `application/json`
  return config;
});

export default api;