import { StyleSheet } from "react-native";
import { Text, View } from "react-native-web";

export default function Reserva({ route }) {
  const { reserva, actualizar } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la Reserva</Text>
      <Text style={styles.detailText}>ID: {reserva.id}</Text>
      <Text style={styles.detailText}>Nombre: {reserva.nombre}</Text>
      <Text style={styles.detailText}>Fecha: {reserva.fecha}</Text>
      <Text style={styles.detailText}>Hora: {reserva.hora}</Text>
      <Text style={styles.detailText}>Estado: {reserva.estado}</Text>
      <Text style={styles.detailText}>Clase ID: {reserva.claseId}</Text>
      <Text style={styles.detailText}>Usuario ID: {reserva.usuarioId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
