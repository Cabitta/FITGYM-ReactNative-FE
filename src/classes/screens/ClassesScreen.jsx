
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Filters from '../components/Filters';
import ClassCard from '../components/ClassCard';
import { getClasesEnriched } from '../services/classService';

export default function ClassesScreen({ navigation }) {
  const [clases, setClases] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [sedes, setSedes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [sede, setSede] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [fecha, setFecha] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sedeOpen, setSedeOpen] = useState(false);
  const [disciplinaOpen, setDisciplinaOpen] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const ymd = (d) => {
    if (!d) return null;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getClasesEnriched();
        setClases(data);
        setFiltered(data);

        const sedesUnicas = Array.from(new Set(data.map(c => c.sedeNombre))).filter(Boolean);
        const disciplinasUnicas = Array.from(new Set(data.map(c => c.disciplina))).filter(Boolean);

        setSedes([{ label: 'Todas las sedes', value: null }, ...sedesUnicas.map(s => ({ label: s, value: s }))]);
        setDisciplinas([{ label: 'Todas las disciplinas', value: null }, ...disciplinasUnicas.map(d => ({ label: d, value: d }))]);
      } catch (error) {
        console.error('❌ Error al obtener clases:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  useEffect(() => {
    let result = [...clases];
    if (sede) result = result.filter(c => c.sedeNombre === sede);
    if (disciplina) result = result.filter(c => c.disciplina === disciplina);
    if (fecha) result = result.filter(c => c.fecha === ymd(fecha));
    setFiltered(result);
  }, [sede, disciplina, fecha, clases]);

  const limpiarFiltros = () => {
    setSede(null);
    setDisciplina(null);
    setFecha(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Clases Disponibles</Text>

      <Filters
        sede={sede}
        setSede={setSede}
        sedes={sedes}
        sedeOpen={sedeOpen}
        setSedeOpen={setSedeOpen}
        disciplina={disciplina}
        setDisciplina={setDisciplina}
        disciplinas={disciplinas}
        disciplinaOpen={disciplinaOpen}
        setDisciplinaOpen={setDisciplinaOpen}
        fecha={fecha}
        setFecha={setFecha}
        limpiarFiltros={limpiarFiltros}
        datePickerVisible={datePickerVisible}
        setDatePickerVisible={setDatePickerVisible}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 50 }} />
      ) : filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.idClase}
          renderItem={({ item }) => (
            <ClassCard
              clase={item}
              onPress={() => navigation.navigate('ClassDetail', { clase: item })}
            />
          )}
        />
      ) : (
        <Text style={styles.empty}>No hay clases disponibles</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fc', padding: 14 },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1c1c1e',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#8e8e93',
    fontSize: 16,
  },
});
