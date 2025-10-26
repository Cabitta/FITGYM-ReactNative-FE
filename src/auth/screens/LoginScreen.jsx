import React, { useState, useEffect } from "react";
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
import { useAuth } from "../AuthProvider";
import * as LocalAuthentication from "expo-local-authentication";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { login, loginWithBiometric } = useAuth();

  // Detectar si el dispositivo tiene biometría disponible
  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    };
    checkBiometrics();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Manejar login biométrico
  const handleBiometricLogin = async () => {
    const res = await loginWithBiometric();
    if (res.success) {
      Alert.alert("Bienvenido", `Inicio de sesión como ${res.user.username}`);
    } else {
      Alert.alert("Error", res.error || "No se pudo autenticar con biometría");
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
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
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.form}>
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
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                error={errors.password}
              />

              <AuthButton
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />

              {/* 🔹 Botón opcional biométrico */}
              {biometricAvailable && (
                <AuthButton
                  title="Usar huella o reconocimiento facial"
                  onPress={handleBiometricLogin}
                  variant="secondary"
                  style={{ marginBottom: 16 }}
                />
              )}

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                <AuthButton
                  title="Registrarse"
                  onPress={handleRegisterPress}
                  variant="secondary"
                  style={[styles.registerButton, styles.linkButton]}
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
  form: {
    width: "100%",
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: "auto",
  },
  linkButton: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 44,
    marginLeft: 8,
  },
});

export default LoginScreen;
