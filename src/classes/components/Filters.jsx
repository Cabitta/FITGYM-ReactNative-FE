import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Filters({
  sede, setSede, sedes, sedeOpen, setSedeOpen,
  disciplina, setDisciplina, disciplinas, disciplinaOpen, setDisciplinaOpen,
  fecha, setFecha, limpiarFiltros,
  datePickerVisible, setDatePickerVisible
}) {
  const handleDateOpen = () => {
    setSedeOpen(false);
    setDisciplinaOpen(false);
    setTimeout(() => setDatePickerVisible(true), 150);
  };

  const handleConfirm = (selectedDate) => {
    setFecha(selectedDate);
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.filters}>

      <DropDownPicker
        open={sedeOpen}
        value={sede}
        items={sedes}
        setOpen={setSedeOpen}
        setValue={setSede}
        placeholder="Seleccionar sede"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        zIndex={3000}
        zIndexInverse={1000}
      />

      <DropDownPicker
        open={disciplinaOpen}
        value={disciplina}
        items={disciplinas}
        setOpen={setDisciplinaOpen}
        setValue={setDisciplina}
        placeholder="Seleccionar disciplina"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        zIndex={2000}
        zIndexInverse={2000}
      />

      <TouchableOpacity style={styles.dateButton} onPress={handleDateOpen}>
        <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#6C63FF" />
        <Text style={styles.dateButtonText}>
          {fecha ? fecha.toISOString().split('T')[0] : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />

      <TouchableOpacity style={styles.resetBtn} onPress={limpiarFiltros}>
        <MaterialCommunityIcons name="filter-remove-outline" size={18} color="#fff" />
        <Text style={styles.resetText}>Limpiar filtros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  dropdown: {
    borderColor: '#E1E2EE',
    backgroundColor: '#F9F9FC',
    borderRadius: 10,
    marginBottom: 10,
    zIndex: 10,
  },
  dropdownList: {
    borderColor: '#E1E2EE',
    backgroundColor: '#FFF',
  },
  dateButton: {
    backgroundColor: '#ECECFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dateButtonText: { color: '#6C63FF', fontWeight: '600' },
  resetBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 6,
    gap: 6,
  },
  resetText: { color: '#fff', fontWeight: 'bold' },
});
