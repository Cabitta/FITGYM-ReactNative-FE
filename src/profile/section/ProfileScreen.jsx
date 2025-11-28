import React, { useEffect, useState } from "react";
import UserFormEdit from "../componentes/UserformEdit";
import { ActivityIndicator, View, ScrollView, TouchableOpacity, Linking, AppState } from "react-native";
import {
  Button,
  Card,
  Text,
  Switch,
  Surface,
  Modal,
  Appbar,
} from "react-native-paper";

import UserInfoCard from "../componentes/UserInfoCard";
import User from "../modelo/User";
import api from "../../config/axios";
import storage from "../../utils/storage";
import LogoutScreen from "../../auth/screens/LogoutScreen";
import { useTheme } from "../../config/theme";
import * as Notifications from 'expo-notifications';

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  //permiso para notificaciones
  const [notificaciones, setNotificaciones] = useState(null);

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

      const verificarPermisos = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificaciones(status);
      }
      verificarPermisos();

      const estadoApp = AppState.addEventListener("change", async(estado)=>{
        if(estado === "active"){
          verificarPermisos();
        }
      })

      return ()=> estadoApp.remove();
  }, []);

  function irAjustes() {
    Linking.openSettings()
  }

  if (!user) {
    return (
      <View 
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View >
    );
  }

  return (
    <View 
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Perfil" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={() => setShowLogout(true)} />
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
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
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
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

        <Surface
        style={{
          padding: 8,
          borderRadius: 12,
          marginBottom: 12,
          backgroundColor: theme.colors.surface,
          elevation: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {notificaciones === 'granted' ?(
          <>
          <Text variant="bodyMedium" style={{
            marginTop: 0,
            marginLeft: 16,
            }}>
              Notificaciones Permitidas: ✔
          </Text>
          </>
        ):(<>
        <Text variant="bodyMedium"
          style={{
            marginTop: 0,
            marginLeft: 16,
          }}>
            Notificaciones No Permitidas : ❌
        </Text>
        <Button type="text" compact={true} onPress={() => irAjustes()}>Ir Ajustes</Button>
        </>)}        
      </Surface>

        {/* Tarjeta de información */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowEditForm(!showEditForm)} // 👈 alterna visibilidad del form
        >
          <UserInfoCard user={user} theme={theme} />
        </TouchableOpacity>

        {/* Formulario de edición (solo visible si se tocó la card) */}
        {showEditForm && (
          <View style={{ width: "100%", marginTop: 20 }}>
            <UserFormEdit
              user={user}
              onUpdated={(u) => {
                setUser({ ...user, ...u });
                setShowEditForm(false); // 👈 ocultar el form luego de guardar
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Modal de Logout */}
      <Modal
        visible={showLogout}
        onDismiss={() => setShowLogout(false)}
        contentContainerStyle={{ flex: 1 }}
      >
        <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <LogoutScreen onClose={() => setShowLogout(false)} />
        </Surface>
      </Modal>
      
    </View >
  );
}
