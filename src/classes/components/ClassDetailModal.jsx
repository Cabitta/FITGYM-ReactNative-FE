import React, { useMemo, useCallback } from 'react';
import { Alert, Linking, View, ScrollView } from 'react-native';
import {
  Surface,
  Text,
  Button,
  Card,
  Divider,
  ActivityIndicator,
  Icon,
  Modal,
  Portal,
  IconButton,
} from 'react-native-paper';
import api from '../../config/interceptors';
import { useAuth } from '../../auth/AuthProvider';
import { useTheme } from '../../config/theme';
import useSWR from 'swr';

export default function ClassDetailModal({
  visible,
  onDismiss,
  clase: claseParam,
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const idClase = claseParam?.idClase;

  const {
    data: clase,
    isLoading: cargandoClase,
    mutate: actualizarClase,
  } = useSWR(idClase ? `clases/${idClase}` : null, api.get);

  const {
    data: reservas,
    isLoading: cargandoReservas,
    mutate: actualizarReservas,
  } = useSWR(user?.id ? `/reservas/usuario/${user.id}` : null, api.get);

  const claseEnCurso = useMemo(() => {
    if (!clase?.data) return false;
    const ahora = new Date();
    const desde = new Date(`${clase?.data.fecha}T${clase?.data.horarioInicio}`);
    const hasta = new Date(`${clase?.data.fecha}T${clase?.data.horarioFin}`);
    return desde >= ahora >= hasta;
  }, [clase]);

  const claseVencida = useMemo(() => {
    if (!clase?.data) return false;
    return (
      new Date() >= new Date(`${clase?.data.fecha}T${clase?.data.horarioFin}`)
    );
  }, [clase]);

  const cupoDisponible = clase?.data.cupo > 0;
  const estaReservada = reservas?.data.some(r => r.idClase === idClase);
  const puedeReservar =
    cupoDisponible && !estaReservada && !claseVencida && !claseEnCurso;

  var promedio = useMemo(() => {
    if (!clase?.data?.calificaciones?.length) return 0;

    return (
      clase.data.calificaciones.reduce(
        (prev, curr) => prev + curr.estrellas,
        0 // valor inicial
      ) / clase.data.calificaciones.length
    );
  }, [clase]);

  const handleReservar = async () => {
    if (!clase || estaReservada) return;

    try {
      const res = await api.post('/reservas', {
        idClase: clase.data.idClase,
        idUsuario: user.id,
        estado: 'CONFIRMADA',
        timestampCreacion: new Date().toISOString(),
      });

      if (res.data?.idReserva) {
        Alert.alert('Éxito', 'Reserva creada con éxito.');
        onDismiss(); // Cerrar el modal después de reservar
      } else {
        Alert.alert('Error', 'No se pudo crear la reserva.');
      }
    } catch (error) {
      console.error('Error al reservar:', error);
      Alert.alert('Error', 'Ocurrió un error al reservar la clase.');
    } finally {
      actualizarClase(clase => ({ ...clase, cupo: clase.cupo - 1 }));
      actualizarReservas();
    }
  };

  const handleAbrirEnMaps = useCallback(() => {
    if (!clase?.data?.ubicacionSede) {
      Alert.alert('Error', 'No hay dirección disponible para la sede.');
      return;
    }

    const direccion = encodeURIComponent(clase.data.ubicacionSede);
    const url = `https://www.google.com/maps/search/?api=1&query=${direccion}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps.');
    });
  }, [clase]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          margin: 20,
          borderRadius: 16,
          maxHeight: '90%',
        }}
      >
        {cargandoClase ? (
          <View
            style={{
              padding: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : clase?.data ? (
          <ScrollView>
            <Card
              mode="elevated"
              style={{
                borderRadius: 16,
                backgroundColor: theme.colors.surface,
              }}
            >
              {/* Header con botón de cerrar */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  paddingTop: 8,
                }}
              >
                <View style={{ width: 40 }} />
                <Text
                  variant="headlineMedium"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  {clase.data.disciplina}
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onDismiss}
                  iconColor={theme.colors.onSurface}
                />
              </View>

              <Card.Content style={{ gap: 16, paddingTop: 8 }}>
                <Divider />

                {/* Detalles */}
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="account-outline"
                    size={24}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Profesor:{' '}
                    <Text
                      variant="titleMedium"
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: '600',
                      }}
                    >
                      {clase.data.nombreProfesor}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="map-marker-outline"
                    size={24}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Sede:{' '}
                    <Text
                      variant="titleMedium"
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: '600',
                      }}
                    >
                      {clase.data.nombreSede}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="calendar-outline"
                    size={24}
                    color={theme.colors.secondary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Fecha:{' '}
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.secondary }}
                    >
                      {clase.data.fecha}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="clock-outline"
                    size={24}
                    color={theme.colors.secondary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Horario:{' '}
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.secondary }}
                    >
                      {clase.data.horarioInicio?.substring(0, 5)} -{' '}
                      {clase.data.horarioFin?.substring(0, 5)}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="timer-outline"
                    size={24}
                    color={theme.colors.secondary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Duración:{' '}
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.secondary }}
                    >
                      {clase.data.duracion} minutos
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="account-group-outline"
                    size={24}
                    color={
                      cupoDisponible
                        ? theme.colors.secondary
                        : theme.colors.error
                    }
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Cupos disponibles:{' '}
                    <Text
                      variant="titleMedium"
                      style={{
                        color: cupoDisponible
                          ? theme.colors.secondary
                          : theme.colors.error,
                        fontWeight: 'bold',
                      }}
                    >
                      {clase.data.cupo}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    source="star-outline"
                    size={24}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Estrellas promedio:{' '}
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.tertiary }}
                    >
                      {promedio.toFixed(1)}
                    </Text>
                  </Text>
                </View>

                {/* Lista de comentarios */}
                {clase.data.calificaciones?.length > 0 ? (
                  clase.data.calificaciones.map((calificacion, index) => (
                    <Text
                      key={index}
                      variant="bodyMedium"
                      style={{
                        color: theme.colors.secondary,
                        marginLeft: 16,
                        marginTop: 4,
                      }}
                    >
                      • {calificacion.comentario}
                    </Text>
                  ))
                ) : (
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginLeft: 16,
                      marginTop: 4,
                      fontStyle: 'italic',
                    }}
                  >
                    No hay calificaciones disponibles
                  </Text>
                )}
              </Card.Content>

              <Card.Actions
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                }}
              >
                <Button
                  mode="outlined"
                  icon="map-marker"
                  onPress={handleAbrirEnMaps}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  Maps
                </Button>

                <Button
                  mode="contained"
                  onPress={handleReservar}
                  disabled={!puedeReservar}
                  loading={cargandoReservas}
                  buttonColor={
                    puedeReservar
                      ? theme.colors.primary
                      : theme.colors.surfaceDisabled
                  }
                  labelStyle={{ fontWeight: 'bold' }}
                  style={{ flex: 1, marginLeft: 8 }}
                >
                  {claseEnCurso
                    ? 'En curso'
                    : claseVencida
                      ? 'Terminó'
                      : estaReservada
                        ? 'Reservada'
                        : !cupoDisponible
                          ? 'Lleno'
                          : 'Reservar'}
                </Button>
              </Card.Actions>
            </Card>
          </ScrollView>
        ) : null}
      </Modal>
    </Portal>
  );
}
