import axiosInstance from '../../config/axios';
import storage from '../../utils/storage';
import tokenManager from '../../utils/tokenManager';

class AuthService {
  async login(email, password) {
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        {
          email,
          password,
        },
        { skipAuth: true }
      );
      console.log(response.data);
      console.log(response);
      const {
        access_token,
        refresh_token,
        user_Id,
        username,
        email: userEmail,
      } = response.data;

      // Guardar tokens en storage
      await storage.setItem('access_token', access_token);
      await storage.setItem('refresh_token', refresh_token);
      await storage.setItem(
        'user_data',
        JSON.stringify({
          id: user_Id,
          username,
          email: userEmail,
        })
      );
      // Guardar token en cache en memoria para evitar race conditions
      try {
        tokenManager.setToken(access_token);
      } catch (e) {
        console.log('Error setting token in tokenManager:', e);
      }

      return {
        success: true,
        user: { id: user_Id, username, email: userEmail },
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.log('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.detail,
      };
    }
  }

  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData, {
        skipAuth: true,
      });

      const { id, nombre, email, password, foto } = response.data;

      console.debug('Usuario registrado:', { id, nombre, email, foto });

      // Guardar datos del usuario en storage
      await storage.setItem(
        'user_data',
        JSON.stringify({
          id,
          nombre,
          email,
          foto,
        })
      );

      return {
        success: true,
        user: { id, nombre, email, foto },
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrarse',
      };
    }
  }

  // Trigger 2FA: sends otp to the user's email and stores otp fields in DB
  async login2fa(email, password) {
    try {
      // This endpoint does not return a body; server will send OTP to email
      await axiosInstance.post('/auth/login-2fa', { email, password });
      return { success: true };
    } catch (error) {
      console.error('Error en login2fa:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error en login 2FA',
      };
    }
  }

  // Verify OTP and receive tokens (same response shape as login)
  async verifyOtp(email, otp) {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        email,
        otp,
      });
      const {
        access_token,
        refresh_token,
        user_Id,
        username,
        email: userEmail,
      } = response.data;

      // Persist tokens and user data
      await storage.setItem('access_token', access_token);
      await storage.setItem('refresh_token', refresh_token);
      await storage.setItem(
        'user_data',
        JSON.stringify({
          id: user_Id,
          username,
          email: userEmail,
        })
      );

      try {
        tokenManager.setToken(access_token);
      } catch (e) {
        console.log('Error setting token in tokenManager:', e);
      }

      return {
        success: true,
        user: { id: user_Id, username, email: userEmail },
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Error en verifyOtp:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al verificar OTP',
      };
    }
  }

  async resendOtp(email) {
    try {
      await axiosInstance.post('auth/send-otp', { email });
      return { success: true };
    } catch (error) {
      console.error('Error en resendOtp:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al reenviar OTP',
      };
    }
  }

  async logout() {
    try {
      //      await storage.removeItem('access_token');
      //      await storage.removeItem('refresh_token');
      //      await storage.removeItem('user_data');
      try {
        tokenManager.clear();
      } catch (e) {
        console.log('Error clearing token in tokenManager:', e);
      }
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  async isAuthenticated() {
    try {
      const token = await storage.getItem('access_token');
      return !!token;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  async getUserData() {
    try {
      const userData = await storage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  async editProfile(userId, updatedData) {
    try {
      const response = await axiosInstance.patch(
        `/users/${userId}`,
        updatedData
      );
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Error al editar perfil:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al editar perfil',
      };
    }
  }
}

export default new AuthService();
