import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageService {

  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        // Guardamos en SecureStore y en AsyncStorage como respaldo
        await SecureStore.setItemAsync(key, value);
        console.log(`Set ${key} in SecureStore`);
        await AsyncStorage.setItem(key, value);
        console.log(`Set ${key} in AsyncStorage`);
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
        // Primero intentamos SecureStore
        let value = await SecureStore.getItemAsync(key);
        if (value === null) {
          // Si falla, leemos desde AsyncStorage
          value = await AsyncStorage.getItem(key);
        }
        return value;
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
        console.log(`Removed ${key} from AsyncStorage`);
      } else {
        await SecureStore.deleteItemAsync(key);
        console.log(`Removed ${key} from SecureStore`);

        await AsyncStorage.removeItem(key);
        console.log(`Removed ${key} from AsyncStorage`);
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
        const keys = ['access_token', 'refresh_token', 'user_data'];
        for (const key of keys) {
          try {
            await SecureStore.deleteItemAsync(key);
            console.log(`Cleared SecureStore key: ${key}`);
            await AsyncStorage.removeItem(key);
            console.log(`Cleared AsyncStorage key: ${key}`);
          } catch (error) {
            console.error(`Error clearing key ${key}:`, error);
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
