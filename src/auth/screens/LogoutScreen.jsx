// src/auth/screens/LogoutScreen.jsx
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { ActivityIndicator, Surface, useTheme as usePaperTheme } from "react-native-paper";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../../config/theme";

export default function LogoutScreen({ navigation, onClose }) {
  const { theme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout(); // Elimina token y limpia auth
        // Opcional: cerrar modal si se usa como tal
        onClose?.();

      } catch (error) {
        Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
        console.error("Logout error:", error);
        // En caso de error, permite volver
        navigation.goBack();
      }
    };

    doLogout();
  }, [logout, navigation, onClose]);

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <ActivityIndicator
        size="large"
        color={theme.colors.primary} 
      />
    </Surface>
  );
}