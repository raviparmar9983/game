// src/api/axios.ts
import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';
import { environment } from './env';

const api = axios.create({
  baseURL: environment.API_URL,
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic error handler (no token refresh logic)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = new Error(
      error.response?.data?.message ?? error.message ?? 'Something went wrong',
    );

    if (status === 401) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'; // Add leading slash
      }
    }

    return Promise.reject(message);
  },
);

export { api };
