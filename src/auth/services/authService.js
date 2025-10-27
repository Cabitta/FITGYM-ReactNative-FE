import axiosInstance from '../../config/interceptors';
import storage from '../../utils/storage';
import tokenManager from '../../utils/tokenManager';
import { clearSession } from '../../utils/sesionManager';

class AuthService {
  async login(email, password) {
    const response = await axiosInstance.post('/auth/login', { email, password });

    const { access_token, refresh_token, user_Id, username, email: userEmail } = response.data;

    await storage.setItem('access_token', access_token);
    await storage.setItem('refresh_token', refresh_token);
    await storage.setItem('user_data', JSON.stringify({ id: user_Id, username, email: userEmail }));

    tokenManager.setToken(access_token);

    return {
      success: true,
      user: { id: user_Id, username, email: userEmail },
      access_token,
      refresh_token,
    };
  }

  async logout() {
    await clearSession();
  }
}

export default new AuthService();
