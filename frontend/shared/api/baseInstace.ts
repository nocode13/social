import axios from 'axios';
import { authStorageService } from '../lib/auth-storage';

export const baseInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

baseInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = authStorageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
