import React, { useEffect, useState } from 'react';
import UserFormEdit from '../componentes/UserformEdit';
import {
  ActivityIndicator,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  AppState,
} from 'react-native';
import { Button, Card, Text, Switch, Surface } from 'react-native-paper';

import UserInfoCard from '../componentes/UserInfoCard';
import User from '../modelo/User';
import api from '../../config/interceptors';
import storage from '../../utils/storage';
import { useTheme } from '../../config/theme';
import * as Notifications from 'expo-notifications';

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const [user, setUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  //permiso para notificaciones
  const [notificaciones, setNotificaciones] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const datosStorage = await storage.getItem('user_data');
        if (datosStorage) {
          const parsedData = JSON.parse(datosStorage);
          const id = parsedData.id;
          const { data: userData } = await api.get(`/users/${id}`);
          setUser(new User(userData));
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };
    fetchUser();

    const verificarPermisos = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificaciones(status);
    };
    verificarPermisos();

    const estadoApp = AppState.addEventListener('change', async estado => {
      if (estado === 'active') {
        verificarPermisos();
      }
    });

    return () => estadoApp.remove();
  }, []);

  function irAjustes() {
    Linking.openSettings();
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          margin: 16,
          paddingBottom: 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Control de Tema */}
        <Surface
          style={{
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            elevation: 2,
          }}
        >
          <Card.Content
            style={{
              flexDirection: 'row',
              padding: 6,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text variant="titleMedium">
              {isDarkMode ? 'Tema Oscuro' : 'Tema Claro'}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              color={theme.colors.secondary}
            />
          </Card.Content>
        </Surface>

        {/* Control de Notificaciones */}
        <Surface
          style={{
            borderRadius: 12,
            padding: 16,
            backgroundColor: theme.colors.surface,
            elevation: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {notificaciones === 'granted' ? (
            <>
              <Text variant="titleMedium">
                Notificaciones:{' '}
                <Text style={{ color: theme.colors.success }}>Permitidas</Text>
              </Text>
            </>
          ) : (
            <>
              <Text variant="titleMedium">
                Notificaciones:{' '}
                <Text style={{ color: theme.colors.error }}>No Permitidas</Text>
              </Text>
              <Button type="text" compact={true} onPress={() => irAjustes()}>
                Ir Ajustes
              </Button>
            </>
          )}
        </Surface>

        {/* Tarjeta de información - solo visible cuando NO está editando */}
        {!showEditForm && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowEditForm(true)}
          >
            <UserInfoCard user={user} theme={theme} />
          </TouchableOpacity>
        )}

        {/* Formulario de edición - solo visible cuando está editando */}
        {showEditForm && (
          <UserFormEdit
            user={user}
            onUpdated={u => {
              setUser({ ...user, ...u });
              setShowEditForm(false);
            }}
            onCancel={() => setShowEditForm(false)}
          />
        )}
      </ScrollView>
    </View>
  );
}
