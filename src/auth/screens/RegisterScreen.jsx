import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  Button,
  Surface,
  Card,
  HelperText,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../../config/theme";

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar password
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const result = await register(userData);

      if (!result.success) {
        Alert.alert("Error", "No se pudo registrar el usuario");
      } else {
        // Si el registro fue exitoso, navegar a la pantalla de OTP para
        // completar la verificación y obtener los tokens.
        navigation.navigate("Otp", { email: userData.email });
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleEmailInputPress = () => {
    navigation.navigate("EmailInput", {
      email: formData.email.trim(),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
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
                  textAlign: "center",
                  marginBottom: 32,
                  fontWeight: "bold",
                }}
              >
                Registrarse
              </Text>
              {/* Nombre */}
              <TextInput
                label="Nombre"
                value={formData.nombre}
                onChangeText={(v) => handleInputChange("nombre", v)}
                mode="outlined"
                style={{ backgroundColor: theme.colors.surface }}
                outlineColor={
                  errors.nombre ? theme.colors.error : theme.colors.outline
                }
                activeOutlineColor={theme.colors.primary}
                theme={{ roundness: 12 }}
              />
              <HelperText type="error" visible={!!errors.nombre}>
                {errors.nombre}
              </HelperText>

              {/* Email */}
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(v) => handleInputChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                style={{ backgroundColor: theme.colors.surface }}
                outlineColor={
                  errors.email ? theme.colors.error : theme.colors.outline
                }
                activeOutlineColor={theme.colors.primary}
                theme={{ roundness: 10 }}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              {/* Contraseña */}
              <TextInput
                label="Contraseña"
                value={formData.password}
                onChangeText={(v) => handleInputChange("password", v)}
                secureTextEntry
                mode="outlined"
                style={{ backgroundColor: theme.colors.surface }}
                outlineColor={
                  errors.password ? theme.colors.error : theme.colors.outline
                }
                activeOutlineColor={theme.colors.primary}
                theme={{ roundness: 10 }}
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>

              {/* Confirmar Contraseña */}
              <TextInput
                label="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChangeText={(v) => handleInputChange("confirmPassword", v)}
                secureTextEntry
                mode="outlined"
                style={{ backgroundColor: theme.colors.surface }}
                outlineColor={
                  errors.confirmPassword
                    ? theme.colors.error
                    : theme.colors.outline
                }
                activeOutlineColor={theme.colors.primary}
                theme={{ roundness: 10 }}
              />
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>

              {/* Botón Registrarse */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16, fontWeight: "600" }}
                buttonColor={theme.colors.primary}
                style={{ borderRadius: 12, marginTop: 8 }}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
              {/* Ir a Iniciar Sesión */}
              <Button
                mode="text"
                onPress={handleLoginPress}
                compact
                style={{ marginTop: 32 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: "600",
                }}
              >
                ¿Ya tienes una cuenta?
              </Button>

              {/* Ir a Enviar Código */}
              <Button
                mode="text"
                onPress={handleEmailInputPress}
                compact
                style={{ marginTop: 16 }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontWeight: "600",
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

export default RegisterScreen;
