import { nanoid } from "nanoid";
import useSWR from "swr";
import { useAuth } from "../../auth/AuthProvider";
import { fetcher } from "../../config/fetcher";

/**
calificaciones: ['68a088242ab0aed48f63593e']
cupo: 6
disciplina: "Zumba"
duracion: 30
estado: "CREADA"   
fecha: "2025-08-16"
horarioFin: "10:3:5"
horarioInicio: "10:3:5"
idClase: "68a08aa22ab0aed48f635941"
idProfesor: "68a087912ab0aed48f63593d"
idSede: "68a08a382ab0aed48f635940"
profesorNombre: "dieguito capusotto"
sedeNombre: "Balcarce house"
 */

export default function ClassDetail({ route }) {
  const { clase } = route.params;

  const { user, token } = useAuth();
  const { data, mutate } = useSWR(`/reservas/clase/${clase.idClase}`, (url) =>
    fetcher(url, { headers: { Authorization: `Bearer ${token}` } })
  );

  const estaReservada = useMemo(() => {
    if (!data) return false;
    if (!user) return false;
    return data.some((r) => r.idUsuario === user.id);
  }, [data, user]);

  async function handleReservar() {
    if (!data) return;
    if (!user) return;

    if (estaReservada) return alert("Ya tienes una reserva para esta clase.");
    if (clase.cupo === 0) return alert("No hay cupos disponibles.");

    const res = await fetcher("/reservas", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        idReserva: nanoid(), // Debería ser generado por el backend?
        idClase: clase.idClase,
        idUsuario: user.id,
        estado: "CONFIRMADA", // CONFIRMADA, CANCELADA, EXPIRADA
        timestampCreacion: new Date().toISOString(),
      },
    });

    if (res?.idReserva) alert("Reserva creada con éxito.");
    else alert("Error al crear la reserva.");

    console.log("Reserva response:", res);
    mutate(); // refrescar lista de reservas
  }

  console.log("Token:", token);
  console.log("Clase:", clase);
  console.log("Reservas:", data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{clase.disciplina}</Text>
      <Text style={styles.label}>
        Profesor: <Text style={styles.value}>{clase.profesorNombre}</Text>
      </Text>
      <Text style={styles.label}>
        Sede: <Text style={styles.value}>{clase.sedeNombre}</Text>
      </Text>
      <Text style={styles.label}>
        Fecha: <Text style={styles.value}>{clase.fecha}</Text>
      </Text>
      <Text style={styles.label}>
        Horario:{" "}
        <Text style={styles.value}>
          {clase.horarioInicio} - {clase.horarioFin}
        </Text>
      </Text>
      <Text style={styles.label}>
        Duración: <Text style={styles.value}>{clase.duracion} minutos</Text>
      </Text>
      <Text style={styles.label}>
        Cupos: <Text style={styles.value}>{clase.cupo}</Text>
      </Text>
      <Text style={styles.label}>
        Calificaciones:{" "}
        <Text style={styles.value}>
          {Array.isArray(clase.calificaciones)
            ? clase.calificaciones.length
            : 0}
        </Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          (estaReservada || clase.cupo === 0) && { backgroundColor: "#ccc" },
        ]}
        onPress={handleReservar}
        disabled={clase.cupo === 0}
      >
        <Text style={styles.buttonText}>
          {estaReservada
            ? "Reservada"
            : clase.cupo === 0
            ? "Cupo lleno"
            : "Reservar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#6C63FF",
  },
  label: { fontSize: 18, marginBottom: 8, color: "#333" },
  value: { fontWeight: "600", color: "#222" },
  button: {
    marginTop: 24,
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
