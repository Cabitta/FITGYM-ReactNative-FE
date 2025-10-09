import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import authService from "../services/authService";

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    }
    // Comentado temporalmente para desarrollo
    // else if (formData.password.length < 6) {
    //   newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    // }

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
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

      const result = await authService.register(userData);

      if (result.success) {
        Alert.alert("Éxito", "Registro exitoso", [
          {
            text: "OK",
            onPress: () => {
              // Navegar a la pantalla principal o dashboard
              // navigation.navigate('Dashboard'); // Descomenta cuando tengas la navegación configurada
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    // navigation.navigate('Login'); // Descomenta cuando tengas la navegación configurada
    Alert.alert("Info", "Navegar a pantalla de login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Registrarse</Text>

            <View style={styles.form}>
              <AuthInput
                label="Nombre"
                value={formData.nombre}
                onChangeText={(value) => handleInputChange("nombre", value)}
                placeholder="Ingresa tu nombre completo"
                error={errors.nombre}
              />

              <AuthInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="Ingresa tu email"
                keyboardType="email-address"
                error={errors.email}
              />

              <AuthInput
                label="Contraseña"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                placeholder="Crea una contraseña"
                secureTextEntry
                error={errors.password}
              />

              <AuthInput
                label="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Confirma tu contraseña"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <AuthButton
                title="Registrarse"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <AuthButton
                  title="Iniciar Sesión"
                  onPress={handleLoginPress}
                  variant="secondary"
                  style={styles.loginButton}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  registerButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: "auto",
  },
});

export default RegisterScreen;
