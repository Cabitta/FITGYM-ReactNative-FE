// src/screens/Reservas.jsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  Icon,
  Divider,
} from 'react-native-paper';
import useSWR from 'swr';
import { useAuth } from '../auth/AuthProvider';
import api from '../config/axios';
import { useTheme } from '../config/theme';

export default function Reservas({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reservaToCancel, setReservaToCancel] = useState(null);

  const {
    data: reservas,
    isLoading,
    error,
    mutate,
  } = useSWR(user?.id ? `/reservas/usuario/${user.id}` : null, api.get);

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [])
  );

  // Confirmar cancelación
  const handleOpenConfirm = idReserva => {
    setReservaToCancel(idReserva);
    setConfirmVisible(true);
  };

  const handleCloseConfirm = () => {
    setConfirmVisible(false);
    setReservaToCancel(null);
  };

  // Cancelar reserva
  const handleCancelar = async () => {
    if (!reservaToCancel) return;
    setIsCancelling(true);
    try {
      await api.delete(`/reservas/${reservaToCancel}`);
      setConfirmVisible(false);
      setSelectedReservaId(null);
      mutate();
    } catch (err) {
      console.error(
        'Error cancelando reserva:',
        err?.response?.data || err.message
      );
    } finally {
      setIsCancelling(false);
    }
  };

  function estaVencida(fechaClase, horarioInicio) {
    const ahora = new Date();
    const fechaClaseCompleta = new Date(`${fechaClase}T${horarioInicio}`);
    return fechaClaseCompleta <= ahora;
  }

  // Estados: error / carga / vacío
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            color: theme.colors.error,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Error al cargar las reservas.
        </Text>
      </View>
    );
  }

  if (isLoading) {
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

  if (!reservas?.data?.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            color: theme.colors.primary,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          No tienes reservas registradas.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={reservas.data}
          keyExtractor={item => item.idReserva.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <Card
              onPress={() =>
                setSelectedReservaId(
                  selectedReservaId === item.idReserva ? null : item.idReserva
                )
              }
              style={{
                marginBottom: 12,
                padding: 10,
                borderRadius: 16,
                backgroundColor: theme.colors.surface,
                elevation: 4,
              }}
              mode="elevated"
            >
              <Card.Content style={{ gap: 12 }}>
                {/* Header: clase */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <Text
                    variant="titleMedium"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.clase?.disciplina || 'Clase sin nombre'}
                  </Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      color: theme.colors.secondary,
                      fontSize: 12,
                    }}
                  >
                    #{item.idReserva}
                  </Text>
                </View>

                <Divider />

                {/* Fecha */}
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="calendar-outline"
                    size={20}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Fecha:{' '}
                    <Text
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: '600',
                      }}
                    >
                      {item.clase?.fecha || 'Fecha no disponible'}
                    </Text>
                  </Text>
                </View>

                {/* Sede */}
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="map-marker-outline"
                    size={20}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Sede:{' '}
                    <Text
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: '600',
                      }}
                    >
                      {item.sede?.nombre || 'No disponible'}
                    </Text>
                  </Text>
                </View>

                {/* Estado */}
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="information-outline"
                    size={20}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Estado:{' '}
                    <Text
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: '600',
                      }}
                    >
                      {estaVencida(item.clase?.fecha, item.clase?.horarioInicio)
                        ? 'VENCIDA'
                        : item.estado || 'CONFIRMADA'}
                    </Text>
                  </Text>
                </View>

                {selectedReservaId === item.idReserva && (
                  <Button
                    mode="contained-tonal"
                    buttonColor={theme.colors.errorContainer}
                    textColor={theme.colors.onErrorContainer}
                    style={{ marginTop: 8, borderRadius: 8 }}
                    onPress={() => handleOpenConfirm(item.idReserva)}
                    loading={isCancelling}
                    disabled={
                      isCancelling ||
                      item.estado === 'CANCELADA' ||
                      estaVencida(item.clase?.fecha, item.clase?.horarioInicio)
                    }
                  >
                    {isCancelling
                      ? 'Cancelando...'
                      : estaVencida(
                            item.clase?.fecha,
                            item.clase?.horarioInicio
                          )
                        ? 'Reserva vencida'
                        : item.estado === 'CANCELADA'
                          ? 'Reserva cancelada'
                          : 'Cancelar reserva'}
                  </Button>
                )}
              </Card.Content>
            </Card>
          )}
        />
      </View>

      {/* Diálogo de confirmación */}
      <Portal>
        <Dialog visible={confirmVisible} onDismiss={handleCloseConfirm}>
          <Dialog.Title style={{ color: theme.colors.primary }}>
            Confirmar cancelación
          </Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              ¿Seguro que deseas cancelar esta reserva?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseConfirm}>No</Button>
            <Button
              onPress={handleCancelar}
              textColor={theme.colors.error}
              disabled={isCancelling}
            >
              Sí, cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
