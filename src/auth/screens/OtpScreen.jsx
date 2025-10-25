import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../AuthProvider";

const OtpScreen = ({ navigation, route }) => {
  const { email: routeEmail } = route.params || {};
  const [email, setEmail] = useState(routeEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyOtp, resendOtp } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async () => {
    if (!email.trim() || !otp.trim()) {
      Alert.alert("Error", "Por favor ingresa email y código OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(email.trim(), otp.trim());
      if (res.success) {
        Alert.alert("Éxito", "Código verificado. Ingresando...");
      } else {
        Alert.alert("Error", res.error || "Código inválido");
      }
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  const handleResend = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa el email para reenviar");
      return;
    }
    setResendLoading(true);
    try {
      const r = await resendOtp(email.trim());
      if (r.success) {
        Alert.alert("OK", "Código reenviado al email si existe");
      } else {
        Alert.alert("Error", r.error || "No se pudo reenviar el código");
      }
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Habilitar Cuenta</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="tu@email.com"
          />

          <Text style={styles.label}>Código OTP</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            placeholder="Ingresa el código"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verificando..." : "Verificar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonSecondary,
              resendLoading && styles.buttonDisabled,
            ]}
            onPress={handleResend}
            disabled={resendLoading}
          >
            <Text style={styles.buttonText}>
              {resendLoading ? "Enviando..." : "Reenviar código"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  label: { fontSize: 14, color: "#444", marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { marginTop: 16, alignItems: "center" },
  secondaryText: { color: "#007bff" },
});

export default OtpScreen;
