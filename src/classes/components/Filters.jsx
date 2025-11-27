// src/components/Filters.jsx
import React from "react";
import { Platform, View } from "react-native";
import {
  Card,
  Text,
  Button,
  IconButton,
  useTheme as usePaperTheme,
  Divider,
} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from "../../config/theme";

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

  const handleDateOpen = () => {
    setSedeOpen(false);
    setDisciplinaOpen(false);
    setTimeout(() => setDatePickerVisible(true), 150);
  };

  const handleConfirm = (selectedDate) => {
    setFecha(selectedDate);
    setDatePickerVisible(false);
  };

  const formatDate = (date) => {
    if (!date) return "Seleccionar fecha";
    return date.toISOString().split("T")[0];
  };

  return (
    <Card
      mode="elevated"
      style={{
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        elevation: 6,
        overflow: Platform.OS === "android" ? "visible" : "hidden",
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
              <IconButton icon="chevron-up" size={20} color={theme.colors.primary} />
            )}
            ArrowDownIconComponent={() => (
              <IconButton icon="chevron-down" size={20} color={theme.colors.primary} />
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
              <IconButton icon="chevron-up" size={20} color={theme.colors.primary} />
            )}
            ArrowDownIconComponent={() => (
              <IconButton icon="chevron-down" size={20} color={theme.colors.primary} />
            )}
          />
        </View>

        {/* Botón Fecha */}
        <Button
          mode="outlined"
          onPress={handleDateOpen}
          icon="calendar-month-outline"
          contentStyle={{ justifyContent: "flex-start", height: 48 }}
          style={{
            borderRadius: 12,
            borderColor: theme.colors.tertiary,
            backgroundColor: theme.colors.surface,
          }}
          labelStyle={{
            color: theme.colors.onSurface,
            fontSize: 16,
            fontWeight: "00",
            marginLeft: 25,
          }}
        >
          {formatDate(fecha)}
        </Button>

        {/* DateTimePicker */}
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />

        <Divider style={{ marginVertical: 8 }} />

        {/* Botón Limpiar */}
        <Button
          mode="contained"
          onPress={limpiarFiltros}
          icon="filter-remove-outline"
          contentStyle={{ height: 48 }}
          style={{ borderRadius: 12 }}
          buttonColor={theme.colors.primary} 
          labelStyle={{ fontWeight: "bold" }}
        >
          Limpiar Filtros
        </Button>
      </Card.Content>
    </Card>
  );
}