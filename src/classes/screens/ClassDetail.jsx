// src/classes/ClassDetail.jsx
import React, { useMemo,useState,useEffect } from "react";
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
import api from "../../config/axios";
import { useAuth } from "../../auth/AuthProvider";
import { fetcher } from "../../config/fetcher";
import { useTheme } from "../../config/theme";

export default function ClassDetail({ route }) {
  const { user, token } = useAuth();
  const { clase: item } = route.params;
  const [loading, setLoading] = useState(true);
  const [calificaciones, setCalificaciones] = useState([]);
  const [clase,setClase] = useState(null);
  const { theme } = useTheme();

useEffect(() => {
    const fetchClase = async () => {
    try {
      setLoading(true);
      const res = await api.get(`clases/${item.idClase}`);
      setClase(res.data);
      if (Array.isArray(res.data.calificaciones) && res.data.calificaciones.length > 0) {
        // Filtra solo los IDs válidos (ni null, ni undefined, ni vacío)
        const idsValidos = res.data.calificaciones.filter(
          (id) => id !== null && id !== undefined && id !== "" && id !== 0
        );

        if (idsValidos.length > 0) {
          console.log("IDs de calificaciones válidos:", idsValidos);

          const detalles = await Promise.all(
            idsValidos.map((id) => api.get(`calificaciones/${id}`))
          );

          const comentarios = detalles.map(
            (d) => d.data?.comentario ?? "Sin comentario"
          );
          setCalificaciones(comentarios);
        } else {
          console.log("No hay IDs válidos de calificaciones");
          setCalificaciones([]);
        }
      } else {
        console.log("No hay calificaciones registradas en la clase");
        setCalificaciones([]);
      }

    } catch (error) {
      console.error("Error al obtener los detalles de la clase:", error);
      Alert.alert("Error", "No se pudieron cargar los detalles de la clase. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };
  fetchClase();

  }, []);


  
  const estaReservada = async ()=>{
    try
    {
      const {data:reservas} = await api.get(`/reservas/usuario/${user.id}`);
      return reservas.some((r) => r.idClase === clase.id);
    }
    catch(error)
    {

      console.error("Error al verificar la reserva:", error);
      return false;
    }

  }
  const cupoDisponible = true;
  const puedeReservar = cupoDisponible && !estaReservada;

  const handleReservar = async () => {
    if (!puedeReservar) return;

    try {
      const res = await api.post("/reservas", {
        idClase: clase.idClase,
        idUsuario: user.id,
        estado: "CONFIRMADA",
        timestampCreacion: new Date().toISOString(),
      });

      if (res.data?.idReserva) {
        Alert.alert("Éxito", "Reserva creada con éxito.");
        setReservas([...reservas, res.data]); // Actualiza las reservas locales
      } else {
        Alert.alert("Error", "No se pudo crear la reserva.");
      }
    } catch (error) {
      console.error("Error al reservar:", error);
      Alert.alert("Error", "Ocurrió un error al reservar la clase.");
    }
  };
  const isLoading = !clase;
  
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
              {item.profesorNombre}
            </Text>
          </Text>

          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Sede:{' '}
            <Text variant="titleMedium" style={{ color: theme.colors.tertiary, fontWeight: "600" }}>
              {item.sedeNombre}
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

                      {/* Calificaciones */}
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Calificaciones:{' '}
              <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
                {Array.isArray(calificaciones) && calificaciones.length > 0
                  ? calificaciones.length
                  : 0}
              </Text>
            </Text>

            {/* Lista de comentarios */}
            {Array.isArray(calificaciones) && calificaciones.length > 0 ? (
              calificaciones.map((comentario, index) => (
                <Text
                  key={index}
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.secondary,
                    marginLeft: 16,
                    marginTop: 4,
                  }}
                >
                  • {comentario}
                </Text>
              ))
            ) : (
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginLeft: 16,
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                No hay calificaciones disponibles
              </Text>
            )}
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