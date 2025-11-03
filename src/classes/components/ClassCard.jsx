// src/components/ClassCard.jsx
import React from 'react';
import {
  Card,
  Text,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useTheme } from '../../config/theme';

export default function ClassCard({ clase, onPress }) {
  const { theme } = useTheme();

  const cupoText = clase.cupo > 0 ? `Cupos: ${clase.cupo}` : 'Sin cupo';
  const cupoColor = clase.cupo > 0 ? theme.colors.secondary : theme.colors.error;

  return (
    <Card
      onPress={onPress}
      style={{
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        elevation: 4,
      }}
      mode="elevated"
    >
      <Card.Content
        style={{
          padding: 16,
          gap: 12,
        }}
      >
        {/* Header: Disciplina + Cupos */}
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            variant="titleMedium"
            style={{color: theme.colors.primary, 
              fontWeight: 'bold',
            }}
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
        </Card.Content>

        {/* Fecha y Horario */}
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.tertiary, 
          }}
        >
          {clase.fecha} • {clase.horarioInicio?.substring(0, 5)} - {clase.horarioFin?.substring(0, 5)}
        </Text>

        {/* Sede */}
        <Text
          variant="bodyMedium"
          style={{color: theme.colors.onSurfaceVariant}}
        >
          Sede:{' '}
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

        {/* Profesor */}
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Profesor:{' '}
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
      </Card.Content>
    </Card>
  );
}