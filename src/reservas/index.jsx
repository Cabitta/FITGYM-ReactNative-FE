import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useSWR from "swr";
import { useAuth } from "../auth/AuthProvider";
import axiosInstance from "../config/interceptors";

export default function Reservas({ navigation }) {
  const { user } = useAuth();
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // SWR obtiene automáticamente los datos
  const { data, error, isLoading, mutate } = useSWR(
    user?.id ? `/reservas/usuario/${user.id}` : null,
    async (url) => {
      const response = await axiosInstance.get(url);
      return response.data;
    }
  );

  // Cancelar reserva
  async function handleCancelar(idReserva) {
    if (!idReserva) return;
    const ok = confirm("¿Cancelar la reserva?");
    if (!ok) return;

    setIsCancelling(true);
    try {
      await axiosInstance.delete(`/reservas/${idReserva}`);
      alert("Reserva cancelada correctamente.");
      setSelectedReservaId(null);
      mutate(); // recarga la lista automáticamente
    } catch (err) {
      console.error("Error cancelando reserva:", err?.response?.data || err.message);
      alert("Error al cancelar la reserva.");
    } finally {
      setIsCancelling(false);
    }
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error al cargar las reservas.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes reservas registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.detail}
            onPress={() =>
              setSelectedReservaId(
                selectedReservaId === item.idReserva ? null : item.idReserva
              )
            }
          >
            <Text style={styles.detailText}>Clase: {item.clase?.disciplina}</Text>
            <Text style={styles.detailText}>Fecha: {item.clase?.fecha}</Text>
            <Text style={styles.detailText}>Sede: {item.sede?.nombre}</Text>

            {selectedReservaId === item.idReserva && (
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  isCancelling && styles.cancelButtonDisabled,
                ]}
                onPress={() => handleCancelar(item.idReserva)}
                disabled={isCancelling}
              >
                <Text style={styles.cancelButtonText}>
                  {isCancelling ? "Cancelando..." : "Cancelar reserva"}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
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
    marginBottom: 20,
    color: "#1c1c1e",
    textAlign: "center",
  },
  detail: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: "#FF4D4F",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButtonDisabled: {
    backgroundColor: "#f3b8b8",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
