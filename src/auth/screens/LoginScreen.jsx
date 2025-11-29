import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
  View,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme as usePaperTheme,
  HelperText,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../AuthProvider';
import { useTheme } from '../../config/theme';

const LoginScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const paperTheme = usePaperTheme();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithBiometric } = useAuth();

  // Detectar biometría
  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.getEnrolledLevelAsync();

      if (compatible && enrolled > 0) {
        setBiometricAvailable(true);
      } else {
        setBiometricAvailable(false);
        if (compatible && enrolled === 0) {
          Alert.alert(
            'Autenticación requerida',
            'Configura huella o reconocimiento facial en Ajustes.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Ir a Ajustes', onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    };

    checkBiometrics();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        Alert.alert('Error al iniciar sesión', 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado ');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const res = await loginWithBiometric();
    if (res.success) {
      Alert.alert('Éxito', `Bienvenido, ${res.user.username}`);
    } else {
      Alert.alert('Error', res.error || 'Autenticación biométrica fallida');
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleEmailInputPress = () => {
    navigation.navigate('EmailInput', {
      email: formData.email.trim(),
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <Card
            elevation={2}
            style={{
              padding: 16,
              marginHorizontal: 16,
              borderRadius: 16,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Content>
              {/* Título */}
              <Text
                variant="headlineMedium"
                style={{
                  textAlign: 'center',
                  marginBottom: 32,
                  fontWeight: 'bold',
                }}
              >
                Iniciar Sesión
              </Text>
              {/* Email */}
              <View>
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={v => handleInputChange('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  error={!!errors.email}
                  theme={{ roundness: 12 }}
                  style={{ backgroundColor: theme.colors.surface }}
                  outlineColor={
                    errors.email ? theme.colors.error : theme.colors.outline
                  }
                  activeOutlineColor={theme.colors.primary}
                  left={<TextInput.Icon icon="email-outline" />}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>
              </View>

              {/* Contraseña */}
              <View>
                <TextInput
                  label="Contraseña"
                  value={formData.password}
                  onChangeText={v => handleInputChange('password', v)}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  error={!!errors.password}
                  theme={{ roundness: 12 }}
                  style={{ backgroundColor: theme.colors.surface }}
                  outlineColor={
                    errors.password ? theme.colors.error : theme.colors.outline
                  }
                  activeOutlineColor={theme.colors.primary}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>
              </View>

              {/* Botón Iniciar Sesión */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                style={{ borderRadius: 12 }}
                buttonColor={theme.colors.primary}
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>

              {/* Biometría */}
              {biometricAvailable && (
                <Button
                  mode="outlined"
                  onPress={handleBiometricLogin}
                  icon={isDarkMode ? 'fingerprint' : 'face-recognition'}
                  contentStyle={{ height: 48 }}
                  style={{
                    borderRadius: 12,
                    marginTop: 24,
                    borderColor: theme.colors.secondary,
                  }}
                  labelStyle={{ color: theme.colors.secondary }}
                >
                  Usar Huella / Rostro
                </Button>
              )}

              {/* Ir a Registro */}
              <Button
                mode="text"
                onPress={handleRegisterPress}
                compact
                style={{ marginTop: 32 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                ¿No tienes cuenta?
              </Button>

              {/* Ir a Enviar Código */}
              <Button
                mode="text"
                onPress={handleEmailInputPress}
                compact
                style={{ marginTop: 16 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                ¿Tu cuenta está deshabilitada?
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
