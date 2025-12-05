import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Vibration } from 'react-native';
import { Text, ActivityIndicator, Button, Surface } from 'react-native-paper';
import { CameraView, Camera } from 'expo-camera'; // ← Correcto para Expo SDK 50+
import api from '../config/interceptors';
import { useTheme } from '../config/theme';
import { useAuth } from '../auth/AuthProvider';
import {
  parseLocalDate,
  attachTimeToDate,
  formatHumanDate,
  formatHumanTime,
} from '../utils/date';

const QRScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  // ← Referencia al componente CameraView
  const cameraRef = useRef(null);

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // ← IMPORTANTE: Apagar la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        console.log('Cámara apagada al salir del componente');
        // Forzar pausa del preview
        cameraRef.current.pausePreview?.();
      }
    };
  }, []);

  // ← También puedes pausar/reanudar cuando la app va a background (opcional pero recomendado)
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('blur', () => {
      if (cameraRef.current) {
        cameraRef.current.pausePreview?.();
      }
    });

    const unsubscribeBlur = navigation.addListener('focus', () => {
      if (cameraRef.current && hasPermission) {
        cameraRef.current.resumePreview?.();
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, hasPermission]);

  // ... todo tu código de lógica (fetch, validate, handleBarCodeScanned) queda igual ...

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);
    Vibration.vibrate(100);

    try {
      if (!user?.id) {
        Alert.alert('Error', 'Usuario no identificado.');
        return;
      }

      if (!data) {
        Alert.alert('Error', 'QR vacío o inválido.');
        return;
      }

      const reservasConfirmadas = await fetchReservasConfirmadas(user.id);
      const reservaValida = validateQRCode(data, reservasConfirmadas);

      if (!reservaValida) {
        Alert.alert(
          'Reserva No Encontrada',
          'No tienes reserva confirmada para este QR.',
          [
            { text: 'Escanear de nuevo', onPress: () => setScanned(false) },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setScanned(false),
            },
          ]
        );
        return;
      }

      if (reservaValida.confirmedCheckin) {
        Alert.alert('Ya verificada', 'Esta reserva ya fue confirmada antes.');
        return;
      }

      // Validación de fecha/hora (tu código original)
      const fechaClase = parseLocalDate(reservaValida.clase.fecha);
      const inicioClase = attachTimeToDate(
        fechaClase,
        reservaValida.clase.horarioInicio
      );
      const finClase = attachTimeToDate(
        fechaClase,
        reservaValida.clase.horarioFin
      );
      const ahora = new Date();

      if (ahora < inicioClase) {
        Alert.alert(
          'La clase no ha comenzado',
          `La clase empieza a las ${formatHumanTime(reservaValida.clase.horarioInicio)}`
        );
        return;
      }

      if (ahora > finClase) {
        Alert.alert('La clase ha terminado', 'Esta clase ya finalizó.');
        return;
      }

      // Confirmar check-in
      await api.put(`/reservas/${reservaValida.idReserva}`, {
        ...reservaValida,
        timestampCheckin: new Date().toISOString(),
        confirmedCheckin: true,
      });

      Alert.alert(
        'Check-in exitoso',
        `Bienvenid@ a ${reservaValida.clase.disciplina}!`,
        [{ text: 'Genial!', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el QR. Intenta de nuevo.');
    } finally {
      setScanned(false);
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sin acceso a la cámara</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />

          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <Surface style={styles.frame} elevation={4}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </Surface>
            <View style={styles.sideOverlay} />
          </View>

          <View style={styles.bottomOverlay}>
            <Text style={styles.instructions}>
              Coloca el código QR dentro del marco
            </Text>

            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.processingText}>Procesando...</Text>
              </View>
            )}

            {scanned && !isProcessing && (
              <Button mode="contained" onPress={() => setScanned(false)}>
                Escanear otra vez
              </Button>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default QRScanner;

// Estilos (mejores prácticas)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: { marginTop: 20, color: '#fff', fontSize: 16 },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },

  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  middleRow: { flexDirection: 'row' },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  frame: { width: 280, height: 280, backgroundColor: 'transparent' },

  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderLeftWidth: 6,
    borderTopWidth: 6,
    borderColor: '#00ff00',
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderColor: '#00ff00',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderLeftWidth: 6,
    borderBottomWidth: 6,
    borderColor: '#00ff00',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderColor: '#00ff00',
  },

  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  instructions: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  processingText: { color: '#fff', marginLeft: 10, fontSize: 16 },
});
