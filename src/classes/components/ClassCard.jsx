// src/components/ClassCard.jsx
import React from 'react';
import {
  Card,
  Text,
  useTheme as usePaperTheme,
  Icon,
  Divider,
} from 'react-native-paper';
import { View } from 'react-native';
import { useTheme } from '../../config/theme';

export default function ClassCard({ clase, onPress }) {
  const { theme } = useTheme();

  const cupoText = clase.cupo > 0 ? `Cupos: ${clase.cupo}` : 'Sin cupo';
  const cupoColor =
    clase.cupo > 0 ? theme.colors.secondary : theme.colors.error;

  return (
    <Card
      onPress={onPress}
      style={{
        marginBottom: 12,
        padding: 10,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        elevation: 4,
      }}
      mode="elevated"
    >
      <Card.Content
        style={{
          gap: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          {/* Header: Disciplina + Cupos */}
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
          >
            {clase.disciplina}
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: cupoColor,
              fontWeight: '600',
            }}
          >
            {cupoText}
          </Text>
        </View>

        <Divider />

        {/* Fecha y Horario */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="clock-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.tertiary,
            }}
          >
            {clase.fecha} • {clase.horarioInicio?.substring(0, 5)} -{' '}
            {clase.horarioFin?.substring(0, 5)}
          </Text>
        </View>

        {/* Sede */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="map-marker-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.tertiary,
                fontWeight: '600',
              }}
            >
              {clase.sedeNombre || 'No disponible'}
            </Text>
          </Text>
        </View>

        {/* Profesor */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="account-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.tertiary,
                fontWeight: '600',
              }}
            >
              {clase.profesorNombre || 'No asignado'}
            </Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
