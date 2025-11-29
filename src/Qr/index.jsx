import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, ActivityIndicator, Button, Surface } from 'react-native-paper';
import { CameraView, Camera } from 'expo-camera';
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /**
   * Obtiene las reservas confirmadas del usuario
   * Usa el endpoint: GET /reservas/usuario/{id_usuario}/estado?estado=CONFIRMADA
   * Con query parameter: estado=CONFIRMADA
   */
  const fetchReservasConfirmadas = async userId => {
    try {
      const response = await api.get(`/reservas/usuario/${userId}`);

      if (!response.data || !Array.isArray(response.data)) {
        console.warn('La respuesta de la API no contiene un array válido');
        return [];
      }
      // La API ya devuelve solo las reservas confirmadas
      const confirmadas = response.data.filter(
        reserva => reserva.estado === 'CONFIRMADA'
      );
      return confirmadas;
    } catch (error) {
      console.error('Error al obtener reservas confirmadas:', error);
      throw error;
    }
  };

  /**
   * Extrae el ID del código QR
   * El QR puede venir como string JSON o como objeto
   */
  const extractQRId = qrData => {
    if (!qrData) return null;
    return qrData;
  };

  /**
   * Valida si el QR escaneado corresponde a una reserva confirmada del usuario
   */
  const validateQRCode = (qrData, reservasConfirmadas) => {
    if (!qrData || !reservasConfirmadas || reservasConfirmadas.length === 0) {
      return null;
    }

    // Extraer el ID del QR
    const qrId = extractQRId(qrData);

    if (!qrId) {
      console.warn('No se pudo extraer el ID del código QR');
      return null;
    }

    console.log('ID extraído del QR:', qrId);

    // Buscar la reserva que coincida con el ID de clase del QR
    const reservaEncontrada = reservasConfirmadas.find(reserva => {
      const reservaIdClase = reserva.idClase?.toString();
      const qrIdString = qrId.toString();
      return reservaIdClase == qrIdString || reserva.idClase == qrId;
    });

    return reservaEncontrada || null;
  };

  /**
   * Maneja el escaneo del código QR
   */
  const handleBarCodeScanned = async ({ type, data }) => {
    // Prevenir múltiples escaneos mientras se procesa
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      // Validar que hay un usuario autenticado
      if (!user?.id) {
        Alert.alert(
          'Error',
          'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.'
        );
        setScanned(false);
        setIsProcessing(false);
        return;
      }

      // Validar que el QR contiene datos
      if (!data) {
        Alert.alert(
          'Error',
          'El código QR escaneado no contiene información válida.'
        );
        setScanned(false);
        setIsProcessing(false);
        return;
      }

      console.log('QR escaneado - Tipo:', type, 'Datos:', data);

      // Obtener reservas confirmadas del usuario
      const reservasConfirmadas = await fetchReservasConfirmadas(user.id);

      // Validar si el QR corresponde a una reserva confirmada
      const reservaValida = validateQRCode(data, reservasConfirmadas);

      if (reservaValida) {
        console.log('Reserva válida encontrada:', reservaValida);
        if (reservaValida.confirmedCheckin) {
          console.log('Reserva ya confirmada anteriormente.');
          Alert.alert(
            '❌ La reserva ya ha sido verificada anteriormente.',
            'No se puede verificar nuevamente.',
            [
              {
                text: 'Aceptar',
                onPress: () => {
                  setScanned(false);
                  setIsProcessing(false);
                },
              },
            ]
          );
          return;
        }

        // ------------------ VALIDACIÓN DE FECHA Y HORARIO ------------------
        function parseFechaLocal(fechaStr) {
          const [year, month, day] = fechaStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        const fechaClase = parseLocalDate(reservaValida.clase.fecha);
        const inicioClase = attachTimeToDate(
          fechaClase,
          reservaValida.clase.horarioInicio
        );
        const finClase = attachTimeToDate(
          fechaClase,
          reservaValida.clase.horarioFin
        );

        // Fecha actual
        const ahora = new Date();

        console.log('Fecha/Hora actual:', ahora.toString());
        console.log('Inicio de la clase:', inicioClase.toString());
        console.log('Fin de la clase:', finClase.toString());

        // ------------------ 1) Clase futura ------------------
        if (ahora < inicioClase) {
          console.log('La reserva tiene una fecha/hora futura.');
          Alert.alert(
            '❌ La reserva no es válida aún.',
            `La clase empieza el${formatHumanDate(reservaValida.clase.fecha)} a las ${formatHumanTime(reservaValida.clase.horarioInicio)}`,
            [
              {
                text: 'Aceptar',
                onPress: () => {
                  setScanned(false);
                  setIsProcessing(false);
                },
              },
            ]
          );
          return;
        }

        // ------------------ 2) Clase pasada ------------------
        if (ahora > finClase) {
          console.log('La reserva ya ha expirado.');
          Alert.alert(
            '❌ La reserva ha expirado.',
            `La clase fue el ${formatHumanDate(reservaValida.clase.fecha)} a las ${formatHumanTime(reservaValida.clase.horarioInicio)}`,
            [
              {
                text: 'Aceptar',
                onPress: () => {
                  setScanned(false);
                  setIsProcessing(false);
                },
              },
            ]
          );
          return;
        }

        try {
          // Actualizar la reserva para marcar el check-in como confirmado
          const disciplina = reservaValida.clase?.disciplina || 'desconocida';
          const modificada = await api.put(
            `/reservas/${reservaValida.idReserva}`,
            {
              idReserva: reservaValida.idReserva,
              idClase: reservaValida.idClase,
              idUsuario: reservaValida.idUsuario,
              estado: 'CONFIRMADA',
              timestampCreacion: reservaValida.timestampCreacion,
              timestampCheckin: new Date().toISOString(),
              confirmedCheckin: true,
            }
          );

          if (modificada.status === 200 || modificada.status === 201) {
            Alert.alert(
              '✅ Reserva Confirmada',
              `Tu reserva para la clase ${disciplina} ha sido verificada correctamente.`,
              [
                {
                  text: 'Aceptar',
                  onPress: () => {
                    setScanned(false);
                    setIsProcessing(false);
                  },
                },
              ]
            );
          } else {
            Alert.alert(
              '❌ Error al confirmar la reserva',
              'Ocurrió un error al confirmar la reserva. Intenta nuevamente.',
              [
                {
                  text: 'Aceptar',
                  onPress: () => {
                    setScanned(false);
                    setIsProcessing(false);
                  },
                },
              ]
            );
          }
        } catch (updateError) {
          console.error('Error al actualizar la reserva:', updateError);
          Alert.alert(
            '❌ Error al confirmar la reserva',
            updateError.response?.data?.message ||
              'Ocurrió un error al confirmar la reserva. Intenta nuevamente.',
            [
              {
                text: 'Aceptar',
                onPress: () => {
                  setScanned(false);
                  setIsProcessing(false);
                },
              },
            ]
          );
        }
      } else {
        console.warn('No se encontró una reserva confirmada para este QR');
        Alert.alert(
          '⚠️ Reserva No Encontrada',
          'No se encontró una reserva confirmada para este código QR. Verifica que el código sea correcto.',
          [
            {
              text: 'Escanear de nuevo',
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error al procesar el código QR:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Ocurrió un error al procesar el código QR. Intenta nuevamente.';

      Alert.alert('Error', errorMessage, [
        {
          text: 'Reintentar',
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------- RENDER PERMISOS --------------------
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No hay acceso a la cámara</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </View>
    );
  }

  // -------------------- RENDER PRINCIPAL --------------------
  return (
    <View style={styles.container}>
      {/* Cámara */}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay}></View>

          <View style={styles.middleRow}>
            <View style={styles.sideOverlay}></View>

            {/* Marco QR */}
            <Surface style={styles.frame} elevation={4}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </Surface>

            <View style={styles.sideOverlay}></View>
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
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => setScanned(false)}
              >
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  // --- Overlays ---
  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 20,
  },
  middleRow: { flexDirection: 'row', height: 250 },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  // --- QR Frame ---
  frame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 25, 25, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cornerTL: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: 'red',
    borderRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: 'red',
    borderRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'red',
    borderRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'red',
    borderRadius: 8,
  },

  // --- Text & Buttons ---
  instructions: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: 220,
    marginTop: 10,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  processingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },

  // --- Permission Screens ---
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: { marginTop: 20, color: '#fff' },
  errorText: { color: '#ff4444', marginBottom: 20, fontSize: 16 },
});
