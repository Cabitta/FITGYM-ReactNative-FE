import React from "react";
import { formatHumanDate, formatHumanTime } from "../utils/date";

import {
  Surface,
  Text,
  Card,
  Divider,
  List,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useTheme } from "../../config/theme";

export default function Reserva({ route }) {
  const { reserva, actualizar } = route.params;
  const { theme } = useTheme();

  // Formatear fecha y hora si es necesario
   const formatDate = formatHumanDate;
  const formatTime = formatHumanTime;


  const getEstadoColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case "CONFIRMADA":
        return theme.colors.secondary; // Amarillo
      case "CANCELADA":
        return theme.colors.error;
      case "PENDIENTE":
        return theme.colors.tertiary; // Azul
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <Surface
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <Text
        variant="headlineMedium"
        style={{
          textAlign: "center",
          marginBottom: 24,
          color: theme.colors.primary,
          fontWeight: "bold",
        }}
      >
        Detalle de la Reserva
      </Text>

      <Card
        mode="elevated"
        style={{
          borderRadius: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
        }}
      >
        <Card.Content style={{ gap: 12 }}>
          {/* ID Reserva */}
          <List.Item
            title="ID Reserva"
            description={reserva.id || "—"}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.tertiary,
            }}
            left={() => <List.Icon icon="key" color={theme.colors.primary} />}
          />

          <Divider />

          {/* Nombre del usuario */}
          <List.Item
            title="Nombre"
            description={reserva.nombre || "No disponible"}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.tertiary,
            }}
            left={() => <List.Icon icon="account" color={theme.colors.tertiary} />}
          />

          <Divider />

          {/* Fecha */}
          <List.Item
            title="Fecha"
            description={formatDate(reserva.fecha)}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.secondary,
            }}
            left={() => <List.Icon icon="calendar" color={theme.colors.secondary} />}
          />

          <Divider />

          {/* Hora */}
          <List.Item
            title="Hora"
            description={formatTime(reserva.hora)}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.secondary,
            }}
            left={() => <List.Icon icon="clock-outline" color={theme.colors.secondary} />}
          />

          <Divider />

          {/* Estado */}
          <List.Item
            title="Estado"
            description={reserva.estado || "—"}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: getEstadoColor(reserva.estado),
              fontWeight: "bold",
            }}
            left={() => <List.Icon icon="check-circle" color={getEstadoColor(reserva.estado)} />}
          />

          <Divider />

          {/* Clase ID */}
          <List.Item
            title="Clase ID"
            description={reserva.claseId || "—"}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.tertiary,
            }}
            left={() => <List.Icon icon="dumbbell" color={theme.colors.tertiary} />}
          />

          <Divider />

          {/* Usuario ID */}
          <List.Item
            title="Usuario ID"
            description={reserva.usuarioId || "—"}
            titleStyle={{
              color: theme.colors.onSurface,
              fontWeight: "600",
            }}
            descriptionStyle={{
              color: theme.colors.tertiary,
            }}
            left={() => <List.Icon icon="account-circle" color={theme.colors.tertiary} />}
          />
        </Card.Content>
      </Card>
    </Surface>
  );
}