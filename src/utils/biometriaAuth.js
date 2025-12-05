import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import storage from './storage';
import authService from '../auth/services/authService';

export async function authenticateBiometric() {
  try {
    // 1️⃣ Verificar si el dispositivo tiene algún método de autenticación disponible
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible && !isEnrolled) {
      Alert.alert(
        'Autenticación no disponible',
        'Tu dispositivo no tiene configurado ningún método de autenticación (ni biometría, ni PIN o patrón).'
      );
      return {
        success: false,
        error: 'Dispositivo sin autenticación configurada',
      };
    }

    // 2️⃣ Obtener tipos soportados (biometría)
    const tiposBiometricos =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log('Tipos biométricos soportados:', tiposBiometricos);

    // 3️⃣ Solicitar autenticación (biometría o PIN/patrón)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verifica tu identidad',
      fallbackLabel: 'Usar PIN o patrón',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false, // Permitir fallback a PIN/patrón
    });

    if (!result.success) {
      Alert.alert(
        'Autenticación fallida',
        'No se pudo verificar tu identidad.'
      );
      if (result.error == 'not_enrolled') {
        return {
          success: false,
          error: 'No hay métodos de autenticación configurados',
        };
      }

      return { success: false, error: 'Autenticación fallida ' + result.error };
    }

    // 4️⃣ Si autenticó correctamente, restaurar sesión
    const userData = await storage.getItem('user_data');
    const token = await storage.getItem('access_token');

    if (token && userData && result.success) {
      return {
        success: true,
        method: tiposBiometricos.length ? 'biometric' : 'device_pin',
        user: JSON.parse(userData),
        token,
      };
    }

    Alert.alert(
      'Sesión no encontrada',
      'No hay sesión guardada en este dispositivo.'
    );
    return { success: false, error: 'No hay sesión guardada' };
  } catch (error) {
    Alert.alert('Error', 'Ocurrió un error verificando la autenticación.');
    return { success: false, error: error.message };
  }
}
