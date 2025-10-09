import axiosInstance from '../../config/axios';
import storage from '../../utils/storage';
import tokenManager from '../../utils/tokenManager';

class AuthService {
  // Función para hacer login
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      const { access_token, refresh_token, user_Id, username, email: userEmail } = response.data;
      
      // Guardar tokens en storage
      await storage.setItem('access_token', access_token);
      await storage.setItem('refresh_token', refresh_token);
      await storage.setItem('user_data', JSON.stringify({
        id: user_Id,
        username,
        email: userEmail
      }));
      // Guardar token en cache en memoria para evitar race conditions
      try {
        tokenManager.setToken(access_token);
      } catch (e) {
        // ignorar
      }
      // Log para indicar inicio de sesión exitoso
      // eslint-disable-next-line no-console
      console.log('[AuthService] Inicio de sesión exitoso:', { id: user_Id, username, email: userEmail });

      // Nota: AuthProvider se encargará de sincronizar estado de la app

      return { 
        success: true, 
        user: { id: user_Id, username, email: userEmail },
        access_token,
        refresh_token 
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  }

  // Función para hacer registro
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      const { id, nombre, email, password, foto } = response.data;

      console.debug('Usuario registrado:', { id, nombre, email, foto });
            
      // Guardar datos del usuario en storage
      await storage.setItem('user_data', JSON.stringify({
        id,
        nombre,
        email,
        foto
      }));
      
      return { 
        success: true, 
        user: { id, nombre, email, foto }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrarse',
      };
    }
  }

  // Función para cerrar sesión
  async logout() {
    try {
      await storage.removeItem('access_token');
      await storage.removeItem('refresh_token');
      await storage.removeItem('user_data');
      try {
        tokenManager.clear();
      } catch (e) {
        // ignorar
      }
      // Nota: AuthProvider se encargará de sincronizar estado de la app
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  // Función para verificar si el usuario está autenticado
  async isAuthenticated() {
    try {
      const token = await storage.getItem('access_token');
      return !!token;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  // Función para obtener datos del usuario
  async getUserData() {
    try {
      const userData = await storage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }
}

export default new AuthService();
