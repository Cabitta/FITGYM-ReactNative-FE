// src/screens/Historial.jsx
//IMPORTANTE: ESTA VERSION ESTA CADUCADA, USAR HistorialAxios.jsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import useSWR from "swr";
import { useAuth } from "../auth/AuthProvider";
import axiosInstance from "../config/interceptors";
import { useTheme } from "../config/theme";

export default function Historial() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [turnos, setTurnos] = useState([]);

  // Obtener reservas del usuario
  const { data: reservas, error, isLoading } = useSWR(
    user?.id ? `/reservas/usuario/${user.id}` : null,
    async (url) => {
      const response = await axiosInstance.get(url);
      return response.data;
    }
  );

  // Obtener detalles completos (clase + sede)
  const fetchDetails = async (reservas) => {
    if (!reservas || reservas.length === 0) return [];

    const turnosCompletos = await Promise.all(
      reservas.map(async (item) => {
        const claseResponse = await axiosInstance.get(`/clases/${item.idClase}`);
        const clase = claseResponse.data;

        const sedeResponse = await axiosInstance.get(`/sedes/${clase.idSede}`);
        const sede = sedeResponse.data;

        return {
          ...item,
          disciplina: clase.disciplina,
          fecha: clase.fecha,
          horarioInicio: clase.horarioInicio,
          horarioFin: clase.horarioFin,
          nombreSede: sede.nombre,
          ubicacion: sede.ubicacion,
          barrioSede: sede.barrio,
        };
      })
    );

    setTurnos(turnosCompletos);
    return turnosCompletos;
  };

  // Ejecutar fetchDetails cuando cambian las reservas
  useSWR(
    reservas ? `historial-details-${user.id}` : null,
    () => fetchDetails(reservas),
    { revalidateOnFocus: false }
  );

  // Estados de carga y error
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            color: theme.colors.error,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Error al cargar el historial.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!turnos || turnos.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            color: theme.colors.primary,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          No tienes historial de turnos.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        variant="titleLarge"
        style={{
          color: theme.colors.primary,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Historial de Turnos
      </Text>
      <Divider style={{ marginBottom: 16 }} />

      <FlatList
        data={turnos}
        keyExtractor={(item) => item.idReserva.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Card
            style={{
              marginBottom: 12,
              borderRadius: 16,
              backgroundColor: theme.colors.surface,
              elevation: 4,
            }}
            mode="elevated"
          >
            <Card.Content style={{ padding: 16, gap: 12 }}>
              {/* Header: Clase + Estado */}
              <Card.Content
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: "bold",
                  }}
                >
                  {item.disciplina}
                </Text>
                <Text
                  variant="titleSmall"
                  style={{
                    color:
                      item.estado === "cancelado"
                        ? theme.colors.error
                        : theme.colors.secondary,
                    fontWeight: "600",
                  }}
                >
                  {item.estado}
                </Text>
              </Card.Content>

              {/* Fecha y horario */}
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.tertiary }}
              >
                {item.fecha} • {item.horarioInicio?.substring(0, 5)} -{" "}
                {item.horarioFin?.substring(0, 5)}
              </Text>

              {/* Horario de creación */}
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Reserva creada:{' '}
                <Text
                  style={{
                    color: theme.colors.tertiary,
                    fontWeight: "600",
                  }}
                >
                  {new Date(item.timestampCreacion).toLocaleString()}
                </Text>
              </Text>

              {/* Sede */}
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Sede:{' '}
                <Text
                  style={{
                    color: theme.colors.tertiary,
                    fontWeight: "600",
                  }}
                >
                  {item.nombreSede}
                </Text>
              </Text>

              {/* Ubicación */}
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Ubicación:{' '}
                <Text
                  style={{
                    color: theme.colors.tertiary,
                    fontWeight: "600",
                  }}
                >
                  {item.ubicacion} ({item.barrioSede})
                </Text>
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
