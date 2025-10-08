import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageService {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear() {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.clear();
      } else {
        // Para SecureStore, necesitamos eliminar elementos individualmente
        // ya que no tiene un método clear
        const keys = ['access_token', 'refresh_token', 'user_data'];
        for (const key of keys) {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch (error) {
            // Ignorar errores si la clave no existe
          }
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new StorageService();
