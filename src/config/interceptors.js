import axiosInstance from './axios';
import storage from '../utils/storage';
import tokenManager from '../utils/tokenManager';
import { clearSession } from '../utils/sesionManager';

// ---------------------------------------------------------------------------
// 🔄 Helper interno: refreshAccessToken()
// ---------------------------------------------------------------------------
async function refreshAccessToken() {
  try {
    const refreshToken = await storage.getItem('access_token');
    if (!refreshToken) {
      console.warn('No refresh token found.');
      return { success: false, error: 'No hay token de refresco' };
    }
    const response = await axiosInstance.post('/auth/refresh', {
      refreshToken: refreshToken,
    });
    console.log('Token refresh response:', response.data);
    const {
      access_token,
      refresh_token: newRefresh,
      user_Id,
      username,
      email,
    } = response.data;

    await storage.setItem('access_token', access_token);
    await storage.setItem('refresh_token', newRefresh);
    await storage.setItem(
      'user_data',
      JSON.stringify({ id: user_Id, username, email })
    );

    tokenManager.setToken(access_token);

    return {
      success: true,
      access_token,
      refresh_token: newRefresh,
      user: { id: user_Id, username, email },
    };
  } catch (error) {
    console.error('Error al refrescar token:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al refrescar el token',
    };
  }
}

// ---------------------------------------------------------------------------
// 🧩 Interceptor de REQUEST
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  async config => {
    if (config?.headers?.['X-Skip-Auth'] || config?.skipAuth) {
      return config;
    }

    try {
      let tokenM = tokenManager.getToken();
      if (!tokenM) {
        const token = await storage.getItem('access_token');
        if (token) tokenManager.setToken(token);
        tokenM = token;
      }
      if (tokenM) {
        config.headers.Authorization = `Bearer ${tokenM}`;
      }
    } catch (error) {
      console.log('Usuario sin token:', error);
    }

    return config;
  },
  error => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// 🧩 Interceptor de RESPONSE
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResult = await refreshAccessToken();

        if (!refreshResult.success) {
          throw new Error(refreshResult.error || 'Error al refrescar token');
        }

        const { access_token } = refreshResult;

        processQueue(null, access_token);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        console.log('Falló el refresh:', refreshError);

        await clearSession();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
