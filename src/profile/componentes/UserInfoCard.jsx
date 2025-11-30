import React from 'react';
import { Card, Text, Avatar } from 'react-native-paper';
import { useTheme } from '../../config/theme';

const UserInfoCard = ({ user }) => {
  const { theme } = useTheme();

  if (!user) {
    return (
      <Card>
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

  return (
    <Card
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        elevation: 3,
      }}
    >
      <Card.Title
        title="Editar Perfil"
        titleStyle={{ color: theme.colors.primary }}
      />
      <Card.Content style={{ alignItems: 'center' }}>
        {hasImage ? (
          <Avatar.Image
            size={130}
            source={{ uri: imageUri }}
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Avatar.Text
            size={130}
            label={'👤'}
            style={{ backgroundColor: theme.colors.disabled }}
          />
        )}

        <Text variant="headlineSmall">{user.nombre || 'Sin nombre'}</Text>
        <Text variant="bodyMedium" style={{ color: '#666' }}>
          {user.email || 'Sin email'}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default UserInfoCard;
