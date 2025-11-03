// src/classes/ClassDetail.jsx
import React, { useMemo } from "react";
import { Alert } from "react-native";
import {
  Surface,
  Text,
  Button,
  Card,
  Divider,
  ActivityIndicator,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { nanoid } from "nanoid";
import useSWR from "swr";
import { useAuth } from "../../auth/AuthProvider";
import { fetcher } from "../../config/fetcher";
import { useTheme } from "../../config/theme";

export default function ClassDetail({ route }) {
  const { clase } = route.params;
  const { user, token } = useAuth();
  const { theme } = useTheme();

  const { data: reservas, mutate, isLoading } = useSWR(
    token ? `/reservas/clase/${clase.idClase}` : null,
    (url) => fetcher(url, { headers: { Authorization: `Bearer ${token}` } }),
    { revalidateOnFocus: false }
  );

  const estaReservada = useMemo(() => {
    if (!reservas || !user) return false;
    return reservas.some((r) => r.idUsuario === user.id);
  }, [reservas, user]);

  const cupoDisponible = clase.cupo > 0;
  const puedeReservar = cupoDisponible && !estaReservada;

  const handleReservar = async () => {
    if (!puedeReservar) return;

    try {
      const res = await fetcher("/reservas", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          idReserva: nanoid(),
          idClase: clase.idClase,
          idUsuario: user.id,
          estado: "CONFIRMADA",
          timestampCreacion: new Date().toISOString(),
        },
      });

      if (res?.idReserva) {
        Alert.alert("Éxito", "Reserva creada con éxito.");
        mutate(); // Refresca reservas
      } else {
        Alert.alert("Error", "No se pudo crear la reserva.");
      }
    } catch (error) {
      console.error("Error al reservar:", error);
      Alert.alert("Error", "Ocurrió un error al reservar la clase.");
    }
  };

  if (isLoading) {
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.background,
        padding: 24,
      }}
    >
      <Card
        mode="elevated"
        style={{
          borderRadius: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
        }}
      >
        <Card.Content style={{ gap: 16 }}>
          {/* Título */}
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.primary, 
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {clase.disciplina}
          </Text>

          <Divider />

          {/* Detalles */}
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Profesor:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.tertiary, fontWeight: "600" }}>
              {clase.profesorNombre}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Sede:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.tertiary, fontWeight: "600" }}>
              {clase.sedeNombre}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Fecha:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
              {clase.fecha}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Horario:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
              {clase.horarioInicio?.substring(0, 5)} - {clase.horarioFin?.substring(0, 5)}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Duración:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
              {clase.duracion} minutos
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Cupos disponibles:{' '}
            <Text
              variant="titleMedium"
              style={{
                color: cupoDisponible ? theme.colors.secondary : theme.colors.error,
                fontWeight: "bold",
              }}
            >
              {clase.cupo}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Calificaciones:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
              {Array.isArray(clase.calificaciones) ? clase.calificaciones.length : 0}
            </Text>
          </Text>
        </Card.Content>

        {/* Botón Reservar */}
        <Card.Actions style={{ padding: 16, paddingTop: 8 }}>
          <Button
            mode="contained"
            onPress={handleReservar}
            disabled={!puedeReservar}
            loading={isLoading}
            contentStyle={{ height: 50 }}
            style={{ borderRadius: 12, flex: 1 }}
            buttonColor={
              estaReservada
                ? theme.colors.surfaceDisabled
                : cupoDisponible
                ? theme.colors.primary
                : theme.colors.errorContainer
            }
            labelStyle={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {estaReservada
              ? "Ya reservada"
              : clase.cupo === 0
              ? "Cupo lleno"
              : "Reservar ahora"}
          </Button>
        </Card.Actions>
      </Card>
    </Surface>
  );
}