import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ClassCard({ clase, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{clase.disciplina}</Text>
        <Text style={styles.cupo}>{clase.cupo > 0 ? `Cupos: ${clase.cupo}` : 'Sin cupo'}</Text>
      </View>
      <Text style={styles.meta}>
        {clase.fecha} • {clase.horarioInicio?.substring(0, 5)} - {clase.horarioFin?.substring(0, 5)}
      </Text>
      <Text style={styles.meta}>
        Sede: <Text style={styles.metaValue}>{clase.sedeNombre || 'No disponible'}</Text>
      </Text>
      <Text style={styles.meta}>
        Profesor: <Text style={styles.metaValue}>{clase.profesorNombre || 'No asignado'}</Text>
      </Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2A2D43' },
  cupo: { color: '#6C63FF', fontWeight: '600' },
  meta: { color: '#6C63FF', marginVertical: 4 },
  sub: { color: '#555', fontSize: 14 },
});
