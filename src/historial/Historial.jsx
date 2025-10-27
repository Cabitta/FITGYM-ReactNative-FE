import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import useSWR from "swr";
import { useAuth } from "../auth/AuthProvider";
import axiosInstance from "../config/interceptors";

export default function Historial() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);

  // Obtener reservas del usuario
  const { data: reservas, error, isLoading } = useSWR(
    user?.id ? `/reservas/usuario/${user.id}` : null,
    async (url) => {
      const response = await axiosInstance.get(url);
      return response.data;
    }
  );

  // Obtener detalles de clases y sedes
  const fetchDetails = async (reservas) => {
    if (!reservas || reservas.length === 0) return [];

    const turnosCompletos = await Promise.all(
      reservas.map(async (item) => {
        // Obtener detalles de la clase
        const claseResponse = await axiosInstance.get(`/clases/${item.idClase}`);
        const clase = claseResponse.data;

        // Obtener detalles de la sede
        const sedeResponse = await axiosInstance.get(`/sedes/${clase.idSede}`);
        const sede = sedeResponse.data;

        return {
          ...item,
          disciplina: clase.disciplina,
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
  useSWR(reservas ? `historial-details-${user.id}` : null, () => fetchDetails(reservas), {
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar el historial.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1c1c1e" />
      </View>
    );
  }

  if (!turnos || turnos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No tienes historial de turnos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Turnos</Text>
      <View style={styles.divider} />
      <FlatList
        contentContainerStyle={styles.contenedorHistorial}
        data={turnos}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.detailText}>Clase: {item.disciplina}</Text>
            <Text style={styles.detailText}>Horario creación: {item.timestampCreacion}</Text>
            <Text style={styles.detailText}>Estado: {item.estado}</Text>
            <Text style={styles.detailText}>Sede: {item.nombreSede}</Text>
            <Text style={styles.detailText}>Ubicación: {item.ubicacion} ({item.barrioSede})</Text>
          </View>
        )}
        keyExtractor={(item) => item.idReserva.toString()}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f8fc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1c1c1e",
    textAlign: "center",
  },
  divider: {
    borderWidth: 1,
    borderColor: "snd",
    width: "100%",
    marginBottom: 12,
  },
  contenedorHistorial: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
  },
  tarjeta: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
    minHeight: 150,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#1c1c1e",
  },
  errorText: {
    fontSize: 16,
    color: "#FF4D4F",
  },
  emptyText: {
    fontSize: 16,
    color: "#1c1c1e",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};