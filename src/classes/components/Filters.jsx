// src/components/Filters.jsx
import React, { useCallback } from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../config/theme';

export default function Filters({
  sede,
  setSede,
  sedes,
  sedeOpen,
  setSedeOpen,
  disciplina,
  setDisciplina,
  disciplinas,
  disciplinaOpen,
  setDisciplinaOpen,
  fecha,
  setFecha,
  limpiarFiltros,
  datePickerVisible,
  setDatePickerVisible,
}) {
  const { theme } = useTheme();

  const handleDateConfirm = useCallback(
    params => {
      setDatePickerVisible(false);
      setFecha(params.date);
    },
    [setDatePickerVisible, setFecha]
  );

  const formatDate = date => {
    if (!date) return 'Seleccionar fecha';
    return date.toISOString().split('T')[0];
  };

  return (
    <Card
      mode="elevated"
      style={{
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        elevation: 6,
        overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
        zIndex: 1000,
      }}
    >
      <Card.Content style={{ padding: 16, gap: 12 }}>
        {/* Dropdown Sede */}
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={sedeOpen}
            value={sede}
            items={sedes}
            setOpen={setSedeOpen}
            setValue={setSede}
            placeholder="Seleccionar sede"
            style={{
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              minHeight: 48,
            }}
            dropDownContainerStyle={{
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              elevation: 4,
            }}
            textStyle={{
              color: theme.colors.onSurface,
              fontSize: 16,
            }}
            ArrowUpIconComponent={() => (
              <IconButton
                icon="chevron-up"
                size={20}
                iconColor={theme.colors.primary}
              />
            )}
            ArrowDownIconComponent={() => (
              <IconButton
                icon="chevron-down"
                size={20}
                iconColor={theme.colors.primary}
              />
            )}
          />
        </View>

        {/* Dropdown Disciplina */}
        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={disciplinaOpen}
            value={disciplina}
            items={disciplinas}
            setOpen={setDisciplinaOpen}
            setValue={setDisciplina}
            placeholder="Seleccionar disciplina"
            style={{
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              minHeight: 48,
            }}
            dropDownContainerStyle={{
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              elevation: 4,
            }}
            textStyle={{
              color: theme.colors.onSurface,
              fontSize: 16,
            }}
            ArrowUpIconComponent={() => (
              <IconButton
                icon="chevron-up"
                size={20}
                iconColor={theme.colors.primary}
              />
            )}
            ArrowDownIconComponent={() => (
              <IconButton
                icon="chevron-down"
                size={20}
                iconColor={theme.colors.primary}
              />
            )}
          />
        </View>

        {/* Botón Fecha */}
        <Button
          mode="outlined"
          onPress={() => setDatePickerVisible(true)}
          icon="calendar-month-outline"
          contentStyle={{ justifyContent: 'flex-start', height: 48 }}
          style={{
            borderRadius: 12,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
          }}
          labelStyle={{
            color: theme.colors.onSurface,
            fontSize: 16,
            marginLeft: 8,
          }}
        >
          {fecha ? formatDate(fecha) : 'Seleccionar fecha'}
        </Button>

        {/* DatePicker de Paper */}
        <DatePickerModal
          locale="es"
          mode="single"
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          date={fecha}
          onConfirm={handleDateConfirm}
          label="Seleccionar fecha"
          saveLabel="Confirmar"
          uppercase={false}
          animationType="slide"
        />

        {/* Botón Limpiar */}
        <Button
          mode="contained"
          onPress={limpiarFiltros}
          icon="filter-remove-outline"
          contentStyle={{ height: 48 }}
          style={{ borderRadius: 12, marginTop: 8 }}
          buttonColor={theme.colors.primary}
          labelStyle={{ fontWeight: 'bold' }}
        >
          Limpiar Filtros
        </Button>
      </Card.Content>
    </Card>
  );
}
