import React from 'react';
import { View } from 'react-native';
import { Card, Text, Icon, Divider } from 'react-native-paper';
import { useTheme } from '../config/theme';

export default function ItemHistorial({ item = null }) {
  const { theme } = useTheme();

  if (item == null) {
    return (
      <Card style={{ marginVertical: 8, padding: 16 }}>
        <Text>Tarjeta Vacia</Text>
      </Card>
    );
  }

  // Determinar color del estado
  let estadoColor = theme.colors.onSurface;
  if (item.estado === 'CONFIRMADA') estadoColor = theme.colors.secondary;
  else if (item.estado === 'CANCELADA') estadoColor = theme.colors.error;
  else if (item.estado === 'EXPIRADA') estadoColor = theme.colors.tertiary;

  return (
    <Card
      style={{
        marginBottom: 12,
        padding: 10,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        elevation: 4,
      }}
      mode="elevated"
    >
      <Card.Content style={{ gap: 12 }}>
        {/* Header: Disciplina + ID */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
          >
            {item.disiplina}
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: theme.colors.secondary,
              fontSize: 12,
            }}
          >
            Id:{item.id}
          </Text>
        </View>

        <Divider />

        {/* Fecha */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="calendar-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Dia:{' '}
            <Text
              style={{
                color: theme.colors.tertiary,
                fontWeight: '600',
              }}
            >
              {item.fecha}
            </Text>
          </Text>
        </View>

        {/* Horario */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="clock-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Horario:{' '}
            <Text
              style={{
                color: theme.colors.tertiary,
                fontWeight: '600',
              }}
            >
              {item.horarioInicio?.substring(0, 5)} -{' '}
              {item.horarioFin?.substring(0, 5)}
            </Text>
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
            Sede:{' '}
            <Text
              style={{
                color: theme.colors.tertiary,
                fontWeight: '600',
              }}
            >
              {item.sede} - {item.barrio}
            </Text>
          </Text>
        </View>

        {/* Estado (Nuevo Campo) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon
            source="information-outline"
            size={20}
            color={theme.colors.tertiary}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Estado:{' '}
            <Text
              style={{
                color: estadoColor,
                fontWeight: 'bold',
              }}
            >
              {item.estado}
            </Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
