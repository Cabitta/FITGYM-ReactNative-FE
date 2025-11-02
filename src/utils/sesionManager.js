import storage from './storage';
import tokenManager from './tokenManager';

export async function clearSession() {
  //await storage.removeItem('access_token');
  //await storage.removeItem('refresh_token');
  //await storage.removeItem('user_data');
  tokenManager.clear();
}