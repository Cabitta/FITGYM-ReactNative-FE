import * as LocalAuthentication from "expo-local-authentication";
import storage from "./storage";
import authService from "../auth/services/authService";

export async function authenticateBiometric() {
  try {
    // Verificar si el dispositivo soporta biometría
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return { success: false, error: "Dispositivo no compatible" };

    // Verificar si hay métodos biométricos configurados
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return { success: false, error: "No hay biometría configurada" };

    // Autenticar al usuario
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación biométrica",
      fallbackLabel: "Usar contraseña",
      cancelLabel: "Cancelar",
    });

    if (!result.success) return { success: false, error: "Autenticación fallida" };

    // Si la autenticación fue exitosa, intentar restaurar sesión
    const userData = await storage.getItem("user_data");
    const token = await storage.getItem("access_token");

    if (token && userData) {
      return {
        success: true,
        user: JSON.parse(userData),
        token,
      };
    }

    return { success: false, error: "No hay sesión guardada" };
  } catch (error) {
    console.error("Error en authenticateBiometric:", error);
    return { success: false, error: error.message };
  }
}
