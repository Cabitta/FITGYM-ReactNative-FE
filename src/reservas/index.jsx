import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native-web";
import useSWR from "swr";
import { useAuth } from "../auth/AuthProvider";
import { fetcher } from "../config/fetcher";

// confirmedCheckin: false;
// estado: "CONFIRMADA";
// idClase: "68cf26265d3df22427a30e61";
// idReserva: "82zFm8yBs-nmfAzIzvaQM";
// idUsuario: "68e95944e1c402616e2a443c";
// timestampCheckin: null;
// timestampCreacion: "2025-10-10T22:43:41.821";

// Debería traerme el nombre de la clase y fecha/hora

export default function Reservas({ navigation }) {
  const { user, token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    `/reservas/usuario/${user?.id}`,
    (url) => fetcher(url, { headers: { Authorization: `Bearer ${token}` } })
  );

  console.log("Reservas data:", data);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error al cargar las reservas</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
              navigation.navigate("Reserva", {
                reserva: item,
                actualizar: mutate,
              })
            }
          >
            <Text style={styles.detailText}>
              Clase: {item.clase?.disciplina}
            </Text>
            <Text style={styles.detailText}>Fecha: {item.clase?.fecha}</Text>
            <Text style={styles.detailText}>Sede: {item.sede?.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.idReserva}
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
};
