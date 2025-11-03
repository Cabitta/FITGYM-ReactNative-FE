// src/profile/section/ProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View,Modal } from "react-native";
import {
  Button,
  Card,
  Text,
  Switch,
  Surface,
  
  useTheme as usePaperTheme,
  Portal,
} from "react-native-paper";

import UserInfoCard from "../componentes/UserInfoCard";
import User from "../modelo/User";
import api from "../../config/axios";
import storage from "../../utils/storage";
import LogoutScreen from "../../auth/screens/LogoutScreen";
import { useTheme } from "../../config/theme";

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const datosStorage = await storage.getItem("user_data");
        if (datosStorage) {
          const parsedData = JSON.parse(datosStorage);
          const id = parsedData.id;
          const { data: userData } = await api.get(`/users/${id}`);
          setUser(new User(userData));
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Surface>
    );
  }

  return (
    <Surface
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      {/* Título del Tema */}
      <Text
        variant="headlineMedium"
        style={{
          color: theme.colors.primary,
          textAlign: "center",
          marginBottom: 16,
          fontWeight: "bold",
        }}
      >
        {isDarkMode ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
      </Text>

      {/* Control de Tema */}
      <Surface
        style={{
          padding: 16,
          borderRadius: 12,
          marginBottom: 24,
          backgroundColor: theme.colors.surface,
          elevation: 2,
        }}
      >
        <Card.Content style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {isDarkMode ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            color={theme.colors.secondary}
          />
        </Card.Content>
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginTop: 8,
            marginLeft: 16,
          }}
        >
          Cambia entre tema claro y oscuro
        </Text>
      </Surface>

      {/* Título de Perfil */}
      <Text
        variant="titleLarge"
        style={{
          color: theme.colors.tertiary,
          textAlign: "center",
          marginBottom: 16,
          fontWeight: "600",
        }}
      >
        Perfil del Usuario
      </Text>

      {/* Tarjeta de Información del Usuario */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <UserInfoCard user={user} theme={theme} />
      </View>
      {/* Botones */}
      <Card.Content style={{ marginTop: 24, gap: 12 }}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16 }}
          style={{ borderRadius: 8 }}
          buttonColor={theme.colors.tertiary}
        >
          Volver
        </Button>

        <Button
          mode="contained"
          onPress={() => setShowLogout(true)}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16 }}
          style={{ borderRadius: 8 }}
          buttonColor="#dc3545"
        >
          Cerrar Sesión
        </Button>
      </Card.Content>

      {/* Modal de Logout */}
      <Portal>
        <Modal visible={showLogout} animationType="slide" transparent={false}>
          <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <LogoutScreen navigation={navigation} onClose={() => setShowLogout(false)} />
          </Surface>
        </Modal>
      </Portal>
    </Surface>
  );
}