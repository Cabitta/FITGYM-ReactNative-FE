import React, { useState } from 'react';
import { View, Image } from 'react-native';
import {
  Card,
  TextInput,
  Button,
  Text,
  useTheme,
  Avatar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../auth/AuthProvider';
import storage from '../../utils/storage';

const UserFormEdit = ({ user, onUpdated, onCancel }) => {
  const { colors } = useTheme();
  const { editProfile } = useAuth();
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    foto: user?.foto || '',
  });
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setFormData({ ...formData, foto: base64Image });
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const storedUser = await storage.getItem('user_data');
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      const res = await editProfile(userId, formData);
      if (res.success) {
        console.log(res);
        console.log('Perfil actualizado:', res.user);
        if (onUpdated) onUpdated(res.user);
      } else {
        console.error('Error al actualizar perfil:', res.error);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanBase64 = formData.foto?.replace(/\s/g, '');
  const imageUri =
    cleanBase64 && cleanBase64.startsWith('data:image')
      ? cleanBase64
      : cleanBase64
        ? `data:image/png;base64,${cleanBase64}`
        : null;

  return (
    <Card style={{ backgroundColor: colors.surface, borderRadius: 12 }}>
      <Card.Title
        title="Editar Perfil"
        titleStyle={{ color: colors.primary }}
      />
      <Card.Content>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {imageUri ? (
            <Avatar.Image
              size={130}
              source={{ uri: imageUri }}
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Avatar.Text
              size={130}
              label={'👤'}
              style={{ backgroundColor: colors.disabled }}
            />
          )}
          <Button
            mode="text"
            onPress={handleImagePick}
            icon="image-edit"
            textColor={colors.primary}
          >
            Cambiar Foto
          </Button>
        </View>

        <TextInput
          label="Nombre"
          value={formData.nombre}
          mode="outlined"
          onChangeText={text => setFormData({ ...formData, nombre: text })}
          style={{ backgroundColor: colors.surface, marginBottom: 12 }}
        />

        <TextInput
          label="Email"
          value={formData.email}
          mode="outlined"
          onChangeText={text => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          style={{ backgroundColor: colors.surface, marginBottom: 12 }}
        />

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={loading}
            style={{ flex: 1, borderRadius: 8, borderColor: colors.primary }}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            buttonColor={colors.primary}
            style={{ flex: 1, borderRadius: 8 }}
          >
            Guardar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default UserFormEdit;
