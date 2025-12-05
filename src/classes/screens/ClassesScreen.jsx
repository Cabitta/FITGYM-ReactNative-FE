import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, ScrollView, View } from 'react-native';
import {
  Surface,
  Text,
  ActivityIndicator,
  List,
  IconButton,
  Appbar,
} from 'react-native-paper';
import Filters from '../components/Filters';
import ClassCard from '../components/ClassCard';
import ClassDetailModal from '../components/ClassDetailModal';
import { getClasesEnriched } from '../services/classService';
import { useTheme } from '../../config/theme';
import NewsSection from '../../news/components/NewsSection';
import { useFocusEffect } from '@react-navigation/native';

export default function ClassesScreen({ navigation }) {
  const { theme } = useTheme();

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

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);

  const ymd = d => {
    if (!d) return null;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const data = await getClasesEnriched();
          setClases(data);
          setFiltered(data);

          const sedesUnicas = Array.from(
            new Set(data.map(c => c.sedeNombre))
          ).filter(Boolean);
          const disciplinasUnicas = Array.from(
            new Set(data.map(c => c.disciplina))
          ).filter(Boolean);

          setSedes([
            { label: 'Todas las sedes', value: null },
            ...sedesUnicas.map(s => ({ label: s, value: s })),
          ]);
          setDisciplinas([
            { label: 'Todas las disciplinas', value: null },
            ...disciplinasUnicas.map(d => ({ label: d, value: d })),
          ]);
        } catch (error) {
          console.error('Error al obtener clases:', error);
          Alert.alert(
            'Error',
            'No se pudieron cargar las clases. Intenta más tarde.'
          );
        } finally {
          setLoading(false);
        }
      })();
    }, [])
  );

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

  const renderEmpty = () => (
    <Surface
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.background,
      }}
    >
      <IconButton
        icon="calendar-remove"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text
        variant="titleLarge"
        style={{
          color: theme.colors.onSurfaceVariant,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        No hay clases disponibles
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Intenta cambiar los filtros o vuelve más tarde.
      </Text>
    </Surface>
  );

  if (loading) {
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          variant="titleMedium"
          style={{
            marginTop: 16,
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Cargando clases...
        </Text>
      </Surface>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 14,
      }}
    >
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
      <FlatList
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 18 }}
        data={filtered}
        keyExtractor={item => item.idClase}
        renderItem={({ item }) => (
          <ClassCard
            clase={item}
            onPress={() => {
              setSelectedClase(item);
              setModalVisible(true);
            }}
          />
        )}
        ListEmptyComponent={renderEmpty()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<NewsSection />}
      />

      <ClassDetailModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setSelectedClase(null);
        }}
        clase={selectedClase}
      />
    </View>
  );
}
