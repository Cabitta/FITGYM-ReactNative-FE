import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from './src/config/theme';
import AppNavigator from './src/navigator/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';
import * as Notifications from 'expo-notifications';
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from 'expo-task-manager';
import { pedirPermisos } from "./src/utils/permisosNotificaciones";
import { Platform } from "react-native";
import { NOTIFICACION_SEGUNDO_PLANO } from "./src/services/notificacionSegundoPlano";

//comportamiento para cuando la app esta principal
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
})

const Stack = createNativeStackNavigator();

function AppContent(){
const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      
      <SafeAreaProvider>  

        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );

}
export default function App() {
  useEffect(()=>{
    pedirPermisos();

    const asignarNotificacion = async()=>{
      try {
        if (Platform.OS === "android"){
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#231fff7c",
          })
        }

        const isRegistered = await TaskManager.isTaskRegisteredAsync(NOTIFICACION_SEGUNDO_PLANO)

        if (!isRegistered) {
          await BackgroundTask.registerTaskAsync(NOTIFICACION_SEGUNDO_PLANO, {
            minimumInterval: 15
          });
          console.log("Tarea de notificación en segundo plano registrada.");
        } else {
          console.log("La tarea de notificación en segundo plano ya está registrada.");
        }
      } catch (error) {
        console.log("Error al asignar notificación en background", error);
      }
    }
    asignarNotificacion();
  },[])
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
