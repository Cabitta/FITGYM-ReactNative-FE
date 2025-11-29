import { Alert, Platform } from 'react-native';
import * as Notificaciones from 'expo-notifications';

export async function pedirPermisos() {
    if (Platform.OS === 'web') {
      console.log("sesion web")
      return;
    }
    let { status } = await Notificaciones.getPermissionsAsync()
    console.log("Estado actual: ", status)
    if (status !== 'granted') {
      const { status: nuevoStatus } = await Notificaciones.requestPermissionsAsync()
      if (nuevoStatus !== 'granted') {
        Alert.alert('No se otorgaron permisos para mostrar notificaciones',
          'Esto se puede ver y cambiar en el perfil')
        return;
      }
    }
    const {status: estatusFinal} = await Notificaciones.getPermissionsAsync()
    console.log("Estado Final: ", estatusFinal)
  }
