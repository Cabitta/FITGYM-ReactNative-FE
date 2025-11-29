import React from 'react';
import { Card, Text, Avatar } from 'react-native-paper';
import { useTheme } from '../../config/theme';

const UserInfoCard = ({ user }) => {
  const { theme } = useTheme();

  if (!user) {
    return (
      <Card style={{ margin: 16 }}>
        <Card.Content style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text variant="titleLarge">Usuario no disponible</Text>
        </Card.Content>
      </Card>
    );
  }

  // Limpia espacios o saltos en la imagen base64
  const cleanBase64 = user.foto?.replace(/\s/g, '');
  const imageUri = cleanBase64
    ? cleanBase64.startsWith('data:image')
      ? cleanBase64
      : `data:image/png;base64,${cleanBase64}`
    : null;

  // Si no tiene imagen, usa un emoji o inicial
  const hasImage = !!imageUri;
  const displayText = '🧟‍♂️';

  return (
    <Card style={{ margin: 16, borderRadius: 16, elevation: 3 }}>
      <Card.Content style={{ alignItems: 'center', paddingVertical: 24 }}>
        {hasImage ? (
          <Avatar.Image
            size={128}
            source={{ uri: imageUri }}
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Avatar.Text
            size={128}
            label={displayText}
            style={{
              backgroundColor: '#e0e0e0',
              marginBottom: 16,
            }}
            color="#424242"
          />
        )}

        <Text variant="headlineSmall">{user.nombre || 'Sin nombre'}</Text>
        <Text variant="bodyMedium" style={{ color: '#666' }}>
          {user.email || 'Sin email'}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
          Editar
        </Text>
      </Card.Content>
    </Card>
  );
};

export default UserInfoCard;
