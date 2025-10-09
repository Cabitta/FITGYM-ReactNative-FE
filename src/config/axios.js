import axios from 'axios';
import storage from '../utils/storage';
import tokenManager from '../utils/tokenManager';
import { Platform } from 'react-native';

// Configurar la URL base según la plataforma
const getBaseURL = () => {
  if (Platform.OS === 'web') {
    // Para web, usar localhost en lugar de 10.0.2.2
    return 'http://localhost:9090/api/';
  }
  // Para móvil, usar 10.0.2.2 (Android emulator) o localhost (iOS simulator)
  return Platform.OS === 'ios' ? 'http://localhost:9090/api/' : 'http://10.0.2.2:9090/api/';
};

// Configuración base de axios
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Si el request pide saltar auth, no agregar Authorization
      if (config?.headers?.['X-Skip-Auth'] || config?.skipAuth) {
        return config;
      }

      // Intentar primero obtener token desde el cache en memoria
      let token = tokenManager.getToken();
      if (!token) {
        token = await storage.getItem('access_token');
        // sincronizar cache
        if (token) tokenManager.setToken(token);
      }

      // Mostrar token parcialmente sólo en entorno de desarrollo
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        // eslint-disable-next-line no-console
        console.debug('[axios] Token obtenido para la solicitud:', token ? `${token.slice(0, 6)}...` : null);
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await storage.removeItem('access_token');
        await storage.removeItem('refresh_token');
        await storage.removeItem('user_data');
        // Aquí podrías navegar al login o mostrar un modal
      } catch (storageError) {
        console.error('Error al limpiar token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
