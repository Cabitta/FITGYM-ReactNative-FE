import axios from 'axios';
import storage from '../utils/storage';
import tokenManager from '../utils/tokenManager';
import { Platform } from 'react-native';
import AuthService from '../auth/services/authService';

export const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:9090/api/';
  }
  return Platform.OS === 'ios'
    ? 'http://localhost:9090/api/'
   // : 'http://10.0.2.2:9090/api/';
    :'http://192.168.100.7:9090/api/';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------
// INTERCEPTOR REQUEST
// ---------------------------
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config?.headers?.['X-Skip-Auth'] || config?.skipAuth) {
      return config;
    }

    try {
      let tokenM = tokenManager.getToken();
      if (!tokenM) {
       let token = await storage.getItem('access_token');
        if (token) tokenManager.setToken(token);
      }
      if (tokenM) {
        config.headers.Authorization = `Bearer ${tokenM}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------
// INTERCEPTOR RESPONSE
// ---------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ Importante: verificar 401 o 403
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Esperar a que termine el refresh actual
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResult = await AuthService.refreshToken();

        if (!refreshResult.success) {
          throw new Error(refreshResult.error || 'Error al refrescar token');
        }

        const { access_token } = refreshResult;

        processQueue(null, access_token);
        isRefreshing = false;

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        console.error('❌ Falló el refresh:', refreshError);

        // Si falla, limpiar sesión
        await AuthService.logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
